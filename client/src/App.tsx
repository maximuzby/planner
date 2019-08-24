import React from 'react';
import { Col, Container, Navbar, Row } from 'react-bootstrap';

import { AddPersonButton, Table } from './table';
import { TaskEditor } from './task-editor';
import { StoreProvider } from './use-store';

const AppContainer: React.FC = props => {
	const { children } = props;

	return (
		<>
			<Navbar fixed='top' bg='dark' variant='dark' expand='lg'>
				<Navbar.Brand href='#home'>Planner</Navbar.Brand>
			</Navbar>
			<Container fluid={true}>{children}</Container>
		</>
	);
};

export const App: React.FC = () => {
	return (
		<StoreProvider>
			<AppContainer>
				<Table />
				<AddPersonButton />
				<TaskEditor />
			</AppContainer>
		</StoreProvider>
	);
};
