import {DataModel} from 'src/types/dataModel';
import {combineReducers} from 'redux';
import {MainVar} from 'src/vars';

interface AddCityInfo {
	type: Weather.ActionType.ADD_CITY_INFO;
	value: DataModel.CityWeatherInfo;
}

interface ActivateCityId {
	type: Weather.ActionType.ACTIVATE_CITY_ID;
	value: number;
}

declare global {
	type WeatherAction =
		| AddCityInfo
		| ActivateCityId
}

export namespace Weather {
	export const enum ActionType {
		ADD_CITY_INFO = 'ADD_CITY_INFO',
		ACTIVATE_CITY_ID = 'ACTIVATE_CITY_ID',
	}

	export const getActiveCitiesInfo = (state: AppState['weather']): DataModel.CityWeatherInfo[] => {
		return Object.keys(state.activeIds)
			.filter(x => state.activeIds[x])
			.map(x => state.infoById[x])
			.filter(Boolean);
	}

	export function thunkRequestCityWeather(woeid: number): AppThunkAction {
		return async (dispatch, getState) => {
			if (!woeid) return;

			try {
				const result = await fetch(`${MainVar.metaWeatherApiUrl}/location/${woeid}/`);
				const json: DataModel.CityWeatherInfo = await result.json();

				if (!json.consolidated_weather) return;
				dispatch({type: Weather.ActionType.ADD_CITY_INFO, value: json});

			} catch (e) {
				// TODO report network error?
				console.log('network error');
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

	} else {
		return state;
	}
}

export function activeIds(state: WeatherState['activeIds'] = {}, action: WeatherAction): WeatherState['activeIds'] {
	if (action.type === Weather.ActionType.ACTIVATE_CITY_ID) {
		return {[action.value]: true};

	} else {
		return state;
	}
}