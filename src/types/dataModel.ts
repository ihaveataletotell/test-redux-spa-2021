export namespace DataModel {
	export interface CityInfo {
		distance: number;
		latt_long: string;
		title: string;
		woeid: number;
	}

	export interface CityWeatherInfo extends CityWeatherBasicInfo {
		consolidated_weather: ConsolidatedWeatherInfo[];
		title: string;
		time: string;
		parent: CityWeatherBasicInfo;
		woeid: number;
	}

	interface CityWeatherBasicInfo {
		title: string;
		location_type: string;
		woeid: number;
		latt_long: string;
	}

	export interface ConsolidatedWeatherInfo {
		id: number;
		weather_state_name: string;
		weather_state_abbr: string;
		wind_direction_compass: string;
		created: string;
		applicable_date: string;
		min_temp: number;
		max_temp: number;
		the_temp: number;
		wind_speed: number;
		wind_direction: number;
		air_pressure: number;
		humidity: number;
		visibility: number;
		predictability: number;
	}

	export type GeoCoors = Pick<GeolocationCoordinates, 'latitude' | 'longitude'>;
}