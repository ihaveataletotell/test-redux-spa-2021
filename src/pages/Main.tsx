import * as React from 'react';
import {connect} from 'react-redux';
import {thunkActionChangeCounter} from 'src/stateShapes/counter';
import {DataModel} from 'src/types/dataModel';
import {Weather} from 'src/stateShapes/weather';
import {Preloader} from 'src/components/Preloader';
import './Main.css';
import {Geo} from 'src/stateShapes/geoLocation';
import {CityWeatherInfo} from 'src/components/CityWeatherInfo';

interface MainConnectedState extends StateCounter {
	activeCitiesInfo: (DataModel.CityWeatherInfo | undefined)[];
	isLoading: boolean;
	inputCityQuery: string;
	nearestCities: GeoState['nearestCities'];
}

interface MainConnectedDispatch {
	doIncrement(): void;
	doDecrement(): void;
	removeCity(woeid: number): void;
	inputCity(query: string): void;
	selectCityFromQuery(query?: string): void;
}

class MainInner extends React.PureComponent<MainConnectedState & MainConnectedDispatch> {
	constructor(props: MainConnectedState & MainConnectedDispatch) {
		super(props);

		this.state = {
			inputText: '',
		}
	}

	handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.inputCity(e.target.value);
	}

	handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key !== 'Enter') return;
		this.props.selectCityFromQuery();
	}

	handleClickList = (e: React.MouseEvent) => {
		const cityName = (e.target as HTMLElement)?.dataset.itemId;
		if (!cityName) return;

		this.props.selectCityFromQuery(cityName);
		(e.target as HTMLElement).blur?.();
	}

	renderCrossIcon(woeid: number): React.ReactElement {
		return (
			<div
				className={'crossIcon'}
				title={'Remove city'}
				onClick={() => this.props.removeCity(woeid)}
			>
				<svg
					width={10}
					height={10}
					viewBox="0 0 329.26933 329"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"/>
				</svg>
			</div>
		);
	}

	renderInfo() {
		const {props} = this;

		if (props.isLoading) return <Preloader />;
		if (!props.activeCitiesInfo.length) return 'Не выбраны города';

		return (
			props.activeCitiesInfo.map((x, idx) => {
				if (!x) {
					return <WeatherPreloader key={idx} />;
				}

				return (
					<CityWeatherInfo
						data={x}
						key={x.woeid}
						slotHeaderRight={this.renderCrossIcon(x.woeid)}
					/>
				)
			})
		)
	}

	renderForm(): React.ReactElement {
		const {props} = this;

		return (
			<div className={'header__inputWrap'}>
				<input
					type={'text'}
					value={props.inputCityQuery}
					placeholder={'Add city'}
					onChange={this.handleInputChange}
					onKeyDown={this.handleKeyDown}
					autoComplete={'true'}
				/>

				<div
					className={'form__items'}
					onClick={this.handleClickList}
				>
					{props.nearestCities?.map(x => {
						return (
							<div
								className={'form__listItem'}
								data-item-id={x.title}
								key={x.woeid}
								tabIndex={0}
								children={x.title}
							/>
						)
					})}
				</div>
			</div>
		)
	}

	render() {
		return (
			<div className={'main'}>
				<div className={'main__header'}>
					<div
						children={'Weather App'}
						className={'headerText'}
					/>

					{this.renderForm()}
				</div>

				<div className={'main__body'}>
					{this.renderInfo()}
				</div>
			</div>
		);
	}
}

export const WeatherPreloader = React.memo(
	function WeatherPreloader(): React.ReactElement {
		return (
			<div
				className={'flex'}
			>
				<div
					className={'animateLoad'}
					style={{width: 150, marginRight: 30, flex: '0 0 150px'}}
				/>

				<div
					className={'animateLoad daysAnimated'}
					style={{width: '60vh'}}
				/>
			</div>
		);
	}
);

export const Main = connect(
	(state): MainConnectedState => {
		return {
			counter: state.counter,
			activeCitiesInfo: Weather.getActiveCitiesInfo(state.weather),
			isLoading: Weather.isLoading(state),
			inputCityQuery: state.geo.searchQuery,
			nearestCities: state.geo.nearestCities,
		}
	},
	(dispatch: AppThunkDispatch): MainConnectedDispatch => {
		return {
			doIncrement: () => dispatch(thunkActionChangeCounter(1)),
			doDecrement: () => dispatch(thunkActionChangeCounter(-1)),
			removeCity: (woeid: number) => dispatch({type: Weather.ActionType.DEACTIVATE_CITY_ID, value: woeid}),
			inputCity: (query: string) => dispatch(Geo.thunkSearchCities(query)),
			selectCityFromQuery: (query?: string) => dispatch(Geo.thunkSelectCityQuery(query)),
		}
	},
)(MainInner);