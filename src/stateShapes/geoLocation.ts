import {combineReducers} from 'redux';
import {MainVar} from 'src/vars';
import {DataModel} from 'src/types/dataModel';
import {Weather} from 'src/stateShapes/weather';
import {CoordsUtils} from 'src/utils/coords';
import {LazyEmitter} from 'src/classes/lazyEmitter';

interface GeoCoordsReceived {
	type: Geo.ActionType.SET_COORDS;
	value: DataModel.GeoCoors;
}

interface GeoError {
	type: Geo.ActionType.ERROR;
	value: GeolocationPositionError;
}

interface NearestCityWeather {
	type: Geo.ActionType.GET_NEAREST_CITY_WEATHER;
	value: DataModel.CityWeatherInfo;
}

interface NearestCitiesLoaded {
	type: Geo.ActionType.NEAREST_CITIES_LOADED;
	value: DataModel.CityInfo[];
}

interface ChangedSearchQuery {
	type: Geo.ActionType.CHANGED_SEARCH_QUERY;
	value: string;
}

interface LazyEmitterParams {
	dispatch: AppThunkDispatch;
	getState: () => AppState;
}

type SimpleActions = Geo.ActionType.NEAREST_CITIES_RESET | Geo.ActionType.SELECT_CITY;

declare global {
	type GeoAction =
		| {type: SimpleActions}
		| GeoError
		| GeoCoordsReceived
		| NearestCityWeather
		| NearestCitiesLoaded
		| ChangedSearchQuery
}

export namespace Geo {
	export const enum ActionType {
		SET_COORDS = 'GEO_SET_COORDS',
		ERROR = 'GEO_ERROR',
		GET_NEAREST_CITY_WEATHER = 'GEO_GET_NEAREST_CITY_WEATHER',
		NEAREST_CITIES_LOADED = 'GEO_NEAREST_CITIES_LOADED',
		NEAREST_CITIES_RESET = 'GEO_NEAREST_CITIES_RESET',
		CHANGED_SEARCH_QUERY = 'GEO_CHANGED_SEARCH_QUERY',
		SELECT_CITY = 'GEO_SELECT_CITY',
	}

	export const selectStateCoords = (state: AppState) => state.geo.coords;

	export function thunkSelectCityQuery(queryNew?: string): AppThunkAction {
		return async (dispatch, getState) => {
			const nearestCities = getState().geo.nearestCities;
			const query = queryNew || getState().geo.searchQuery;

			const foundCity = nearestCities?.find(x => x.title === query);
			if (!foundCity) return;

			dispatch(thunkSelectCity(foundCity.woeid));

			lazySearcherCities.destroy();
			dispatch({type: Geo.ActionType.CHANGED_SEARCH_QUERY, value: ''});
		}
	}

	export function thunkSelectCity(woeid: number): AppThunkAction {
		return async (dispatch, getState) => {
			dispatch({type: Weather.ActionType.ACTIVATE_CITY_ID, value: woeid});
			dispatch(Weather.thunkRequestSelectedCities());
		}
	}

	export const handleSearchCities = async ({dispatch, getState}: LazyEmitterParams) => {
		const query = getState().geo.searchQuery;
		if (!query) return;

		try {
			const result = await fetch(`${MainVar.metaWeatherApiUrl}/location/search/?query=${query}`);
			const json: DataModel.CityInfo[] = await result.json();

			if (!Array.isArray(json)) return;
			dispatch({type: Geo.ActionType.NEAREST_CITIES_LOADED, value: json});

		} catch (e) {
			console.log('network error');
		}
	}

	const lazySearcherCities = new LazyEmitter<LazyEmitterParams>(handleSearchCities);

	export function thunkSearchCities(query: string): AppThunkAction {
		return async (dispatch, getState) => {
			dispatch({type: Geo.ActionType.CHANGED_SEARCH_QUERY, value: query});
			lazySearcherCities.call({dispatch, getState});
		}
	}

	export function thunkNearestCitiesLoaded(cities: DataModel.CityInfo[]): AppThunkAction {
		return async (dispatch, getState) => {
			const nearestCity = cities[0];
			if (!nearestCity) return;

			const data = getState().weather.activeIds;

			// пользователь отметил выбранный город как ненужный
			if ((nearestCity.woeid in data) && !data[nearestCity.woeid]) {
				return;
			}

			dispatch({type: Geo.ActionType.NEAREST_CITIES_LOADED, value: cities});
			dispatch(Geo.thunkSelectCity(nearestCity.woeid));
		}
	}

	export function thunkCoordsReceived(coords: DataModel.GeoCoors): AppThunkAction {
		return async (dispatch, getState) => {
			const state = getState();
			const oldCoords = selectStateCoords(state);
			const nearestCity = state.geo.nearestCities?.[0];
			const isCoordsEqual = CoordsUtils.isEqual(oldCoords, coords);

			if (isCoordsEqual && nearestCity) return;
			dispatch({type: Geo.ActionType.SET_COORDS, value: coords});

			try {
				const result = await fetch(`${MainVar.metaWeatherApiUrl}/location/search/?lattlong=${coords.latitude},${coords.longitude}`);
				const json: DataModel.CityInfo[] = await result.json();

				if (Array.isArray(json)) dispatch(thunkNearestCitiesLoaded(json))
				else dispatch({type: Geo.ActionType.NEAREST_CITIES_RESET});

			} catch (e) {
				dispatch({type: Geo.ActionType.NEAREST_CITIES_RESET});
				console.log('network error');
			}
		}
	}
}

export const geo = combineReducers({
	coords: geoCoords,
	error: geoError,
	nearestCities: geoNearestCities,
	searchQuery: geoSearchQuery,
});

export function geoError(state: GeoState['error'] = null, action: GeoAction): GeoState['error'] {
	if (action.type === Geo.ActionType.ERROR) {
		if (
			state?.code === action.value.code
			&& state?.message === action.value.message
		) return state;

		return {...action.value};

	} else if (action.type === Geo.ActionType.SET_COORDS) {
		return null;

	} else {
		return state;
	}
}

export function geoCoords(state: GeoState['coords'] = null, action: GeoAction): GeoState['coords'] {
	if (action.type === Geo.ActionType.ERROR) {
		return state;

	} else if (action.type === Geo.ActionType.SET_COORDS) {
		if (CoordsUtils.isEqual(state, action.value)) return state;

		return {
			latitude: action.value.latitude,
			longitude: action.value.longitude,
		};

	} else {
		return state;
	}
}

export function geoNearestCities(state: GeoState['nearestCities'] = null, action: GeoAction): GeoState['nearestCities'] {
	if (action.type === Geo.ActionType.NEAREST_CITIES_LOADED) {
		return [...action.value];

	} else if (action.type === Geo.ActionType.NEAREST_CITIES_RESET) {
		return null;

	} else {
		return state;
	}
}

export function geoSearchQuery(state: GeoState['searchQuery'] = '', action: GeoAction): GeoState['searchQuery'] {
	if (action.type === Geo.ActionType.CHANGED_SEARCH_QUERY) {
		return action.value;

	} else {
		return state;
	}
}