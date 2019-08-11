import { useObserver } from 'mobx-react-lite';
import React from 'react';
import { Button } from 'react-bootstrap';

import { Day, Person } from '../store';
import { useStore } from '../use-store';
import { DayCell } from './cells/day-cell';
import { PersonCell } from './cells/person-cell';
import './table.css';

const Card = (props: { day: Day; person: Person }) => {
	return (
		<td className='planner-cell planner-cell_task'>
			<div className='planner-card'>{`Free`}</div>
		</td>
	);
};

export const Table = () => {
	const store = useStore();

	return useObserver(() => (
		<table className='planner-table'>
			<tbody>
				<tr className='planner-table__header'>
					<th className='planner-cell planner-cell_header' />
					{store.days.map(day => (
						<DayCell key={day.id} day={day} />
					))}
					<th className='planner-cell planner-cell_add'>
						<Button
							variant='primary'
							onClick={store.addDay}
							title='Add Day'
						>
							Add
						</Button>
					</th>
				</tr>
				{store.people.map(person => (
					<tr className='planner-table__row' key={person.id}>
						<PersonCell person={person} />
						{store.days.map(day => (
							<Card key={day.id} day={day} person={person} />
						))}
					</tr>
				))}
				<tr className='planner-table__row'>
					<td className='planner-cell planner-cell_add'>
						<Button
							variant='primary'
							onClick={store.addPerson}
							title='Add Person'
						>
							Add
						</Button>
					</td>
				</tr>
			</tbody>
		</table>
	));
};
