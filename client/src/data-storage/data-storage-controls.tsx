import { useObserver } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';

import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import { useStore } from '../use-store';

const PLANNER_DATA_KEY = 'savedPlan';

export const DataStorageButtons = () => {
	const store = useStore();
	const [show, setShow] = useState(false);
	const [modalText, setModalText] = useState('');
	const [modalTitle, setModalTitle] = useState('');

	const handleClose = () => setShow(false);
	const showPopup = (title: string, text: string) => {
		setModalText(text);
		setModalTitle(title);
		setShow(true);
	};

	const load = () => {
		const data = JSON.parse(localStorage.getItem(PLANNER_DATA_KEY) || '');
		try {
			applySnapshot(store, data);
			showPopup('Loaded', 'Plan is loaded from storage!');
		} catch (error) {
			const errorMessage = 'Error while loading data from storage';
			console.error(errorMessage, error);
			showPopup('Error', errorMessage);
		}
	};

	const save = () => {
		const snapshot = getSnapshot(store);
		const json = JSON.stringify(snapshot);
		localStorage.setItem(PLANNER_DATA_KEY, json);
		showPopup('Saved', 'Current Plan is saved!');
	};

	return useObserver(() => (
		<>
			<ButtonGroup>
				<Button variant='outline-danger' onClick={load} title='Load'>
					Load
				</Button>
				<Button variant='outline-success' onClick={save} title='Save'>
					Save
				</Button>
			</ButtonGroup>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton={true}>
					<Modal.Title>{modalTitle}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{modalText}</Modal.Body>
				<Modal.Footer>
					<Button variant='primary' onClick={handleClose}>
						OK
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	));
};
