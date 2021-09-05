export namespace TextUtils {
	export const timeS60 = 1000 * 60;

	/**
	 * Возвращает дату в соответствии с указанным форматом.
	 * Поддерживаемые значения:
	 * - YYYY -- Год;
	 * - MM -- Месяц;
	 * - DD -- День;
	 * - HH -- Час;
	 * - NN -- Минуты;
	 * - SS -- Секунды;
	 * - ZZZ -- Миллисекунды.
	 *
	 * @param time Время UTC;
	 * @param format Формат записи. Например DD/MM/YYYY HH:NN:SS.ZZZ;
	 * @param timeZone Часовая зона в минутах. Если не число, то соответствует настройкам системы.
	 */
	export const formatDate = (time: number | string, format: string, timeZone: number | null = null): string =>
	{
		// если время не определено, лучше вернуть пустую строку чем 1970 год
		if (time == null || !format) return '';

		const dateNum = +new Date(time);
		const utcDate = new Date((dateNum || 0) + (timeZone || 0) * timeS60);
		const useDate = new Date(Date.UTC(
			utcDate.getFullYear(),
			utcDate.getMonth(),
			utcDate.getDate(),
			utcDate.getHours(),
			utcDate.getMinutes(),
			utcDate.getSeconds(),
			utcDate.getMilliseconds()
		));
		const split = (!timeZone && (timeZone !== 0) ? useDate : utcDate).toISOString().split(/[-T:.Z]/);
		return format
			.replace('YYYY', split[0])
			.replace('MM', split[1])
			.replace('DD', split[2])
			.replace('HH', split[3])
			.replace('NN', split[4])
			.replace('SS', split[5])
			.replace('ZZZ', split[6]);
	};

	export const getTemp = (temp: number): string | undefined => {
		if (temp == null) return;

		return `${temp.toFixed(0)}°C`;
	}

	export const getSpeed = (speedMph: number): string | undefined => {
		if (speedMph == null) return;

		return `${(speedMph / 2.237).toFixed(1)}`;
	}
}