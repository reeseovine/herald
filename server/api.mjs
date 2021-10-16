import dotenv from 'dotenv';
dotenv.config();

import { Router } from 'express';
const api = Router();

import fetch from 'node-fetch';
import urljoin from 'url-join';
import cache from 'memory-cache';

let cacheResponse = (duration) => {
	return (req, res, next) => {
		let key = '__express__' + (req.originalUrl || req.url);
		let cachedBody = cache.get(key);
		if (cachedBody){
			res.send(cachedBody);
			return;
		} else {
			res.originalSend = res.send;
			res.send = (body) => {
				cache.put(key, body, (duration*1000 || undefined));
				res.originalSend(body);
			}
			next();
		}
	}
}

// Wrapper functions for miniflux API
let api_get = (path, cb) => {
	fetch(
		urljoin(process.env.MINIFLUX_API_ENDPOINT, path),
		{
			method: 'GET',
			headers: { 'X-Auth-Token': process.env.MINIFLUX_API_KEY }
		}
	).then(data => data.json().then(json => cb(json, data.status)));
};
let api_post = (path, payload, cb) => {
	fetch(
		urljoin(process.env.MINIFLUX_API_ENDPOINT, path),
		{
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json',
				'X-Auth-Token': process.env.MINIFLUX_API_KEY
			}
		}
	).then(data => data.json().then(json => cb(json, data.status)));
};
let api_put = (path, payload, cb) => {
	fetch(
		urljoin(process.env.MINIFLUX_API_ENDPOINT, path),
		{
			method: 'PUT',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json',
				'X-Auth-Token': process.env.MINIFLUX_API_KEY
			}
		}
	).then(data => cb(data.status));
};


// List user-defined categories
api.get('/categories', (req, res) => {
	api_get('/categories', (data) => {
		res.json(data);
	});
});

// Get all unread articles
api.get('/feed', cacheResponse(60), (req, res) => {
	let before = req.query.hasOwnProperty('before') ? 'before_entry_id='+req.query.before : '';
	api_get(`/entries?status=unread&limit=8&order=published_at&direction=desc&${before}`, (data) => {
		res.json(data.entries);
	});
});

// Get unread articles in a category
api.get('/feed/category/:id', cacheResponse(60), (req, res) => {
	let before = req.query.hasOwnProperty('before') ? 'before_entry_id='+req.query.before : '';
	api_get(`/entries?status=unread&limit=8&order=published_at&direction=desc&${before}&category_id=${req.params.id}`, (data, status) => {
		if (status !== 200){
			return res.status(status).end();
		}
		res.json(data.entries);
	});
});

// Get unread articles from a source
api.get('/feed/source/:id', cacheResponse(60), (req, res) => {
	let before = req.query.hasOwnProperty('before') ? 'before_entry_id='+req.query.before : '';
	api_get(`/feeds/${req.params.id}/entries?status=unread&limit=8&order=published_at&direction=desc&${before}`, (data, status) => {
		if (status !== 200){
			return res.status(status).end();
		}
		res.json(data.entries);
	});
});

// Get bookmarked articles
api.get('/feed/bookmarks', (req, res) => {
	let before = req.query.hasOwnProperty('before') ? 'before_entry_id='+req.query.before : '';
	api_get(`/entries?starred=true&limit=8&order=published_at&direction=desc&${before}`, (data) => {
		res.json(data.entries);
	});
});

// Get an article
api.get('/feed/article/:id', cacheResponse(300), (req, res) => {
	api_get(`/entries/${req.params.id}`, (data, status) => {
		if (status !== 200){
			return res.status(status).end();
		}
		res.json([data]);
	});
});

// Search for articles
api.get('/search', cacheResponse(60), (req, res) => {
	let before = req.query.hasOwnProperty('before') ? 'before_entry_id='+req.query.before : '';
	api_get(`/entries?search=${req.query.q}&limit=8&order=published_at&direction=desc&${before}`, (data) => {
		res.json(data);
	});
});

// Mark an article as read (or unread)
api.get('/read/:id', (req, res) => {
	api_put(`/entries`, {'entry_ids': [parseInt(req.params.id, 10)], 'status': (req.query.read == 'false' ? 'unread' : 'read')}, (status) => {
		res.status(status).end();
	});
});

// Bookmark (star) an article
api.get('/bookmark/:id', (req, res) => {
	api_put(`/entries/${req.params.id}/bookmark`, {}, () => {
		res.status(200).end();
	});
});

// Refresh all feeds
api.get('/refresh', (req, res) => {
	api_get('/feeds/refresh', (data) => {
		res.status(204).end();
	});
});

export default api;
