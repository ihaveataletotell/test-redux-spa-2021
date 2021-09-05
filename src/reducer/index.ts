import {combineReducers} from 'redux';
import {counter} from 'src/stateShapes/counter';
import {citiesList} from 'src/stateShapes/citiesList';
import {geo} from 'src/stateShapes/geoLocation';
import {weather} from 'src/stateShapes/weather';

export const rootReducer = combineReducers({
	counter,
	citiesList,
	geo,
	weather,
});