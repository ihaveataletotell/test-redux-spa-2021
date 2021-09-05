import * as React from 'react';
import {DataModel} from 'src/types/dataModel';
import './CityWeatherInfo.css';
import {DayWeatherInfo} from 'src/components/DayWeatherInfo';

interface CityWeatherInfoProps {
	data: DataModel.CityWeatherInfo;
}

export class CityWeatherInfo extends React.PureComponent<CityWeatherInfoProps> {
	get data() {
		return this.props.data;
	}

	renderItems() {
		const {data} = this;

		return data.consolidated_weather?.map(x => {
			return (
				<DayWeatherInfo
					className={'cityWeather__item'}
					key={x.id}
					data={x}
				/>
			)
		});
	}

	renderTitle() {
		const {data} = this;

		const dateObj = new Date(data.time);
		const date = dateObj.toDateString();
		const time = `${dateObj.getHours()}:${dateObj.getMinutes()}`;

		return (
			<div className={'cityWeather__title'}>
				<h3
					children={data.title}
				/>

				<div
					children={`${date} ${time}`}
				/>
			</div>
		)
	}

	render() {
		return (
			<div className={'cityWeather'}>
				{this.renderTitle()}

				{this.renderItems()}
			</div>
		)
	}
}