export namespace TextUtils {
	export const getDate = (date: string | number): string | undefined => {
		if (date == null) return;
		const dateObj = new Date(date);

		return `${`${dateObj.getDate()}`.padStart(2, '0')}.${`${dateObj.getMonth() + 1}`.padStart(2, '0')}`;
	}

	export const getTemp = (temp: number): string | undefined => {
		if (temp == null) return;

		return `${temp.toFixed(0)}°C`;
	}

	export const getSpeed = (speedMph: number): string | undefined => {
		if (speedMph == null) return;

		return `${(speedMph / 2.237).toFixed(1)}`;
	}
}