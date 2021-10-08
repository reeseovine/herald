import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import manip from '../content_manipulation';

import { Loader } from '../components/Loader';
import { Byline } from './Byline';

export class CardView extends Component {
	render(){
		if (this.props.entry){
			let images = manip.getImages(this.props.entry.content, {count: 1, figures: false});
			let card_img = {src: '', alt: ''};
			if (images.length > 0){
				card_img = {src: images[0].props.src, alt: images[0].props.alt};
			}

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
						<small>
							<Byline entry={this.props.entry} isLight={this.props.isLight} />
						</small>
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
