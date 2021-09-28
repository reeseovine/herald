import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const api = express.Router();

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
	).then(data => data.json().then(json => cb(json)));
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
	).then(data => data.json().then(json => cb(json)));
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
	).then(data => data.json().then(json => cb(json)));
};

// List user-defined categories
api.get('/categories', (req, res) => {
	api_get('/categories', (data) => {
		res.json(data);
	});
});

// Get all unread articles
api.get('/feed', cacheResponse(60), (req, res) => {
	api_get(`/entries?status=unread&limit=10&order=published_at&direction=desc`, (data) => {
		res.json(data.entries);
	});
});

// Get unread articles in a category
api.get('/feed/category/:id', cacheResponse(60), (req, res) => {
	api_get(`/entries?status=unread&limit=10&order=published_at&direction=desc&category_id=${req.params.id}`, (data) => {
		res.json(data.entries);
	});
});

// Get unread articles from a source
api.get('/feed/source/:id', cacheResponse(60), (req, res) => {
	api_get(`/feeds/${req.params.id}/entries?status=unread&limit=10&order=published_at&direction=desc`, (data) => {
		res.json(data.entries);
	});
});

// Get an article
api.get('/feed/article/:id', cacheResponse(300), (req, res) => {
	api_get(`/entries/${req.params.id}`, (data) => {
		res.json([data]);
	});
});

// Search for articles
api.get('/search', cacheResponse(60), (req, res) => {
	api_get(`/entries?search=${req.query.q}&order=published_at&direction=desc`, (data) => {
		res.json(data);
	});
});

// Mark an article as read
api.get('/read/:id', (req, res) => {
	api_put(`/entries`, {'entry_ids': [req.params.id], 'status': 'read' }, (data) => {
		res.json(200).end();
	});
});

// Refresh all feeds
api.get('/refresh', (req, res) => {
	api_get('/feeds/refresh', (data) => {
		res.status(204).end();
	});
});

// Get the weather
api.get('/weather', cacheResponse(3600), (req, res) => {
	if (process.env.OWM_API_KEY && process.env.OWM_LATITUDE && process.env.OWM_LONGITUDE){
		let url = `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OWM_API_KEY}&lat=${process.env.OWM_LATITUDE}&lon=${process.env.OWM_LONGITUDE}`;
		if (process.env.OWM_LANG){
			url += `&lang=${process.env.OWM_LANG}`;
		}
		if (process.env.OWM_UNITS){
			url += `&units=${process.env.OWM_UNITS}`;
		}
		fetch(url)
			.then(data => {
				if (data.ok){
					return data.json();
				} else {
					res.status(502).end();
				}})
			.then(json => {
				res.json({
					city: json.name,
					condition: json.weather[0].main,
					temp: Math.round(json.main.feels_like)
				});
			});
	} else {
		console.warn('Weather: No OWM API key provided. Skipping...');
		res.status(502).end();
	}
});

// Get the newspaper name
api.get('/papername', cacheResponse(), (req, res) => {
	if (process.env.NEWSPAPER_NAME){
		res.send(`"${process.env.NEWSPAPER_NAME}"`);
	} else {
		let adjectives = ["Afternoon", "Breakfast", "Daily", "Evening", "Morning", "People's", "Sunrise", "Teatime", "Union"];
		let nouns = ["Bulletin", "Chronicle", "Gazette", "Herald", "Press", "Record", "Report", "Reporter", "Telegraph", "Tribune"];
		let hashCode = s => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
		let getIndex = (seed, max) => Math.abs(hashCode(seed)) % max;

		res.json(`The ${adjectives[getIndex(new Date().toDateString(), adjectives.length)]} ${nouns[getIndex(new Date().toLocaleDateString(), nouns.length)]}`);
	}
});

export default api;
