import 'highlight.js/scss/default.scss';
import Highlight from 'react-highlight'

import dayjs from 'dayjs';
import relaTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relaTime);

import he from 'he';

import ReactHtmlParser from 'react-html-parser';

const extraClasses = {
	'blockquote': ['blockquote', 'border-start', 'border-3', 'border-secondary', 'py-2', 'px-4'],
	'table': ['table', 'table-bordered'],
	'a[href]': ['link-info']
};

let _matchImg = (node, figures) => {
	figures = (typeof figures === 'boolean') ? figures : true;
	if (node.tagName == 'IMG' || node.tagName == 'FIGURE'){
		if (!figures && node.tagName == 'FIGURE'){
			let img = node.querySelector('img');
			if (img){
				img.setAttribute('loading', 'lazy');
				return img;
			}
		} else {
			return node;
		}
	} else if (node.querySelector('a>img:only-child')){
		return node.querySelector('a>img:only-child');
	}
	return false;
}

let _swapPs = (node, paras) => {
	if (!paras && node.tagName == 'P'){
		let span = document.createElement('span');
		span.innerHTML = node.innerHTML;
		return span;
	}
	return node;
}

let getText = (content, options) => {
	let defaultOptions = {
		count: 0, // 0 gets all elements, not none.
		images: true, // include images.
		figures: true, // if false, replaces <figure>s with their contained <img>s.
		paras: true, // if false, replaces <p> tags with <span>s.
		parasOnly: false, // match only paragraph elements and nothing else.
		transform: undefined // transform function passed to ReactHtmlParser.
	}
	options = Object.assign(defaultOptions, options || {});

	let e = document.createElement('div');
	e.innerHTML = content;
	for (var selector of Object.keys(extraClasses)){
		e.querySelectorAll(selector).forEach(node => {
			node.classList.add(...extraClasses[selector]);
		});
	}
	e.querySelectorAll('a[href]').forEach(link => {
		link.setAttribute('target', '_blank');
	})

	let result = [];
	for (var node of e.children){
		if (options.parasOnly && node.tagName != 'P') continue;
		let img = _matchImg(node, options.figures);
		if (options.images && img){
			result.push(ReactHtmlParser(img.outerHTML, {transform: options.transform})[0]);
		} else if (!img){
			if (node.tagName === 'PRE' && node.children.item(0).tagName === 'CODE'){
				result.push(
					<Highlight>
						{node.innerText}
					</Highlight>
				);
			} else {
				result.push(ReactHtmlParser(_swapPs(node, options.paras).outerHTML, {transform: options.transform})[0]);
			}
		}
		if (options.count >= 1 && result.length == options.count) break;
	}
	return result;
}

let getImages = (content, options) => {
	let defaultOptions = {
		count: 0, // 0 gets all images, not none.
		figures: true // if false, replaces <figure>s with their contained <img>s.
	}
	options = Object.assign(defaultOptions, options || {});

	let e = document.createElement('div');
	e.innerHTML = content;

	let result = [];
	for (var child of e.children){
		let img = _matchImg(child, options.figures);
		if (img) result.push(ReactHtmlParser(img.outerHTML)[0]);
		if (options.count >= 1 && result.length == options.count) break;
	}
	return result;
}

let dateFmt = (str, options) => {
	if (options && options.relative){
		return dayjs().to(dayjs(str));
	} else {
		return dayjs(str).format('ddd MMM D YYYY [at] h:mma');
	}
}

let sanitize = (str) => {
	return he.decode(str);
}

let markAsRead = (id, read) => {
	if (read || typeof read === 'undefined'){
		console.log('marking '+id+' as read');
		fetch(`/api/read/${id}`).then((res) => console.log(`server returned ${res.status}: ${res.statusText}`));
	} else {
		console.log('marking '+id+' as unread');
		fetch(`/api/read/${id}?read=false`).then((res) => console.log(`server returned ${res.status}: ${res.statusText}`));
	}
}

let bookmark = (id) => {
	console.log('toggling bookmark on '+id);
	fetch(`/api/bookmark/${id}`).then((res) => console.log(`server returned ${res.status}: ${res.statusText}`));
}

export default { getText, getImages, dateFmt, sanitize, markAsRead, bookmark };
