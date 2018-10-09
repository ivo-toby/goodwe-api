import { AuthenticatedGoodWePost } from './GoodWeFetch';

class PowerStation {
    static async getPowerStations() {
        const results = await AuthenticatedGoodWePost('PowerStationMonitor/QueryPowerStationMonitorForApp', {});
        return results;
    }

    static async getPowerstationPac(stationId, dateObj) {
        const params = {
            id: stationId,
            date: dateObj.toISOString(),
        };
        const results = await AuthenticatedGoodWePost('PowerStationMonitor/GetPowerStationPacByDayForApp', params);
        return results;
    }
}

export default PowerStation;
