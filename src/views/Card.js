import React, { Component } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import manip from '../content_manipulation';

export class CardView extends Component {
	constructor(){
		super();
		this.state = {
			card_img: {
				src: '',
				alt: ''
			}
		}
	}

	componentDidMount(){
		let card_img = manip.getImages(this.props.entry.content, {count: 1, figures: false})[0];
		if (card_img){
			this.setState({
				card_img: {
					src: card_img[0].props.src,
					alt: card_img[0].props.alt
				}
			});
		}
	}

	render(){
		return (
			<Card>
				<Card.Img variant="top" src={this.state.card_img.src} alt={this.state.card_img.alt} />
				<Card.Body>
					<div className="article-title card-title h3 fw-light">
						<a href={'/article/'+this.props.entry.id}>{manip.sanitize(this.props.entry.title)}</a>
					</div>
					<Card.Text className="lead">{manip.getText(this.props.entry.content, {count: 1, images: false})}</Card.Text>
					<small className="byline"><a href={'/category/'+this.props.entry.feed.category.id}>{manip.sanitize(this.props.entry.feed.category.title)}</a> &mdash; <a href={'/source/'+this.props.entry.feed.id}>{manip.sanitize(this.props.entry.feed.title)}</a> &mdash; <a href={this.props.entry.url}>{manip.dateFmt(this.props.entry.published_at)}</a></small>
				</Card.Body>
			</Card>
		);
	}
}
