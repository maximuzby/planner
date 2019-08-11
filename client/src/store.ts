import { cast, Instance, types } from 'mobx-state-tree';
import moment from 'moment';

import { dateUtils } from './utils/date-utils';
import { guidBuilder } from './utils/guid-builder';

export interface PlannerStore extends Instance<typeof PlannerStore> {}
export interface Day extends Instance<typeof Day> {}
export interface Person extends Instance<typeof Person> {}
export interface Task extends Instance<typeof Task> {}

const Entity = types.model('Entity', {
	id: types.optional(types.identifier, guidBuilder.build),
});

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

export const Person = Entity.named('Person')
	.props({
		name: types.string,
	})

	.actions(self => ({
		setName: (name: string) => (self.name = name),
	}));

export const Task = Entity.named('Task')
	.props({
		name: types.string,
		startDay: types.number,
		person: types.reference(Person),
		length: types.optional(types.number, 1),
	})
	.views(self => ({
		get finishDay() {
			return self.startDay + self.length - 1;
		},
	}))
	.views(self => ({
		starts: (dayIndex: number) => {
			return self.startDay === dayIndex;
		},
		finishes: (dayIndex: number) => {
			return self.finishDay === dayIndex;
		},
	}))
	.actions(self => ({
		setName: (name: string) => (self.name = name),
		moveTo: (fromDay: number, toDay: number, person: Person) => {
			self.startDay = self.startDay + (toDay - fromDay);
			self.person = person;
		},
		increaseLength: () => self.length++,
		decreaseLength: () => (self.length = Math.max(self.length - 1, 1)),
	}));

export const PlannerStore = types
	.model('PlannerApp', {
		people: types.array(Person),
		days: types.array(Day),
		tasks: types.array(Task),
	})
	.views(self => ({
		getTasks: (dayIndex: number, person: Person) => {
			return self.tasks.filter(
				x =>
					x.person === person &&
					(dayIndex >= x.startDay &&
						dayIndex < x.startDay + x.length),
			);
		},
	}))
	.actions(self => ({
		addDay: () => {
			const nextDate = moment(self.days[self.days.length - 1].date).add(
				1,
				'day',
			);
			self.days.push({
				title: nextDate.format('ddd, MMM D'),
				date: nextDate.format(),
			});
		},
		addPerson: () => {
			self.people.push({ name: '' });
		},
		afterCreate: () => {
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
		},
	}));
