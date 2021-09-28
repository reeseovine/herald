import React, { Component } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import manip from '../content_manipulation';

import { Loader } from '../components/Loader';

export class CardView extends Component {
	render(){
		if (this.props.entry){
			let card_img = manip.getImages(this.props.entry.content, {count: 1, figures: false})[0][0].props;
			return (
				<Card className={this.props.isLight ? '' : 'bg-dark border-secondary'}>
					<a href={'/article/'+this.props.entry.id}>
						<Card.Img variant="top" src={card_img.src} alt={card_img.alt} />
					</a>
					<Card.Body>
						<div className="article-title card-title h3 fw-light">
							<a href={'/article/'+this.props.entry.id}>{manip.sanitize(this.props.entry.title)}</a>
						</div>
						<Card.Text className="lead">{manip.getText(this.props.entry.content, {count: 1, paras: false, parasOnly: true, images: false})}</Card.Text>
						<small className={`byline ${this.props.isLight ? 'text-muted' : 'text-light'}`}><a href={'/category/'+this.props.entry.feed.category.id}>{manip.sanitize(this.props.entry.feed.category.title)}</a> &mdash; <a href={'/source/'+this.props.entry.feed.id}>{manip.sanitize(this.props.entry.feed.title)}</a> &mdash; <a href={this.props.entry.url} target="_blank">{manip.dateFmt(this.props.entry.published_at, {relative: true})}</a></small>
					</Card.Body>
				</Card>
			);
		} else {
			return (
				<Card className={this.props.isLight ? '' : 'bg-dark border-secondary'}>
					<Loader />
				</Card>
			);
		}
	}
}
