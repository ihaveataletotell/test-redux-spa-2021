import {applyMiddleware, compose, createStore, Store, Unsubscribe} from 'redux';
import {rootReducer} from 'src/reducer';
import thunk from 'redux-thunk';
import {Geo} from 'src/stateShapes/geoLocation';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

class App {
	private static instance: App;
	private static storagePrefix = 'cx_appWeather_v0';

	private static get storeKey(): string {
		return `${App.storagePrefix}.store`;
	}

	private static getInitialState() {
		try {
			const item = localStorage.getItem(App.storeKey);
			if (!item) return;

			const json = JSON.parse(item);
			return json;

		} catch (e) {}
	}

	private static saveStateChange(state: AppState) {
		try {
			localStorage.setItem(App.storeKey, JSON.stringify(state));
		} catch (e) {}
	}

	private static getMainStore(): Store<AppState, AppAction> {
		return createStore(
			rootReducer,
			App.getInitialState(),
			composeEnhancers(applyMiddleware(thunk)),
		);
	}

	private _storeMain!: Store<AppState, AppAction>;
	private _geoInterval?: number;
	private _isStarted?: boolean;
	private _isGeoBusy?: boolean;
	private _unsubStoreHandle?: Unsubscribe;

	constructor() {
		if (App.instance) return App.instance;

		App.instance = this;
		this._storeMain = App.getMainStore();
		return App.instance;
	}

	private handleStoreChange = () => {
		const state = this.storeMain.getState();
		App.saveStateChange(state);
	}

	public get storeMain(): Store {
		return this._storeMain;
	}

	public startHeartbeat() {
		if (this._isStarted) throw new Error('App is already started');
		this._isStarted = true;

		this._unsubStoreHandle = this.storeMain.subscribe(this.handleStoreChange);
		void this.handleGeoInterval();
	}

	public stopHeartbeat() {
		this._unsubStoreHandle?.();
		window.clearTimeout(this._geoInterval);
	}

	private handleGeoInterval = async () => {
		if (this._isGeoBusy) return;
		this._isGeoBusy = true;

		try {
			const result = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));

			this.storeDispatch(Geo.thunkCoordsReceived(result.coords));
			this._geoInterval = window.setTimeout(this.handleGeoInterval, 60_000);

		} catch (e) {
			const assertedError = e as unknown as GeolocationPositionError;
			if (!('code' in assertedError)) throw e;

			// this.storeDispatch({type: Geo.ActionType.ERROR, value: assertedError});
			// при ошибке можно грузить захардкоженные координаты
			this.storeDispatch(Geo.thunkCoordsReceived({latitude: 55.751244, longitude: 37.618423}));
			this._geoInterval = window.setTimeout(this.handleGeoInterval, 10_000);

		} finally {
			this._isGeoBusy = false;
		}
	}

	private storeDispatch(action: AppThunkAction | AppAction): void {
		this._storeMain.dispatch(action as AppAction);
	}
}


export const app = new App();