import { cast, Instance, types } from 'mobx-state-tree';
import moment from 'moment';

import { dateUtils } from './utils/date-utils';
import { guidBuilder } from './utils/guid-builder';

export interface PlannerStore extends Instance<typeof PlannerStore> {}
export interface Day extends Instance<typeof Day> {}
export interface Person extends Instance<typeof Person> {}

const Entity = types.model('Entity', {
	id: types.optional(types.identifier, guidBuilder.build),
});

export const Person = Entity.named('Person')
	.props({
		name: types.string,
	})
	.actions(self => ({
		setName: (name: string) => (self.name = name),
	}));

export const Day = Entity.named('Day')
	.props({
		/** Date in ISO format */
		date: types.string,
		title: types.string,
	})
	.views(self => ({
		get isWeekend() {
			return dateUtils.isWeekend(moment(self.date));
		},
	}))
	.actions(self => ({
		setTitle: (title: string) => (self.title = title),
	}));

export const PlannerStore = types
	.model('PlannerApp', {
		people: types.array(Person),
		days: types.array(Day),
	})
	.views(self => ({
		get dayCount() {
			return self.days.length;
		},
	}))
	.actions(self => ({
		addDay: () => {
			const nextDate = moment(self.days[self.days.length - 1].date).add(
				1,
				'day',
			);
			self.days.push({
				title: nextDate.format('dddd, MMM D'),
				date: nextDate.format(),
			});
		},
		addPerson: () => {
			self.people.push({ name: '' });
		},
		afterCreate: () => {
			self.people = cast([{ name: 'Vasya' }, { name: 'Petya' }]);

			for (let i = 0; i < 7; i++) {
				const date = moment()
					.startOf('date')
					.add(i, 'day');
				self.days.push({
					title: date.format('dddd, MMM D'),
					date: date.format(),
				});
			}
		},
	}));
