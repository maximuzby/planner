import { useObserver } from 'mobx-react-lite';
import React from 'react';

import { Person } from '../stores';
import { useStore } from '../use-store';
import { Cell } from './cells/cell';
import { PersonCell } from './headers';

export const PersonTasksRow = (props: { person: Person }) => {
	const { person } = props;

	const store = useStore();

	return useObserver(() => (
		<tr className='planner-table__row'>
			<PersonCell person={person} />
			{store.days.map((_day, index) => (
				<Cell key={index} dayIndex={index} person={person} />
			))}
		</tr>
	));
};
