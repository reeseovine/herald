// Override create-react-app's webpack configuration
// Credit for this idea goes to https://marmelab.com/blog/2021/07/22/cra-webpack-no-eject.html

const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

config.plugins.push(
	new FaviconsWebpackPlugin({
		logo: './img/logo.svg',
		prefix: 'static/favicon/',
		favicons: {
			appName: 'Herald',
			appDescription: 'Prettier frontend for Miniflux',
			developerName: 'katacarbix',
			developerURL: 'https://github.com/katacarbix',
			background: '#212529',
			theme_color: '#000'
		}
	})
);
