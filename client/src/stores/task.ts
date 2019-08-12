import { getParentOfType, Instance, types } from 'mobx-state-tree';

import { Entity } from './entity';
import { Person } from './person';
import { PlannerStore } from './planner-store';

export interface Task extends Instance<typeof Task> {}

export const Task = Entity.named('Task')
	.props({
		name: types.string,
		startDay: types.number,
		person: types.reference(Person),
		length: types.optional(types.number, 1),
	})
	.views(self => ({
		get finishDay(): number {
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
		inDay: (dayIndex: number) => {
			return dayIndex >= self.startDay && dayIndex <= self.finishDay;
		},
		intersects: (task: Task): boolean => {
			return (
				(self.startDay >= task.startDay &&
					self.startDay <= task.finishDay) ||
				(self.finishDay >= task.startDay &&
					self.finishDay <= task.finishDay) ||
				(task.startDay >= self.startDay &&
					task.startDay <= self.finishDay) ||
				(task.finishDay >= self.startDay &&
					task.finishDay <= self.finishDay)
			);
		},
	}))
	.actions(self => ({
		setName: (name: string) => (self.name = name),
		moveTo: (fromDay: number, toDay: number, person: Person) => {
			self.startDay = self.startDay + (toDay - fromDay);
			self.person = person;
		},
		increaseLength: () => self.length++,
		decreaseLength: () => {
			if (self.length > 1) {
				self.length--;
			} else {
				getParentOfType(self, PlannerStore).removeTask(self as Task);
			}
		},
	}));
