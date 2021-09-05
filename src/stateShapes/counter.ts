import {Dispatch} from 'redux';

export function counter(state: StateCounter['counter'] = 0, action: AppAction) {
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

export const thunkActionChangeCounter = (delta: number) => {
	return (dispatch: Dispatch<AppAction>, getState: () => AppState) => {
		const state = getState();
		dispatch({type: 'COUNTER_CHANGE', value: delta + state.counter});
	}
}