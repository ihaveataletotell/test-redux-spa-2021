import * as React from 'react';
import {DataModel} from 'src/types/dataModel';
import './DayWeatherInfo.css';
import {TextUtils} from 'src/utils/date';
import cn from 'classnames';

interface DayWeatherInfoProps {
	data: DataModel.ConsolidatedWeatherInfo;
	className?: string;
}

export class DayWeatherInfo extends React.PureComponent<DayWeatherInfoProps> {
	render() {
		const {props: {data, className}} = this;

		const dateStr = TextUtils.formatDate(data.applicable_date, 'DD.MM');

		return (
			<div className={cn('weatherInfo', className)}>
				<div className={'weatherInfo__header'}>
					<h3
						children={dateStr}
						className={'weatherInfo__title'}
					/>

					<div
						children={`${TextUtils.getTemp(data.the_temp)}`}
						className={'weatherInfo__temp'}
					/>
				</div>

				<div
					children={`${data.weather_state_name}`}
					className={'weatherInfo__state'}
				/>

				<div
					children={`Min temp: ${TextUtils.getTemp(data.min_temp)}`}
				/>

				<div
					children={`Max temp: ${TextUtils.getTemp(data.max_temp)}`}
				/>

				<div
					children={`Wind: ${TextUtils.getSpeed(data.wind_speed)}m/s`}
				/>
			</div>
		)
	}
}