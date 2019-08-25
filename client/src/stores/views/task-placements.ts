import { Task } from '../task.store';

export interface TaskPlacement {
	position: number;
	task: Task;
}

export const getTaskPlacements = (tasks: Task[]) => {
	return tasks
		.sort((a, b) => a.startDay - b.startDay)
		.reduce<TaskPlacement[]>((placedTasks, task) => {
			const position = placedTasks
				.filter(x => x.task.intersects(task))
				.map(x => x.position)
				.sort()
				.reduce((free, x) => (x === free ? free + 1 : free), 0);
			return [...placedTasks, { task, position }];
		}, []);
};
