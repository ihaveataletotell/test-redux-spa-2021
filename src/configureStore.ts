import {applyMiddleware, createStore} from 'redux';
import {rootReducer} from 'src/reducer';
import thunk from 'redux-thunk';

export const storeMain = createStore(rootReducer, applyMiddleware(thunk));
