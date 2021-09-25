import { Container } from 'react-bootstrap';
import 'bootstrap/scss/bootstrap.scss';

import { Header } from './components/Header';
import { Content } from './components/Content';
import './overrides.scss';

function App() {
	return (
		<Container fluid="lg">
			<Header />
			<Content />
		</Container>
	);
}

export default App;
