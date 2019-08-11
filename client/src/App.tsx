import React from 'react';

import { Container, Navbar, Row } from 'react-bootstrap';
import { Table } from './table/table';
import { StoreProvider } from './use-store';

const AppContainer: React.FC = props => {
	return (
		<>
			<Navbar fixed='top' bg='dark' variant='dark' expand='lg'>
				<Navbar.Brand href='#home'>Planner</Navbar.Brand>
			</Navbar>
			<Container fluid={true}>
				<Row>{props.children}</Row>
			</Container>
		</>
	);
};

export const App: React.FC = () => {
	return (
		<StoreProvider>
			<AppContainer>
				<Table />
			</AppContainer>
		</StoreProvider>
	);
};
