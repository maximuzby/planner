import { cast, detach, Instance, types } from 'mobx-state-tree';
import moment from 'moment';

import { Day } from './day';
import { Person } from './person';
import { Task } from './task';

export interface PlannerStore extends Instance<typeof PlannerStore> {}

export interface TaskPlacement {
	position: number;
	task: Task;
}

const getTaskPlacements = (tasks: Task[]) => {
	const placedTasks: TaskPlacement[] = [];
	tasks.sort((a, b) => a.startDay - b.startDay);
	for (const task of tasks) {
		let position = 0;
		while (
			placedTasks.find(
				x => x.position === position && x.task.intersects(task),
			)
		) {
			position++;
		}
		placedTasks.push({ task, position });
	}
	return placedTasks;
};

export const PlannerStore = types
	.model('PlannerApp', {
		people: types.array(Person),
		days: types.array(Day),
		tasks: types.array(Task),
	})
	.views(self => ({
		getPersonTasks: (person: Person): TaskPlacement[] => {
			return getTaskPlacements(
				self.tasks.filter(x => x.person === person),
			);
		},
	}))
	.views(self => ({
		getTaskPlacements: (dayIndex: number, person: Person) => {
			return self
				.getPersonTasks(person)
				.filter(x => x.task.inDay(dayIndex));
		},
	}))
	.actions(self => ({
		removeTask: (task: Task) => {
			detach(task);
		},
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
		addTask: (dayIndex: number, person: Person) => {
			self.tasks.push(
				Task.create({
					person: person.id,
					startDay: dayIndex,
					name: 'Task X',
				}),
			);
		},
		addPerson: () => {
			self.people.push({ name: ' ' });
		},
		/** Fill with test data */
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
