import { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import { Frontpage } from '../layouts/Frontpage';
import { Bookmarks } from '../layouts/Bookmarks';
import Articles from '../layouts/Articles';
import Article from '../layouts/Article';
import { Search } from '../layouts/Search';

import { Error } from './Error';
import { Loader } from './Loader';

export default function Content(props){
	return (
		<Switch>
			<Route path="/bookmarks">
				<Bookmarks isLight={props.isLight} />
			</Route>
			<Route path="/category/:id">
				<Articles type="category" isLight={props.isLight} />
			</Route>
			<Route path="/source/:id">
				<Articles type="source" isLight={props.isLight} />
			</Route>
			<Route path="/article/:id">
				<Article isLight={props.isLight} />
			</Route>
			<Route path="/search">
				<Search query={(new URL(window.location)).searchParams.get('q')} isLight={props.isLight} />
			</Route>
			<Route path="/">
				<Frontpage isLight={props.isLight} />
			</Route>
			<Route path="*">
				<Error code={404} />
			</Route>
		</Switch>
	);
}
