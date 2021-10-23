import { Component } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import manip from '../content_manipulation';

import { Loader } from '../components/Loader';
import { Byline } from './Byline';

export class MiniCard extends Component {
	render(){
		if (this.props.entry){
			let title = (
				<Card.Body className="pb-0">
					<div className="article-title card-title h4 fw-light">
						<a href={'/article/'+this.props.entry.id} className="stretched-link">
							{manip.sanitize(this.props.entry.title)}
						</a>
					</div>
				</Card.Body>
			);
			let topSection = title;

			let images = manip.getImages(this.props.entry.content, {count: 1, figures: false});
			if (images.length > 0){
				let cardImg = <Card.Img src={images[0].props.src} alt={images[0].props.alt} />;
				topSection = (
					<Row className="g-0">
						<Col xs={8}>
							{title}
						</Col>
						<Col xs={4} className="pb-2">
							{cardImg}
						</Col>
					</Row>
				);
			}

			return (
				<Card className={`minicard ${this.props.isLight ? '' : 'bg-dark border-secondary'}`}>
					{topSection}
					<Row className="g-0">
						<Card.Body className="pt-2">
							<small>
								<Byline entry={this.props.entry} isLight={this.props.isLight} />
							</small>
						</Card.Body>
					</Row>
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
