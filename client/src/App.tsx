import { useObserver } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import './App.css';
import { StoreProvider, useStore } from './use-store';

const MainPage = () => {
	const store = useStore();

	const onChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			store.changeText(event.target.value);
		},
		[],
	);

	return useObserver(() => (
		<div>
			<div>{store.text}</div>
			<div>
				<input type='text' onChange={onChange} />
			</div>
		</div>
	));
};

export const App: React.FC = () => {
	return (
		<StoreProvider>
			<MainPage />
		</StoreProvider>
	);
};
