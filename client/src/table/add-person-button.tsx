import { useObserver } from 'mobx-react-lite';
import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';

import { useStore } from '../use-store';

export const AddPersonButton = () => {
	const store = useStore();

	return useObserver(() => (
		<Row>
			<Col lg='2'>
				<Button
					variant='primary'
					onClick={store.addPerson}
					title='Add Person'
				>
					Add Person
				</Button>
			</Col>
		</Row>
	));
};
