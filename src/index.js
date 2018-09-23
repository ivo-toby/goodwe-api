import Config from './lib/classes/Config';
import Auth from './lib/classes/Auth';
import PowerStation from './lib/classes/PowerStation';
import GoodWeError from './lib/classes/GoodWeError';

// setup config and CLI param handler
Config(false);

// login and keep state
Auth.login();

// handle cli requests
if (Config().get('list-powerstations')) {
    PowerStation.printPowerstationList();
}

if (Config().get('get-last-output')) {
    const stationId = Config().get('station-id');
    if (!stationId) {
        throw new GoodWeError({message:'no station id'});
    }
    PowerStation.printLastOutput(stationId);
}

