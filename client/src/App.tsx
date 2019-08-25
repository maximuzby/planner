import React from 'react';
import { Container, Navbar, Row } from 'react-bootstrap';

import { DataStorageButtons } from './data-storage/data-storage-controls';
import { AddPersonButton, Table } from './table';
import { TaskEditor } from './task-editor';
import { StoreProvider } from './use-store';

const AppContainer: React.FC = props => {
	const { children } = props;

	return (
		<>
			<Navbar fixed='top' bg='dark' variant='dark' expand='lg'>
				<Navbar.Brand href='#home'>Planner</Navbar.Brand>
				<DataStorageButtons />
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
				<Row>
					<AddPersonButton />
					<TaskEditor />
				</Row>
			</AppContainer>
		</StoreProvider>
	);
};
