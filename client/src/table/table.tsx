import { useObserver } from 'mobx-react-lite';
import React from 'react';
import { DndProvider } from 'react-dnd';
import Html5Backend from 'react-dnd-html5-backend';

import { Col, Row } from 'react-bootstrap';
import { useStore } from '../use-store';
import { DaysHeader } from './days-header';
import { PersonTasksRow } from './person-tasks-row';
import './table.css';

const TableRows = () => {
	const store = useStore();

	return useObserver(() => (
		<>
			{store.people.map(person => (
				<PersonTasksRow person={person} key={person.id} />
			))}
		</>
	));
};

export const Table = () => {
	return (
		<Row>
			<Col lg='12'>
				<DndProvider backend={Html5Backend}>
					<table className='planner-table'>
						<thead>
							<DaysHeader />
						</thead>
						<tbody>
							<TableRows />
						</tbody>
					</table>
				</DndProvider>
			</Col>
		</Row>
	);
};
