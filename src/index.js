import Config from './lib/classes/Config';
import Auth from './lib/classes/Auth';
import GoodWeError from './lib/classes/GoodWeError';
import {
    syncTargets,
    printPowerstationList,
    printLastOutput,
} from './lib/cliMethods';

// setup config and CLI param handler
Config(false);

// login and keep state
Auth.login();

// handle cli requests
if (Config().get('list-powerstations')) {
    printPowerstationList();
}

if (Config().get('get-last-output')) {
    const stationId = Config().get('station-id');
    printLastOutput(stationId);
}

if (Config().get('sync')) {
    syncTargets().then((result) => {
        console.log('Syncing succeeded', result);
    }).catch((e) => {
        throw new GoodWeError(e);
    });
}

if (Config().get('logout')) {
    Auth.logout();
}

if (Config().get('keepalive')) {
    setTimeout(() => {
        // needed to keep the debugger running
    }, 1e6);
}
