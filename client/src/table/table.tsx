import { useObserver } from 'mobx-react-lite';
import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import Html5Backend from 'react-dnd-html5-backend';

import { Person, Task } from '../store';
import { useStore } from '../use-store';
import { DayCell } from './cells/day-cell';
import { PersonCell } from './cells/person-cell';
import './table.css';

const TaskCard = (props: { task: Task; dayIndex: number }) => {
	const { task, dayIndex } = props;

	const [{ isDragging }, drag] = useDrag({
		item: { task, type: 'card', fromIndex: props.dayIndex },
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
			{task.name}{' '}
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

const Cell = (props: { dayIndex: number; person: Person }) => {
	const [, drop] = useDrop<
		{ type: string; task: Task; fromIndex: number },
		{},
		{}
	>({
		accept: 'card',
		drop: (item: { type: string; task: Task; fromIndex: number }) => {
			item.task.moveTo(item.fromIndex, props.dayIndex, props.person);
			return {};
		},
	});

	const store = useStore();

	return useObserver(() => {
		const tasks = store.getTasks(props.dayIndex, props.person);

		return (
			<td ref={drop} className='planner-cell planner-cell_task'>
				{tasks.length === 0 && (
					<div className='planner-card card-free'>{`Free`}</div>
				)}
				{tasks.map(x => (
					<TaskCard dayIndex={props.dayIndex} task={x} key={x.id} />
				))}
			</td>
		);
	});
};

export const Table = () => {
	const store = useStore();

	return (
		<DndProvider backend={Html5Backend}>
			{useObserver(() => (
				<table className='planner-table'>
					<tbody>
						<tr className='planner-table__header'>
							<th className='planner-cell planner-cell_header' />
							{store.days.map(day => (
								<DayCell key={day.id} day={day} />
							))}
							<th className='planner-cell planner-cell_add'>
								<Button
									variant='primary'
									onClick={store.addDay}
									title='Add Day'
								>
									Add
								</Button>
							</th>
						</tr>
						{store.people.map(person => (
							<tr className='planner-table__row' key={person.id}>
								<PersonCell person={person} />
								{store.days.map((_day, index) => (
									<Cell
										key={index}
										dayIndex={index}
										person={person}
									/>
								))}
							</tr>
						))}
						<tr className='planner-table__row'>
							<td className='planner-cell planner-cell_add'>
								<Button
									variant='primary'
									onClick={store.addPerson}
									title='Add Person'
								>
									Add
								</Button>
							</td>
						</tr>
					</tbody>
				</table>
			))}
		</DndProvider>
	);
};
