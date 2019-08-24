import faker from 'faker';
import { types } from 'mobx-state-tree';

import { Task } from './task';

jest.mock('./person');
jest.mock('./planner-store');

const FakeReference = types.model('Test', { id: types.identifier });

const getLastDay = (startDay: number, length: number) => startDay + length - 1;

jest.spyOn(types, 'reference').mockImplementation(() =>
	types.reference(FakeReference),
);

const createTask = (task: Partial<Task> = {}) => {
	return Task.create({
		name: task.name || faker.random.word(),
		startDay: task.startDay || faker.random.number(),
		person: faker.random.word(),
		length: task.length,
	});
};

describe('Task', () => {
	it('setName updates name', () => {
		const task = createTask();
		const newName = faker.random.word();

		task.setName(newName);

		expect(task.name).toEqual(newName);
	});

	it('finishDay is last day of task', () => {
		const task = createTask({ startDay: 1, length: 2 });

		expect(task.finishDay).toEqual(2);
	});

	it('starts is true if startDay equals to dayIndex', () => {
		const startDay = faker.random.number();
		const task = createTask({ startDay });

		expect(task.starts(startDay)).toBeTruthy();
	});

	it('starts is false if startDay not equal to dayIndex', () => {
		const startDay = faker.random.number();
		const task = createTask({ startDay });

		expect(task.starts(startDay + 1)).toBeFalsy();
	});

	it('finishes is true if finishDay equals to dayIndex', () => {
		const startDay = faker.random.number();
		const length = faker.random.number();
		const task = createTask({ startDay, length });

		expect(task.finishes(getLastDay(startDay, length))).toBeTruthy();
	});

	it('finishes is false if finishDay not equal to dayIndex', () => {
		const startDay = faker.random.number();
		const length = faker.random.number();
		const task = createTask({ startDay, length });

		expect(task.finishes(getLastDay(startDay, length) + 1)).toBeFalsy();
	});

	it('inDay is true if dayIndex equals to start day', () => {
		const startDay = faker.random.number();
		const length = faker.random.number();
		const task = createTask({ startDay, length });

		expect(task.inDay(startDay)).toBeTruthy();
	});

	it('inDay is true if dayIndex equals to last day', () => {
		const startDay = faker.random.number();
		const length = faker.random.number();
		const task = createTask({ startDay, length });

		expect(task.inDay(getLastDay(startDay, length))).toBeTruthy();
	});

	it('inDay is true if dayIndex equals to last day', () => {
		const task = createTask({ startDay: 1, length: 3 });

		expect(task.inDay(2)).toBeTruthy();
	});

	it('inDay is false if dayIndex less that start day', () => {
		const startDay = faker.random.number();
		const length = faker.random.number();
		const task = createTask({ startDay, length });

		expect(task.inDay(startDay - 1)).toBeFalsy();
	});

	it('inDay is false if dayIndex greater that last day', () => {
		const startDay = faker.random.number();
		const length = faker.random.number();
		const task = createTask({ startDay, length });

		expect(task.inDay(getLastDay(startDay, length) + 1)).toBeFalsy();
	});
});
