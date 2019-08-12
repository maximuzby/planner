import { useObserver } from 'mobx-react-lite';
import React from 'react';

import { Day } from '../../stores/day';
import './day-cell.css';
import { EditableCell } from './editable-cell';

export const DayCell = (props: { day: Day }) => {
	return useObserver(() => (
		<EditableCell
			value={props.day.title}
			setValue={props.day.setTitle}
			classNamePrefix='day'
		/>
	));
};
