export class LazyEmitter<T = void> {
	private _callArg?: T;
	private _callBlocked: boolean;
	private _needCall?: boolean;
	private _timeout?: number;
	private readonly _delay: number;
	private _method: (arg: T) => void;

	constructor(method: (arg: T) => void, delay = 300) {
		this._callBlocked = false;
		this._delay = delay;
		this._method = method;

		this.resetTimeout();
	}

	private resetTimeout = (): void => {
		window.clearTimeout(this._timeout);
		this._timeout = window.setTimeout(this.handleTimeout, this._delay);
	};

	private handleTimeout = (): void => {
		this._callBlocked = false;
		if (!this._needCall) return;
		this.call(this._callArg!);
	};

	destroy = (): void => {
		this._callArg = undefined;
		this._needCall = false;
		window.clearTimeout(this._timeout);
	}

	get method(): ((arg: T) => void) {
		return this._method;
	}

	set method(fn: (arg: T) => void) {
		this._method = fn;
	}

	get isCallBlocked(): boolean {
		return this._callBlocked;
	}

	get delay(): number {
		return this._delay;
	}

	call = (arg: T): void => {
		if (this._callBlocked) {
			this._callArg = arg;
			this._needCall = true;
			return;
		}

		this._method(arg);
		this.destroy();
		this._callBlocked = true;
		this.resetTimeout();
	};
}