import { useObserver } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { useDrag, useDrop } from 'react-dnd';

import { Person, Task, TaskPlacement } from '../../stores';
import { useStore } from '../../use-store';

interface DropObject {
	type: string;
	task: Task;
	fromIndex: number;
}

interface TaskCardProps {
	task: Task;
	dayIndex: number;
}

const TaskCard = (props: TaskCardProps) => {
	const { task, dayIndex } = props;

	const [{ isDragging }, drag] = useDrag({
		item: { task, type: 'card', fromIndex: dayIndex },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	});

	return useObserver(() => (
		<div
			ref={drag}
			style={{ opacity: isDragging ? 0.5 : 1 }}
			className={`planner-card card-task ${task.starts(dayIndex) &&
				'task-start'} ${task.finishes(dayIndex) && 'task-finish'}`}
		>
			{task.name}
			{` `}
			<ButtonGroup>
				<Button
					size='sm'
					variant='primary'
					onClick={task.increaseLength}
				>
					+
				</Button>
				<Button
					size='sm'
					variant='primary'
					onClick={task.decreaseLength}
				>
					-
				</Button>
			</ButtonGroup>
		</div>
	));
};

const EmptyCard = () => {
	return <div className='planner-card empty-card'>{``}</div>;
};

const TaskCardList = (props: {
	taskPlacements: TaskPlacement[];
	dayIndex: number;
}) => {
	const { taskPlacements, dayIndex } = props;

	const maxPosition = Math.max(...taskPlacements.map(x => x.position));
	const array = Array(maxPosition + 1)
		.fill(null)
		.map((_, i) => {
			return taskPlacements.find(x => x.position === i);
		});

	return (
		<>
			{array.map((placement, i) =>
				placement ? (
					<TaskCard
						dayIndex={dayIndex}
						task={placement.task}
						key={i}
					/>
				) : (
					<EmptyCard key={i} />
				),
			)}
		</>
	);
};

export const Cell = (props: { dayIndex: number; person: Person }) => {
	const { dayIndex, person } = props;
	const [, drop] = useDrop<DropObject, {}, {}>({
		accept: 'card',
		drop: (item: DropObject) => {
			item.task.moveTo(item.fromIndex, props.dayIndex, props.person);
			return {};
		},
	});

	const store = useStore();

	const onFreeClick = useCallback(() => {
		store.addTask(dayIndex, person);
	}, [dayIndex, person, store]);

	return useObserver(() => {
		const taskPlacements = store.getTaskPlacements(
			props.dayIndex,
			props.person,
		);

		return (
			<td ref={drop} className='planner-cell planner-cell_task'>
				{taskPlacements.length === 0 ? (
					<div
						className='planner-card empty-card'
						onClick={onFreeClick}
					>
						{`Free`}
					</div>
				) : (
					<TaskCardList
						taskPlacements={taskPlacements}
						dayIndex={dayIndex}
					/>
				)}
			</td>
		);
	});
};
