import * as React from 'react';
import {DataModel} from 'src/types/dataModel';
import './CityWeatherInfo.css';
import {DayWeatherInfo} from 'src/components/DayWeatherInfo';
import {TextUtils} from 'src/utils/date';

interface CityWeatherInfoProps {
	data: DataModel.CityWeatherInfo;
	slotHeaderRight?: React.ReactNode;
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
		const {data, props} = this;

		const date = TextUtils.formatDate(data.time, 'DD.MM.YYYY');
		const time = TextUtils.formatDate(data.time, 'HH:NN');

		return (
			<div className={'cityWeather__title'}>
				<div className={'cityWeather__headerWrap'}>
					<h3
						children={data.title}
						className={'cityWeather__header'}
					/>

					{props.slotHeaderRight}
				</div>

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

				<div className={'cityWeather__items'}>
					{this.renderItems()}
				</div>
			</div>
		)
	}
}