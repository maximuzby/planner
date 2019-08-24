import { useObserver } from 'mobx-react-lite';
import React from 'react';
import { Button } from 'react-bootstrap';

import { useStore } from '../use-store';
import { DayCell } from './headers';

export const DaysHeader = () => {
	const store = useStore();

	return useObserver(() => (
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
					Add Day
				</Button>
			</th>
		</tr>
	));
};
