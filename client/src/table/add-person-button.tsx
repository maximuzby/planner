import { useObserver } from 'mobx-react-lite';
import React from 'react';
import { Button, Col } from 'react-bootstrap';

import { useStore } from '../use-store';

export const AddPersonButton = () => {
	const store = useStore();

	return useObserver(() => (
		<Col sm='4'>
			<Button
				variant='outline-primary'
				onClick={store.addPerson}
				title='Add Person'
			>
				Add Person
			</Button>
		</Col>
	));
};
