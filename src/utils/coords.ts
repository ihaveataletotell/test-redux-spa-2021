import {DataModel} from 'src/types/dataModel';

export namespace CoordsUtils {
	export const isEqual = (coords1: Partial<GeolocationCoordinates> | null, coords2: DataModel.GeoCoors): boolean => {
		if (
			coords1?.altitude === coords2.longitude
			&& coords1?.longitude === coords2.longitude
		) return true;

		return false;
	}
}