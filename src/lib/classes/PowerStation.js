import Config from './Config';
import { GoodWePost } from './GoodWeFetch';

class PowerStation {
    static async getPowerStations() {
        const results = await GoodWePost('PowerStationMonitor/QueryPowerStationMonitorForApp', {});
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
        const results = await GoodWePost('PowerStationMonitor/GetPowerStationPacByDayForApp', params);
        return results;
    }
}

export default PowerStation;
