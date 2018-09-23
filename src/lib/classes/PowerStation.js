import { AuthenticatedGoodWePost } from './GoodWeFetch';

class PowerStation {
    static async getPowerStations() {
        const results = await AuthenticatedGoodWePost('PowerStationMonitor/QueryPowerStationMonitorForApp', {});
        return results;
    }

    static async getPowerstationPac(stationId, dateObj) {
        const params = {
            id: stationId,
            date: dateObj.toISOString().substr(0, 10),
        };
        const results = await AuthenticatedGoodWePost('PowerStationMonitor/GetPowerStationPacByDayForApp', params);
        return results;
    }

    static async printPowerstationList() {
        const stationsList = await PowerStation.getPowerStations();
        console.log('Found the following powerstations (name, location, powerstation-id):');
        stationsList.forEach((station) => {
            console.log(station.stationname, station.location, station.powerstation_id);
        });
    }

    static async printLastOutput(stationId) {
        const today = new Date();
        const output = await PowerStation.getPowerstationPac(stationId, today);
        console.log(output);
    }

}
module.exports = PowerStation;
