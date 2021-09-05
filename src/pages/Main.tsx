import * as React from 'react';
import {connect} from 'react-redux';
import {thunkActionChangeCounter} from 'src/stateShapes/counter';
import {DataModel} from 'src/types/dataModel';
import {Weather} from 'src/stateShapes/weather';
import {CityWeatherInfo} from 'src/components/CityWeatherInfo';
import './Main.css';
import {Preloader} from 'src/components/Preloader';

interface MainConnectedState extends StateCounter {
	activeCitiesInfo: DataModel.CityWeatherInfo[];
}

interface MainConnectedDispatch {
	doIncrement(): void;
	doDecrement(): void;
}

class MainInner extends React.PureComponent<MainConnectedState & MainConnectedDispatch> {
	renderCounterSample() {
		const {props} = this;
		return null;

		// return (
		// 	<div>
		// 		<button
		// 			onClick={props.doDecrement}
		// 			children={'-'}
		// 		/>
		//
		// 		{' '}
		// 		{props.counter}
		// 		{' '}
		//
		// 		<button
		// 			onClick={props.doIncrement}
		// 			children={'+'}
		// 		/>
		// 	</div>
		// );
	}

	renderInfo() {
		const {props} = this;

		if (!props.activeCitiesInfo.length) return <Preloader />;

		return (
			props.activeCitiesInfo.map(x => {
				return (
					<CityWeatherInfo
						key={x.woeid}
						data={x}
					/>
				)
			})
		)
	}

	render() {
		return (
			<div className={'main'}>
				<div className={'main__header'}>
					Weather App
				</div>

				<div className={'main__body'}>
					{this.renderCounterSample()}

					{this.renderInfo()}
				</div>
			</div>
		);
	}
}

export const Main = connect(
	(state): MainConnectedState => {
		return {
			counter: state.counter,
			activeCitiesInfo: Weather.getActiveCitiesInfo(state.weather),
		}
	},
	(dispatch: AppThunkDispatch): MainConnectedDispatch => {
		return {
			doIncrement: () => dispatch(thunkActionChangeCounter(1)),
			doDecrement: () => dispatch(thunkActionChangeCounter(-1)),
		}
	},
)(MainInner);