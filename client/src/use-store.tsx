import { useLocalStore } from 'mobx-react-lite';
import React from 'react';

import { AppStore } from './store';

const storeContext = React.createContext<AppStore | null>(null);

interface StoreProviderProps {
	children: JSX.Element;
}

function createStore() {
	return AppStore.create({ text: 'hello' });
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
	const store = useLocalStore(createStore);
	return (
		<storeContext.Provider value={store}>{children}</storeContext.Provider>
	);
};

export const useStore = () => {
	const store = React.useContext(storeContext);
	if (!store) {
		// this is especially useful in TypeScript so you don't need to be checking for null all the time
		throw new Error('You have forgot to use StoreProvider, shame on you.');
	}
	return store;
};
