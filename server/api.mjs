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

api.get('/categories', (req, res) => {
	api_get('/categories', (data) => {
		res.json(data);
	});
});
api.get('/feed', (req, res) => {
	api_get(`/entries?status=unread&limit=10&order=published_at&direction=desc`, (data) => {
		res.json(data.entries);
	});
});
api.get('/feed/category/:id', (req, res) => {
	api_get(`/entries?status=unread&limit=10&order=published_at&direction=desc&category_id=${req.params.id}`, (data) => {
		res.json(data.entries);
	});
});
api.get('/feed/source/:id', (req, res) => {
	api_get(`/feeds/${req.params.id}/entries?status=unread&limit=10&order=published_at&direction=desc`, (data) => {
		res.json(data.entries);
	});
});
api.get('/feed/article/:id', cacheResponse(300), (req, res) => {
	api_get(`/entries/${req.params.id}`, (data) => {
		res.json([data]);
	});
});

api.get('/refresh', (req, res) => {
	api_get('/feeds/refresh', (data) => {
		res.code(202).end();
	});
});
api.get('/read/:id', (req, res) => {
	api_put(`/entries`, {'entry_ids': [req.params.id], 'status': 'read' }, (data) => {
		res.json(200).end();
	});
});

api.get('/datefmt', cacheResponse(), (req, res) => {
	if (process.env.DAYJS_FORMAT){
		res.send(`"${process.env.DAYJS_FORMAT}"`);
	} else {
		res.status(502).end();
	}
});

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

export default api;
