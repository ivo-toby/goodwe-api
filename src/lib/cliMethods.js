import chalk from 'chalk';
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
    const loaded = await factory.loadTargets(outputModules);

    if (loaded) {
        const powerOutput = await PowerStation.getPowerstationPac(stationId, new Date());
        factory.powerData = powerOutput;
        try {
            await factory.syncTargets();
            return true;
        } catch (e) {
            throw new GoodWeError(e);
        }
    } else {
        return false;
    }
}

async function printPowerstationList() {
    let stationsList = [];
    try {
        stationsList = await PowerStation.getPowerStations();
    } catch (e) {
        throw new GoodWeError(e);
    }
    GoodWeLogger.log(chalk.red.bold('Found the following powerstations (name, location, powerstation-id):'));
    stationsList.forEach((station) => {
        GoodWeLogger.log(chalk.green.bold(station.stationname, station.location, station.powerstation_id));
    });
}

async function printLastOutput(stationId) {
    let output = {};
    if (!stationId) {
        throw new GoodWeError({ message: 'no station id' });
    }
    const today = new Date();
    try {
        output = await PowerStation.getPowerstationPac(stationId, today);
    } catch (e) {
        throw new GoodWeError(e);
    }

    GoodWeLogger.log(`Reported at : ${output.pacs[output.pacs.length - 2].date}`);
    GoodWeLogger.log(`Total today : ${chalk.green.bold(output.today_power)} kwh`);
    GoodWeLogger.log(`Last reported : ${chalk.green.bold(output.pacs[output.pacs.length - 2].pac)} watt`);
}

export {
    printPowerstationList,
    syncTargets,
    printLastOutput,
};
