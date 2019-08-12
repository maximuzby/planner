import { types } from 'mobx-state-tree';

import { guidBuilder } from '../utils/guid-builder';

export const Entity = types.model('Entity', {
	id: types.optional(types.identifier, guidBuilder.build),
});
