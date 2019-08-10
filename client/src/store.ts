import { Instance, types } from 'mobx-state-tree';

export interface AppStore extends Instance<typeof AppStore> {}

export const AppStore = types
	.model('PlannerApp', {
		text: types.string,
	})
	.actions(self => ({
		changeText: (newText: string) => {
			self.text = newText;
		},
	}));
