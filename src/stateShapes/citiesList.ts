import {DataModel} from 'src/types/dataModel';

interface CitiesListAddCity {
	type: 'ADD_CITY';
	value: DataModel.CityInfo;
}

interface CitiesListRemoveCity {
	type: 'REMOVE_CITY';
	cityId: number;
}

declare global {
	type CitiesListAction =
		| CitiesListAddCity
		| CitiesListRemoveCity;
}

export function citiesList(state: StateCitiesList['citiesList'] = [], action: CitiesListAction) {
	if (action.type === 'ADD_CITY') {
		return [...state, action.value];

	} else if (action.type === 'REMOVE_CITY') {
		return state.filter(x => x.woeid !== action.cityId);

	} else {
		return state;
	}
}