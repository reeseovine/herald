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
					<div className="card-title h3 fw-light">
						<a className="link-dark text-decoration-none" href={'#'+this.props.entry.id}>{manip.sanitize(this.props.entry.title)}</a>
					</div>
					<Card.Text className="lead">{manip.getText(this.props.entry.content, {count: 1, images: false})}</Card.Text>
					<small className="text-muted fst-italic fw-light"><a href={this.props.entry.url}>{manip.sanitize(this.props.entry.feed.title)}</a> - {manip.dateFmt(this.props.entry.published_at)}</small>
				</Card.Body>
			</Card>
		);
	}
}
