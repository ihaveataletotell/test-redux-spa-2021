import * as React from 'react';
import {connect} from 'react-redux';
import {thunkActionChangeCounter} from 'src/stateShapes/counter';

interface MainConnectedState extends StateCounter {}

interface MainConnectedDispatch {
	doIncrement(): void;
	doDecrement(): void;
}

class MainInner extends React.PureComponent<MainConnectedState & MainConnectedDispatch> {
	render() {
		const {props} = this;

		return (
			<>
				<button
					onClick={props.doDecrement}
					children={'-'}
				/>

				{' '}
				{props.counter}
				{' '}

				<button
					onClick={props.doIncrement}
					children={'+'}
				/>
			</>
		)
	}
}

export const Main = connect(
	(state): MainConnectedState => {
		return {
			counter: state.counter,
		}
	},
	(dispatch: AppThunkDispatch): MainConnectedDispatch => {
		return {
			doIncrement: () => dispatch(thunkActionChangeCounter(1)),
			doDecrement: () => dispatch(thunkActionChangeCounter(-1)),
		}
	},
)(MainInner);