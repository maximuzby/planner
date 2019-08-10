import { useObserver } from 'mobx-react-lite';
import React from 'react';

import { useStore } from '../use-store';
import { DayCell } from './cells/day-cell';
import { PersonCell } from './cells/person-cell';
import './table.css';

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
						<button
							className='action-button'
							onClick={store.addDay}
							title='Add Day'
						>
							+
						</button>
					</th>
				</tr>
				{store.people.map(person => (
					<tr className='planner-table__row' key={person.id}>
						<PersonCell person={person} />
						{store.days.map(day => (
							<td
								className='planner-cell planner-cell_task'
								key={day.id}
							>
								<div className='planner-card'>{`Free`}</div>
							</td>
						))}
					</tr>
				))}
				<tr className='planner-table__row'>
					<td className='planner-cell planner-cell_add'>
						<button
							className='action-button'
							onClick={store.addPerson}
							title='Add Person'
						>
							+
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	));
};
