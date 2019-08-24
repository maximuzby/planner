import { useObserver } from 'mobx-react-lite';
import React from 'react';
import {
	Col,
	FormControl,
	FormControlProps,
	FormGroup,
	Row,
} from 'react-bootstrap';

import { Task } from '../stores';
import { useStore } from '../use-store';

const TaskEditorControls = (props: { task: Task }) => {
	const task = props.task;

	const setName = (event: React.FormEvent<FormControlProps>) => {
		task.setName(event.currentTarget.value || '');
	};

	return useObserver(() => (
		<FormGroup>
			<FormControl value={task.name} onChange={setName} />
		</FormGroup>
	));
};

export const TaskEditor = () => {
	const store = useStore();

	return useObserver(() => (
		<Row>
			<Col lg='3'>
				{store.selectedTask && (
					<TaskEditorControls task={store.selectedTask} />
				)}
			</Col>
		</Row>
	));
};
