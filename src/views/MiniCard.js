import { Component } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import manip from '../content_manipulation';

import { Loader } from '../components/Loader';
import { Byline } from './Byline';

export class MiniCard extends Component {
	render(){
		if (this.props.entry){
			let cardBody = (
				<Card.Body>
					<div className="article-title card-title h4 fw-light">
						<a href={'/article/'+this.props.entry.id} className="stretched-link">
							{manip.sanitize(this.props.entry.title)}
						</a>
					</div>
					<small>
						<Byline entry={this.props.entry} hideAuthor hideSource isLight={this.props.isLight} />
					</small>
				</Card.Body>
			)

			let images = manip.getImages(this.props.entry.content, {count: 1, figures: false});
			if (images.length > 0){
				let cardImg = <img loading="lazy" src={images[0].props.src} alt={images[0].props.alt} />;
				cardBody = (
					<Row className="g-0">
						<Col xs={4}>
							{cardImg}
						</Col>
						<Col xs={8}>
							{cardBody}
						</Col>
					</Row>
				);
			}

			return (
				<Card className={`minicard ${this.props.isLight ? '' : 'bg-dark border-secondary'}`}>
					{cardBody}
				</Card>
			);
		} else {
			return (
				<Card className={this.props.isLight ? '' : 'bg-dark border-secondary'}>
					<Loader state={{loading: true}} />
				</Card>
			);
		}
	}
}
