import { cast } from 'mobx-state-tree';
import moment from 'moment';

import { PlannerStoreModel } from './planner.store';

export const seed = (self: PlannerStoreModel) => {
	if (self.days.length > 0) {
		return;
	}

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
};
