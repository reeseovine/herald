import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';

import yargs from 'yargs';
import fetch from 'node-fetch';
import cache from 'memory-cache';

import express from 'express';
const app = express();
app.use(express.urlencoded({ extended: true }));

import api from './api.mjs';

let argv = yargs(process.argv.slice(2))
	.usage('$0 [args]')
	.options({
		'production': {
			alias: 'prod',
			type: 'boolean',
			default: false,
			description: 'Run in production mode. Serves prebuilt frontend from the /build directory.'
		}
	})
	.hide('version')
	.help()
	.argv;

// Miniflux API wrapper
app.use('/api', api);

if (argv.production){
	app.use('/static', express.static('build/static'));
	app.use('/robots.txt', express.static('build/robots.txt'));

	// OpenWeatherMap fetcher
	let getWeather = () => {
		return new Promise((resolve, reject) => {
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
							reject(`received code ${data.status} from openweathermap`);
						}
					}).then(json => {
						resolve(`${json.name} — ${json.weather[0].main}, ${Math.round(json.main.feels_like)}°`);
					}).catch(() => reject('unspecified error when trying to get the weather'));
			} else {
				reject('required openweathermap parameters were not provided');
			}
		});
	}
	// Cache buffer for weather
	let weatherCache = () => {
		return new Promise((resolve, reject) => {
			let cached = cache.get('weather');
			if (cached){
				resolve(cached);
			} else {
				getWeather().then(weather => {
					cache.put('weather', weather, 60*60*1000); // cache for 1 hour
					resolve(weather);
				}).catch(err => reject(err));
			}
		});
	}

	// Paper name generator
	let getPaperName = () => {
		if (process.env.NEWSPAPER_NAME){
			return process.env.NEWSPAPER_NAME;
		} else {
			let adjectives = ["Afternoon", "Breakfast", "Daily", "Evening", "Morning", "People's", "Sunrise", "Teatime", "Union"];
			let nouns = ["Bulletin", "Chronicle", "Gazette", "Herald", "Press", "Record", "Report", "Reporter", "Telegraph", "Tribune"];
			let hashCode = s => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
			let getIndex = (seed, max) => Math.abs(hashCode(seed)) % max;

			return `The ${adjectives[getIndex(new Date().toDateString(), adjectives.length)]} ${nouns[getIndex(new Date().toLocaleDateString(), nouns.length)]}`;
		}
	}

	// Template engine for less volatile variables on the page
	app.engine('html', (filePath, options, callback) => {
		fs.readFile(filePath, (err, content) => {
			if (err){ return callback(err) }
			let rendered = content.toString().replace('##PAPERNAME##', getPaperName());
			weatherCache().then(weather => {
				rendered = rendered.replace('##WEATHER##', weather);
				callback(null, rendered);
			}).catch(() => {
				callback(null, rendered);
			});
		});
	});
	app.set('views', './build'); // specify the views directory
	app.set('view engine', 'html'); // register the template engine

	app.all('*', (req, res) => {
		res.render('index');
	});
}

let serve_port = process.env.hasOwnProperty('PORT') && !isNaN(process.env.PORT) ? parseInt(process.env.PORT) : 5000;
app.listen(serve_port, () => {
	console.log(`Backend server started on port ${serve_port}.`);
});
