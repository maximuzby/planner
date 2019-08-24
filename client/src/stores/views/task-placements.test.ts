import faker from 'faker';

import { Task } from '../task';
import { getTaskPlacements } from './task-placements';

jest.mock('../task');

type IntersectsFunc = (task: Task) => boolean;

const getTask = (
	intersects: IntersectsFunc,
	startDay: number = faker.random.number(),
): Task => {
	const task: Partial<Task> = { startDay, intersects };
	return task as Task;
};

const getTaskList = (args: { length?: number; intersects: boolean }) => {
	return Array.from({ length: args.length || 5 }, () =>
		getTask(() => args.intersects),
	);
};

describe('getTaskPlacements', () => {
	it('returns empty list if there are not tasks', () => {
		const result = getTaskPlacements([]);

		expect(result.length).toEqual(0);
	});

	it('assigns zero placement if tasks are not intersected', () => {
		const tasks = getTaskList({ intersects: false });

		const result = getTaskPlacements(tasks);

		expect(result.length).toEqual(tasks.length);
		expect(result.find(x => x.position !== 0)).toBeFalsy();
	});

	it('assigns different placements if all tasks are intersected', () => {
		const taskCount = 5;
		const tasks = getTaskList({ length: taskCount, intersects: true });
		const expectedPlacements = Array.from(
			{ length: taskCount },
			(_, i) => i,
		);

		const result = getTaskPlacements(tasks);

		expect(result.map(x => x.position).sort()).toEqual(expectedPlacements);
	});

	it('assign 0, 1 placements for 3 tasks with 2 non-intersecting lines', () => {
		const intersectedTask = getTask(() => true, 0);
		const nonIntersectedTasks = [
			getTask(x => x === intersectedTask, 1),
			getTask(x => x === intersectedTask, 2),
		];
		const tasks = [intersectedTask, ...nonIntersectedTasks];

		const resultPlacements = getTaskPlacements(tasks)
			.map(x => x.position)
			.sort();

		expect(resultPlacements).toEqual([0, 1, 1]);
	});
});
