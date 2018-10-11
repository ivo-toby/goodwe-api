import Config from './Config';
import Persistent from './Persistent';
import GoodWeLogger from './GoodWeLogger';
import { GoodWeLogin, GoodWePost } from './GoodWeFetch';

class Auth {
    static async login() {
        let results = {};
        const db = new Persistent('Auth');
        const authData = db.get('authData') || {};

        if (authData.token) {
            GoodWeLogger.log(`Retreived token ${authData.token} from persistent storage`);
        } else {
            // login to API and get a Token
            try {
                results = await GoodWeLogin({
                    account: Config().get('GOODWE_USERNAME'),
                    pwd: Config().get('GOODWE_PASSWORD'),
                    is_local: true,
                });
            } catch (e) {
                GoodWeLogger.log(e);
                return false;
            }
            db.set('authData', results);
            GoodWeLogger.log(`Logged in with Token ${results.token}`);
        }
        return results;
    }

    static async logout() {
        const db = new Persistent('Auth');

        if (!db.get('authData').token) {
            GoodWeLogger.log('No token available, I\'m not logged in!');
        } else {
            // login to API and get a Token
            await GoodWePost('Auth/RemoveToken', {});
            // db.set('authData', null);
            GoodWeLogger.log('Logged out');
        }
    }

    static get token() {
        const db = new Persistent('Auth');
        return db.get('authData').token;
    }

    static get uid() {
        const db = new Persistent('Auth');
        return db.get('authData').uid;
    }

    static get timestamp() {
        const db = new Persistent('Auth');
        return db.get('authData').timestamp;
    }
}

export default Auth;
