import Config from './Config';
import Persistent from './Persistent';
import GoodWeLogger from './GoodWeLogger';
import { GoodWeLogin, GoodWePost } from './GoodWeFetch';

class Auth {
    static async login() {
        const db = new Persistent('Auth');

        if (db.get('authData').token) {
            GoodWeLogger.log(`Retreived token ${db.get('authData').token} from persistent storage`);
        } else {
            // login to API and get a Token
            const results = await GoodWeLogin({
                account: Config().get('GOODWE_USERNAME'),
                pwd: Config().get('GOODWE_PASSWORD'),
                is_local: true,
            });
            db.set('authData', results);
            GoodWeLogger.log(`Logged in with Token ${results.token}`);
        }
    }

    static async updateToken() {
        const db = new Persistent('Auth');
        const currentAuth = db.get('authData');

        const results = await GoodWePost(
            'Auth/UpdateToken',
            {
                language: 'en',
                timestamp: currentAuth.timestamp,
                uid: currentAuth.uid,
                client: Config().get('GOODWE_CLIENT_TYPE'),
                token: currentAuth.token,
                version: Config().get('GOODWE_API_VERION'),
            },
        );
        db.set('authData', results);
        return results;
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

module.exports = Auth;
