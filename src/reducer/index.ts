import {combineReducers, Action} from 'redux';

export const rootReducer = combineReducers({
	counter,
});

function counter(state: number = 0, action: Action) {
	if (action.type === 'INCREMENT') {
		return state + 1;
	} else if (action.type === 'DECREMENT') {
		return state - 1;
	} else {
		return state;
	}
}