import {combineReducers} from 'redux';
import {MainVar} from 'src/vars';
import {DataModel} from 'src/types/dataModel';
import {Weather} from 'src/stateShapes/weather';

interface GeoCoordsReceived {
	type: Geo.ActionType.SET_COORDS;
	value: GeolocationCoordinates;
}

interface GeoError {
	type: Geo.ActionType.ERROR;
	value: GeolocationPositionError;
}

interface NearestCityWeather {
	type: Geo.ActionType.GET_NEAREST_CITY_WEATHER;
	value: DataModel.CityWeatherInfo;
}

declare global {
	type GeoAction =
		| GeoError
		| GeoCoordsReceived
		| NearestCityWeather
}

export namespace Geo {
	export const enum ActionType {
		SET_COORDS = 'GEO_SET_COORDS',
		ERROR = 'GEO_ERROR',
		GET_NEAREST_CITY_WEATHER = 'GET_NEAREST_CITY_WEATHER',
	}

	export const selectStateCoords = (state: AppState) => state.geo.coords;

	export function thunkGotNearestCities(cities: DataModel.CityInfo[]): AppThunkAction {
		return async (dispatch, getState) => {
			const nearestCity = cities[0];
			if (!nearestCity) return;

			dispatch({type: Weather.ActionType.ACTIVATE_CITY_ID, value: nearestCity.woeid});
			dispatch(Weather.thunkRequestCityWeather(nearestCity.woeid));
		}
	}

	export function thunkCoordsReceived(coords: GeolocationCoordinates): AppThunkAction {
		return async (dispatch, getState) => {
			const state = getState();
			const oldCoords = selectStateCoords(state);

			if (
				oldCoords?.altitude === coords.altitude
				&& oldCoords?.longitude === coords.longitude
			) return;

			dispatch({type: Geo.ActionType.SET_COORDS, value: coords});

			try {
				// const result = await fetch(`${MainVar.apiUrl}/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${MainVar.apiKey}`);
				const result = await fetch(`${MainVar.metaWeatherApiUrl}/location/search/?lattlong=${coords.latitude},${coords.longitude}`);
				const json: DataModel.CityInfo[] = await result.json();
				dispatch(thunkGotNearestCities(json));

			} catch (e) {
				// TODO report network error?
				console.log('network error');
			}
		}
	}
}

export const geo = combineReducers({
	coords: geoCoords,
	error: geoError,
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
		if (
			state?.altitude === action.value.altitude
			&& state?.longitude === action.value.longitude
		) return state;

		return {...action.value};

	} else {
		return state;
	}
}

// export function geoNearestCity(state: GeoState['error'] = null, action: GeoAction): GeoState['error'] {
// 	if (action.type === Geo.ActionType.ERROR) {
// 		if (
// 			state?.code === action.value.code
// 			&& state?.message === action.value.message
// 		) return state;
//
// 		return action.value;
//
// 	} else if (action.type === Geo.ActionType.SET_COORDS) {
// 		return null;
//
// 	} else {
// 		return state;
// 	}
// }