import 'highlight.js/scss/default.scss';
import hljs from 'highlight.js/lib/common.js';

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

let getText = (content, options) => {
	let defaultOptions = {
		count: 0, // 0 gets all elements, not none.
		images: true, // include images.
		figures: true, // if false, replaces <figure>s with their contained <img>s.
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

	let result = [];
	for (var child of e.children){
		// child = _matchCode(child);
		let img = _matchImg(child, options.figures);
		if (options.images && img){
			result.push(ReactHtmlParser(img.outerHTML, {transform: options.transform}));
		} else if (!img){
			result.push(ReactHtmlParser(child.outerHTML, {transform: options.transform}));
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

import dayjs from 'dayjs';
var fmtString = 'ddd MMM D YYYY [at] h:mma';
fetch('/api/datefmt')
	.then((response) => response.json())
	.then((data) => {
		fmtString = data;
	});
let dateFmt = (str) => {
	return dayjs(str).format(fmtString);
}

let sanitize = (str) => {
	return he.decode(str);
}

export default { getText, getImages, dateFmt, sanitize };
