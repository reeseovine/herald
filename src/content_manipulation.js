import ReactHtmlParser from 'react-html-parser';
import he from 'he';

import 'highlight.js/scss/default.scss';
import hljs from 'highlight.js/lib/common.js';

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
let _matchCode = (node) => {
	if (node.tagName == 'PRE' || node.tagName == 'CODE'){
		hljs.highlightElement(node);
	}
	return node;
}

let tagClasses = {
	'blockquote': ['blockquote', 'border-start', 'border-3', 'border-info', 'ps-3'],
	'table': ['table', 'table-bordered']
}
let _addClasses = (doc) => {
	for (var tag of Object.keys(tagClasses)){
		doc.querySelectorAll(tag).forEach(node => {
			node.classList.add(...tagClasses[tag]);
		});
	}
}

let getText = (content, options) => {
	let defaultOptions = {
		count: 0, // 0 gets all elements, not none.
		images: true, // include images.
		figures: true, // if false, replaces <figure>s with their contained <img>s.
		transform: null // transform function passed to ReactHtmlParser
	}
	options = Object.assign(defaultOptions, options || {});

	let e = document.createElement('div');
	e.innerHTML = content;
	_addClasses(e);

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

let dateFmt = (str) => {
	return new Date(str).toDateString();
}

let sanitize = (str) => {
	return he.decode(str);
}

export default { getText, getImages, dateFmt, sanitize };
