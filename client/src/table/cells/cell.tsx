import classNames from 'classnames';
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

	const store = useStore();

	const [{ isDragging }, drag] = useDrag({
		item: { task, type: 'card', fromIndex: dayIndex },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	});

	const onClick = () => {
		store.selectTask(task);
	};

	const onMinusClick = () => {
		if (!task.decreaseLength()) {
			store.removeTask(task);
		}
	};

	return useObserver(() => (
		<div
			ref={drag}
			style={{ opacity: isDragging ? 0.5 : 1 }}
			className={classNames('planner-card', 'card-task', {
				'task-start': task.starts(dayIndex),
				'task-finish': task.finishes(dayIndex),
				'task-selected': store.selectedTaskId === task.id,
			})}
			onClick={onClick}
		>
			{task.name}
			{` `}
			<ButtonGroup className='task-length-buttons'>
				<Button
					size='sm'
					variant='outline-warning'
					onClick={task.increaseLength}
				>
					+
				</Button>
				<Button
					size='sm'
					variant='outline-warning'
					onClick={onMinusClick}
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
	const array = Array.from({ length: maxPosition + 1 }, (_, i) => {
		return taskPlacements.find(x => x.position === i);
	});

	return (
		<>
			{array.map((placement, index) =>
				placement ? (
					<TaskCard
						dayIndex={dayIndex}
						task={placement.task}
						key={placement.task.id}
					/>
				) : (
					<EmptyCard key={index} />
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
