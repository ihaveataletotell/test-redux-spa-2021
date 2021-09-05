import {applyMiddleware, compose, createStore, Store} from 'redux';
import {rootReducer} from 'src/reducer';
import thunk from 'redux-thunk';
import {Geo} from 'src/stateShapes/geoLocation';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

class App {
	private static instance: App;

	private _storeMain!: Store<AppState, AppAction>;
	private _geoInterval?: number;
	private _isStarted?: boolean;
	private _isGeoBusy?: boolean;

	private static getMainStore(): Store<AppState, AppAction> {
		return createStore(rootReducer, composeEnhancers(
			applyMiddleware(thunk)
		));
	}

	constructor() {
		if (App.instance) return App.instance;

		App.instance = this;
		this._storeMain = App.getMainStore();
		return App.instance;
	}

	public getStoreMain(): Store {
		return this._storeMain;
	}

	public startHeartbeat() {
		if (this._isStarted) throw new Error('App is already started');
		this._isStarted = true;

		this._geoInterval = window.setInterval(this.handleGeoInterval, 60_000);
		void this.handleGeoInterval();
	}

	public stopHeartbeat() {
		window.clearInterval(this._geoInterval);
	}

	private handleGeoInterval = async () => {
		if (this._isGeoBusy) return;
		this._isGeoBusy = true;

		try {
			const result = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
			this.storeDispatch(Geo.thunkCoordsReceived(result.coords));

		} catch (e) {
			const assertedError = e as unknown as GeolocationPositionError;
			if (!('code' in assertedError)) throw e;

			this.storeDispatch({type: Geo.ActionType.ERROR, value: assertedError});

		} finally {
			this._isGeoBusy = false;
		}
	}

	private storeDispatch(action: AppThunkAction | AppAction): void {
		this._storeMain.dispatch(action as AppAction);
	}
}


export const app = new App();