import { Moment } from 'moment';

const SATURDAY = 6;

export const dateUtils = {
	isWeekend: (date: Moment) => {
		return date.isoWeekday() <= SATURDAY;
	},
};
