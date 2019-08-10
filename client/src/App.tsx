import React from 'react';

import './app.css';
import { Table } from './table/table';
import { StoreProvider } from './use-store';

const AppContainer: React.FC = props => {
	return (
		<div className='app'>
			<header className='app__header'>
				<span className='app__title'>Planner</span>
			</header>
			<main className='app__main'>{props.children}</main>
		</div>
	);
};

export const App: React.FC = () => {
	return (
		<StoreProvider>
			<AppContainer>
				<Table />
			</AppContainer>
		</StoreProvider>
	);
};
