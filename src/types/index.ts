export interface AnyType {}

declare global {
	interface StateCounter {
		counter: number;
	}

	type AppActionType = 'INCREMENT' | 'DECREMENT';

	interface AppAction<T = AppActionType> {
		type: T;
	}
}

declare module 'react-redux' {
	export interface DefaultRootState extends StateCounter {}
}

declare module 'redux' {
	export interface Action<T extends AppActionType> extends AppAction<T> {}
}