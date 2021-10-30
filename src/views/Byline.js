import { Component } from 'react';
import { Link } from 'react-router-dom';

import manip from '../content_manipulation';

import Icon from '@mdi/react';
import { mdiClose, mdiCheck, mdiBookmarkOutline } from '@mdi/js';

export class Byline extends Component {
	constructor(){
		super();
		this.state = {
			read: false,
			bookmarked: false
		};
	}

	componentDidMount(){
		this.setState({
			read: (this.props.hasOwnProperty('read') ? this.props.read : this.state.read),
			bookmarked: this.props.entry.starred
		});
	}

	render(){
		// Generate segments for the left hand side
		let segments = [];
		if (!this.props.hideAuthor && this.props.entry.author.length > 0){
			segments.push( // author
				<span className="text-capitalize">
					{manip.sanitize(this.props.entry.author)}
				</span>
			, ' — ');
		}
		if (!this.props.hideCategory){
			segments.push( // category
				<Link to={'/category/'+this.props.entry.feed.category.id}
					className={`text-capitalize text-decoration-none
						${this.props.isLight ?
							(this.props.lightLinkClass || 'link-dark') :
							(this.props.darkLinkClass || 'link-light') }`}>
					{manip.sanitize(this.props.entry.feed.category.title)}
				</Link>
			, ' — ');
		}
		if (!this.props.hideSource){
			segments.push(
				<Link to={'/source/'+this.props.entry.feed.id}
					className={`text-decoration-none
						${this.props.isLight ?
							(this.props.lightLinkClass || 'link-dark') :
							(this.props.darkLinkClass || 'link-light') }`}>
					{manip.sanitize(this.props.entry.feed.title)}
				</Link>
			, ' — ');
		}
		segments.push(
			<a href={this.props.entry.url} target="_blank"
				title={manip.dateFmt(this.props.entry.published_at)}
				className={`text-decoration-none
					${this.props.isLight ?
						(this.props.lightLinkClass || 'link-dark') :
						(this.props.darkLinkClass || 'link-light') }`}>
				{manip.dateFmt(this.props.entry.published_at, {relative: true})}
			</a>
		);

		return (
			<div className={`byline clearfix fw-light fst-italic ${this.props.className || ''}
				${this.props.isLight ?
					(this.props.lightTextClass || 'text-dark') :
					(this.props.darkTextClass || 'text-light') }`}>
				<span className="float-start">
					{segments}
				</span>
				<span className="float-end">
					<Icon
						path={mdiBookmarkOutline}
						size={1}
						role="button"
						className={`${this.state.bookmarked ? 'text-warning' : ''}`}
						title={this.state.bookmarked ? 'Remove bookmark' : 'Bookmark'}
						onClick={(e) => {
							manip.bookmark(this.props.entry.id)
							this.setState({bookmarked: !this.state.bookmarked});
						}} />
					<Icon
						path={this.state.read ? mdiCheck : mdiClose}
						size={1}
						role="button"
						className={`ms-3 ${this.state.read ? 'text-success' : ''}`}
						title={this.state.read ? 'Marked as read' : 'Mark as read'}
						onClick={(e) => {
							manip.markAsRead(this.props.entry.id, !this.state.read)
							this.setState({read: !this.state.read});
						}} />
				</span>
			</div>
		);
	}
}
