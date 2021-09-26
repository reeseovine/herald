import 'highlight.js/scss/default.scss';
import hljs from 'highlight.js/lib/common.js';

import dayjs from 'dayjs';
import relaTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relaTime);

import he from 'he';

import ReactHtmlParser from 'react-html-parser';
let tagClasses = {
	'blockquote': ['blockquote', 'border-start', 'border-3', 'border-secondary', 'py-2', 'px-4'],
	'table': ['table', 'table-bordered']
};

let _matchImg = (node, figures) => {
	figures = (typeof figures === 'boolean') ? figures : true;
	if (node.tagName == 'IMG' || node.tagName == 'FIGURE'){
		if (!figures && node.tagName == 'FIGURE'){
			let img = node.querySelector('img');
			if (img) return img;
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
		transform: undefined // transform function passed to ReactHtmlParser.
	}
	options = Object.assign(defaultOptions, options || {});

	let e = document.createElement('div');
	e.innerHTML = content;
	for (var tag of Object.keys(tagClasses)){
		e.querySelectorAll(tag).forEach(node => {
			node.classList.add(...tagClasses[tag]);
		});
	}
	e.querySelectorAll('pre > code').forEach(node => {
		node.innerHTML = he.encode(node.innerHTML);
	});
	e.querySelectorAll('a[href]').forEach(link => {
		link.setAttribute('target', '_blank');
	})

	let result = [];
	for (var child of e.children){
		let img = _matchImg(child, options.figures);
		if (options.images && img){
			result.push(ReactHtmlParser(img.outerHTML, {transform: options.transform}));
		} else if (!img){
			result.push(ReactHtmlParser(_swapPs(child, options.paras).outerHTML, {transform: options.transform}));
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
		if (img) result.push(ReactHtmlParser(img.outerHTML));
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

export default { getText, getImages, dateFmt, sanitize };
