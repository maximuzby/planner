import { cast } from 'mobx-state-tree';
import moment from 'moment';

import { PlannerStoreModel } from './planner.store';

export const seed = (self: PlannerStoreModel) => {
	for (let i = 0; i < 7; i++) {
		const date = moment()
			.startOf('date')
			.add(i, 'day');
		self.days.push({
			title: date.format('ddd, MMM D'),
			date: date.format(),
		});
	}

	self.people = cast([
		{
			name: 'John',
		},
		{ name: 'Max' },
	]);

	self.tasks = cast([
		{
			name: 'Task 1',
			startDay: 0,
			person: self.people[0].id,
		},
		{
			name: 'Task 2',
			startDay: 1,
			person: self.people[0].id,
		},
		{
			name: 'Task 3',
			startDay: 1,
			person: self.people[1].id,
		},
	]);
};
