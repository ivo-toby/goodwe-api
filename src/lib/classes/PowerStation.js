import Config from './Config';
import { AuthenticatedGoodWePost } from './GoodWeFetch';

class PowerStation {
    static async getPowerStations() {
        const results = await AuthenticatedGoodWePost('PowerStationMonitor/QueryPowerStationMonitorForApp', {});
        return results;
    }

    static async getPowerstationPac(stationId, dateObj) {
        if (Config().get('dry-run')) {
            const output = await import('../../../test/mock.json');
            return output;
        }

        const params = {
            id: stationId,
            date: dateObj.toISOString(),
        };
        const results = await AuthenticatedGoodWePost('PowerStationMonitor/GetPowerStationPacByDayForApp', params);
        return results;
    }
}

export default PowerStation;
