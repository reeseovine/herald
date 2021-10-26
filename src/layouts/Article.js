import { Component } from 'react';

import { withRouter } from 'react-router-dom';

import { Row, Col } from 'react-bootstrap';

import { Full } from '../views/Full';
import { Sidebar } from './Sidebar';

import { Error } from '../components/Error';
import { Loader } from '../components/Loader';

class Article extends Component {
	constructor(){
		super();
		this.state = {
			error: false
		};
	}

	componentDidMount(){
		// fetch article
		fetch(`/api/feed/article/${this.props.match.params.id}`)
			.then((response) => {
				if (response.status == 200){
					return response.json()
				} else {
					this.setState({error: response.status});
					return [];
				}
			}).then((feed) => {
				if (feed.length > 0){
					this.setState({
						entry: feed[0],
						category_id: feed[0].feed.category.id
					});
					document.title = `${feed[0].title} | Herald`;
				}
			}).catch(err => {
				console.error(err);
				this.setState({error: 500});
			});
	}

	render(){
		if (this.state.error) {
			return <Error code={this.state.error} />;
		} else if (this.state.entry){
			return (
				<Row>
					<Col xs={12} sm={{span: 10, offset: 1}} lg={{span: 8, offset: 0}} className="px-4 pe-xxl-5">
						<Full entry={this.state.entry} isLight={this.props.isLight} />
					</Col>
					<Col xs={12} sm={{span: 8, offset: 2}} lg={{span: 4, offset: 0}}>
						<Sidebar type="category" id={this.state.category_id} exclude={[this.state.entry.id]} isLight={this.props.isLight} />
					</Col>
				</Row>
			);
		} else {
			return <Loader state={{loading: true}} />;
		}
	}
}

export default withRouter(Article);
