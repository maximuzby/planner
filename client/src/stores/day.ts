import { Instance, types } from 'mobx-state-tree';
import moment from 'moment';

import { dateUtils } from '../utils/date-utils';
import { Entity } from './entity';

export interface Day extends Instance<typeof Day> {}

export const Day = Entity.named('Day')
	.props({
		/** Date in ISO format */
		date: types.string,
		title: types.string,
	})
	.views(self => ({
		get isWeekend() {
			return dateUtils.isWeekend(moment(self.date));
		},
	}))
	.actions(self => ({
		setTitle: (title: string) => (self.title = title),
	}));
