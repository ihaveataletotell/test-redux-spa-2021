import {Action} from 'redux';

type CounterSimpleActionTypes = 'COUNTER_INCREMENT' | 'COUNTER_DECREMENT';

interface CounterChangeAction {
	type: 'COUNTER_CHANGE';
	value: number;
}

declare global {
	type CounterAction =
		| CounterChangeAction
		| Action<CounterSimpleActionTypes>
}

export function counter(state: StateCounter['counter'] = 0, action: CounterAction) {
	if (action.type === 'COUNTER_INCREMENT') {
		return state + 1;

	} else if (action.type === 'COUNTER_DECREMENT') {
		return state - 1;

	} else if (action.type === 'COUNTER_CHANGE') {
		return action.value;

	} else {
		return state;
	}
}

export const thunkActionChangeCounter = (delta: number): AppThunkAction => {
	return (dispatch, getState) => {
		const state = getState();
		dispatch({type: 'COUNTER_CHANGE', value: delta + state.counter});
	}
}