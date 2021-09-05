import {DataModel} from 'src/types/dataModel';
import {combineReducers} from 'redux';
import {MainVar} from 'src/vars';
import {TextUtils} from 'src/utils/date';

interface AddCityInfo {
	type: Weather.ActionType.ADD_CITY_INFO;
	value: DataModel.CityWeatherInfo;
}

interface ActivateCityId {
	type: Weather.ActionType.ACTIVATE_CITY_ID;
	value: number;
}

interface DeactivateCityId {
	type: Weather.ActionType.DEACTIVATE_CITY_ID;
	value: number;
}

declare global {
	type WeatherAction =
		| AddCityInfo
		| ActivateCityId
		| DeactivateCityId;
}

export namespace Weather {
	export const enum ActionType {
		ADD_CITY_INFO = 'WEATHER_ADD_CITY_INFO',
		ACTIVATE_CITY_ID = 'WEATHER_ACTIVATE_CITY_ID',
		DEACTIVATE_CITY_ID = 'WEATHER_DEACTIVATE_CITY_ID',
	}

	export const getActiveCitiesInfo = (state: AppState['weather']): (DataModel.CityWeatherInfo | undefined)[] => {
		return Object.keys(state.activeIds)
			.filter(x => state.activeIds[x])
			.sort((a, b) => {
				return state.activeIds[a] > state.activeIds[b] ? -1 : 1;
			})
			.map(x => state.infoById[x])
	}

	export const isLoading = (state: AppState): boolean => {
		const activeCities = getActiveCitiesInfo(state.weather);

		if (activeCities.length) return false;
		if (!state.geo.coords && !state.geo.error) return true;
		if (!state.geo.nearestCities?.length) return true;
		if (Object.keys(requestingIds).some(Boolean) && !activeCities.length) return true;

		return false;
	}

	let _requestSelectedCitiesTimeout: number;

	export function thunkRequestSelectedCities(): AppThunkAction {
		return async (dispatch, getState) => {
			window.clearTimeout(_requestSelectedCitiesTimeout);
			const activeCities = getState().weather.activeIds;

			for (let city in activeCities) {
				if (!activeCities[city]) continue;
				dispatch(Weather.thunkRequestCityWeather(city));
			}

			await new Promise(res => _requestSelectedCitiesTimeout = window.setTimeout(res, 60_000));
			dispatch(thunkRequestSelectedCities());
		}
	}

	const requestingIds: {[key: number | string]: boolean} = {};

	export function thunkRequestCityWeather(woeid: number | string): AppThunkAction {
		return async (dispatch, getState) => {
			if (!woeid) return;

			const now = Date.now();
			const data = getState().weather.infoById[woeid];
			const requested = +new Date(data?.time);

			if (requested && now - requested < TextUtils.timeS60) return;
			if (requestingIds[woeid]) return;
			requestingIds[woeid] = true;

			try {
				const result = await fetch(`${MainVar.metaWeatherApiUrl}/location/${woeid}/`);
				const json: DataModel.CityWeatherInfo = await result.json();

				if (!json.consolidated_weather) return;
				dispatch({type: Weather.ActionType.ADD_CITY_INFO, value: json});

			} catch (e) {
				console.log('network error');

			} finally {
				requestingIds[woeid] = false;
			}
		}
	}
}

export const weather = combineReducers({
	infoById: infoByWoid,
	activeIds: activeIds,
});

export function infoByWoid(state: WeatherState['infoById'] = {}, action: WeatherAction): WeatherState['infoById'] {
	if (action.type === Weather.ActionType.ADD_CITY_INFO) {
		return {...state, [action.value.woeid]: action.value};

	} else if (action.type === Weather.ActionType.DEACTIVATE_CITY_ID) {
		const newState = {...state};
		delete newState[action.value];
		return newState;

	} else {
		return state;
	}
}

export function activeIds(state: WeatherState['activeIds'] = {}, action: WeatherAction): WeatherState['activeIds'] {
	if (action.type === Weather.ActionType.ACTIVATE_CITY_ID) {
		if (!action.value) return state;
		return {...state, [action.value]: Date.now()};

	} else if (action.type === Weather.ActionType.DEACTIVATE_CITY_ID) {
		if (!action.value) return state;
		return {...state, [action.value]: false};

	} else {
		return state;
	}
}