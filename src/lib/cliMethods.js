import Config from './classes/Config';
import TargetFactory from './classes/TargetFactory';
import PowerStation from './classes/PowerStation';
import GoodWeError from './classes/GoodWeError';
import GoodWeLogger from './classes/GoodWeLogger';

async function syncTargets() {
    const stationId = Config().get('station-id');
    if (!stationId) {
        throw new GoodWeError({ message: 'no station id' });
    }

    const factory = new TargetFactory();
    const outputModules = Config().get('sync').toString().split(',');
    await factory.loadTargets(outputModules);

    const powerOutput = await PowerStation.getPowerstationPac(stationId, new Date());
    factory.powerData = powerOutput;
    try {
        const results = await factory.syncTargets();
        return results;
    } catch (e) {
        throw new GoodWeError(e);
    }
}

async function printPowerstationList() {
    const stationsList = await PowerStation.getPowerStations();
    GoodWeLogger.log('Found the following powerstations (name, location, powerstation-id):');
    stationsList.forEach((station) => {
        GoodWeLogger.log(station.stationname, station.location, station.powerstation_id);
    });
}

async function printLastOutput(stationId) {
    if (!stationId) {
        throw new GoodWeError({ message: 'no station id' });
    }
    const today = new Date();
    const output = await PowerStation.getPowerstationPac(stationId, today);
    const formattedOutput = {
        total: output.today_power,
        // last item always has pac:0.. second last has actual value
        lastOutput: output.pacs[output.pacs.length - 2].pac,
        dateLastOutput: output.pacs[output.pacs.length - 2].date,
    };
    GoodWeLogger.log(formattedOutput);
}

export {
    printPowerstationList,
    syncTargets,
    printLastOutput,
};
