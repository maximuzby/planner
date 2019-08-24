import { useObserver } from 'mobx-react-lite';
import React from 'react';

import { Day } from '../../stores';
import { EditableCell } from './editable-cell';

import './day-cell.css';

export const DayCell = (props: { day: Day }) => {
	return useObserver(() => (
		<EditableCell
			value={props.day.title}
			setValue={props.day.setTitle}
			classNamePrefix='day'
		/>
	));
};
