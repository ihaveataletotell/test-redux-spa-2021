import {ThunkDispatch} from 'redux-thunk';
import {DataModel} from 'src/types/dataModel';

declare global {
	interface StateCounter {
		counter: number;
	}

	interface StateCitiesList {
		citiesList: DataModel.CityInfo[];
	}

	interface GeoState {
		coords: GeolocationCoordinates | null;
		error: GeolocationPositionError | null;
	}

	interface WeatherState {
		infoById: {[key: number | string]: DataModel.CityWeatherInfo};
		activeIds: {[key: number | string]: boolean};
	}

	interface AppState extends
		StateCounter, StateCitiesList
	{
		geo: GeoState;
		weather: WeatherState;
	}

	type AppAction =
		| CounterAction
		| GeoAction
		| CitiesListAction
		| WeatherAction;

	type AppThunkDispatch = ThunkDispatch<AppState, null, AppAction>;

	type AppThunkAction = (dispatch: AppThunkDispatch, getState: () => AppState) => Promise<void> | void;
}

declare module 'react-redux' {
	export interface DefaultRootState extends AppState {}
}

declare module 'redux' {
	// export interface Action<T extends AppSimpleActionType> extends AppAction<T> {}
}