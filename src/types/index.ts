import {ThunkDispatch} from 'redux-thunk';

export interface AnyType {}

declare global {
	interface StateCounter {
		counter: number;
	}

	interface StateCitiesList {
		cities: AppCity[];
	}

	interface AppState  extends
		StateCounter, StateCitiesList
	{}

	type AppSimpleActionType =
		'COUNTER_INCREMENT' | 'COUNTER_DECREMENT';

	interface CounterChangeAction {
		type: 'COUNTER_CHANGE';
		value: number;
	}

	type AppAction<T = AppSimpleActionType> =
		{type: T}
		| CounterChangeAction;

	type AppThunkDispatch = ThunkDispatch<AppState, null, AppAction>;
}

declare module 'react-redux' {
	export interface DefaultRootState extends AppState {}
}

declare module 'redux' {
	// export interface Action<T extends AppSimpleActionType> extends AppAction<T> {}
}