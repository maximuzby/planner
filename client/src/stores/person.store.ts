import { Instance, types } from 'mobx-state-tree';

import { Entity } from './entity.store';

export interface Person extends Instance<typeof Person> {}

export const Person = Entity.named('Person')
	.props({
		name: types.string,
	})

	.actions(self => ({
		setName: (name: string) => (self.name = name),
	}));
