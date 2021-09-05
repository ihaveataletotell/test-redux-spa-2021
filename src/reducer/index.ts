import {combineReducers, Action} from 'redux';
import {counter} from 'src/stateShapes/counter';

export const rootReducer = combineReducers({
	counter,
	citiesList,
});

function citiesList(state: StateCitiesList['cities'] = [], action: Action) {
	return state;
}