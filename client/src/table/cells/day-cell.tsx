import { useObserver } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';

import { Day } from '../../store';
import './day-cell.css';

const DayInlineEditor = (props: { day: Day; onBlur: () => void }) => {
	const onChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			props.day.setTitle(event.target.value);
		},
		[props.day],
	);

	return useObserver(() => (
		<input
			autoFocus={true}
			onBlur={props.onBlur}
			className='day-cell-editor'
			value={props.day.title}
			type='text'
			onChange={onChange}
		/>
	));
};

export const DayCell = (props: { day: Day }) => {
	const [editing, setEditing] = useState(false);

	const enableEditing = useCallback(() => {
		setEditing(true);
	}, []);

	const disableEditing = useCallback(() => {
		setEditing(false);
	}, []);

	return useObserver(() => (
		<th
			className='planner-cell planner-cell_header'
			onClick={enableEditing}
		>
			{editing ? (
				<DayInlineEditor day={props.day} onBlur={disableEditing} />
			) : (
				<div className='day-cell-text'>{props.day.title}</div>
			)}
		</th>
	));
};
