import { Instance, types } from 'mobx-state-tree';
import moment from 'moment';

import { Day } from './day.store';
import { seed } from './initial-seed';
import { Person } from './person.store';
import { Task } from './task.store';
import { getTaskPlacements, TaskPlacement } from './views/task-placements';

export interface PlannerStoreModel extends Instance<typeof PlannerStoreModel> {}
export interface PlannerStore extends Instance<typeof PlannerStore> {}

const PlannerStoreModel = types.model('PlannerApp', {
	people: types.array(Person),
	days: types.array(Day),
	tasks: types.array(Task),
	selectedTaskId: types.maybe(types.string),
});

const PlannerStoreView = PlannerStoreModel.views(self => ({
	get selectedTask() {
		return self.tasks.find(x => x.id === self.selectedTaskId);
	},
	getPersonTasks: (person: Person): TaskPlacement[] => {
		return getTaskPlacements(self.tasks.filter(x => x.person === person));
	},
})).views(self => ({
	getTaskPlacements: (dayIndex: number, person: Person) => {
		return self.getPersonTasks(person).filter(x => x.task.inDay(dayIndex));
	},
}));

const PlannerStoreActions = PlannerStoreView.actions(self => ({
	selectTask: (task: Task) => {
		self.selectedTaskId = task.id;
	},
})).actions(self => ({
	removeTask: (task: Task) => {
		if (task.id === self.selectedTaskId) {
			self.selectedTaskId = undefined;
		}

		self.tasks.remove(task);
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
		const task = Task.create({
			person: person.id,
			startDay: dayIndex,
			name: '',
		});
		self.tasks.push(task);
		self.selectTask(task);
	},
	addPerson: () => {
		self.people.push({ name: 'Anonymous' });
	},
	/** Fill with test data */
	afterCreate: () => seed(self),
}));

export const PlannerStore = PlannerStoreActions;
