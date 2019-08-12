import { useObserver } from 'mobx-react-lite';
import React from 'react';

import { Person } from '../../stores/person';
import { EditableCell } from './editable-cell';
import './person-cell.css';

export const PersonCell = (props: { person: Person }) => {
	const person = props.person;
	return useObserver(() => (
		<EditableCell
			value={person.name}
			setValue={person.setName}
			classNamePrefix='person'
		/>
	));
};
