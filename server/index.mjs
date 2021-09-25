import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import yargs from 'yargs';

import express from 'express';
const app = express();

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

if (argv.production) app.use(express.static(path.join(__dirname, 'build')));

// Miniflux API wrapper
app.use('/api', api);

app.listen(5000, () => {
	console.log("Backend server started on port 5000.");
});
