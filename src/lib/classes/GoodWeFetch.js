import fetch from 'node-fetch';
import Config from './Config';
import GoodWeError from './GoodWeError';
import Persistent from './Persistent';

// Private
//                Token: `{'version':'${config.get('GOODWE_API_VERION')}','client':'${config.get('GOODWE_CLIENT_TYPE')}','language':'en'}`,
async function _GoodWePost(apiURL, method, params, customHeaders) {
    let result;
    const db = new Persistent('Auth');

    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        Token: JSON.stringify({
            language: 'en',
            timestamp: db.get('authData').timestamp,
            uid: db.get('authData').uid,
            client: Config().get('GOODWE_CLIENT_TYPE'),
            token: db.get('authData').token,
            version: Config().get('GOODWE_API_VERION'),
        }),
        ...customHeaders,
    };
    try {
        result = await fetch(`${apiURL}${method}`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers,
        });
        result = await result.json();
        // if (result.msg === 'No access, please login.') {
        //     // update the token!

        //     // await Auth.updateToken();
        //     // const newResult = await _GoodWePost(apiURL, method, params, headers);
        //     // return newResult;
        // }
        if (!result || (result.data === null) || result.hasError) {
            // API returned an error!
            throw new GoodWeError({
                message: result.msg,
                code: result.code,
            });
        }
    } catch (e) {
        // TODO: implement nice error handler
        return new GoodWeError(e);
    }
    return result.data;
}
// \\ Private


async function GoodWeGet(method, params) {
    const config = new Config();
    const apiURL = `${config.get('GOODWE_API_URI')}/${config.get('GOODWE_API_PREFIX')}`;

    const result = await fetch(`/${apiURL}/${method}`);
}

async function GoodWeLogin(params) {
    const config = new Config();
    const apiURL = `${config.get('GOODWE_LOGIN_API')}`;
    let result;
    try {
        result = await _GoodWePost(
            apiURL,
            'Common/CrossLogin',
            params,
        );
    } catch (e) {
        // TODO: implement nice error handler
        return new GoodWeError(e);
    }
    return result;
}

async function GoodWePost(method, params, headers) {
    const config = new Config();
    const apiURL = `${config.get('GOODWE_API_URI')}`;
    let result;

    try {
        result = _GoodWePost(apiURL, method, params, headers);
    } catch (e) {
        console.error(e);
    }
    return result;
}

async function AuthenticatedGoodWePost(method, params) {
    const apiURL = `${Config().get('GOODWE_API_URI')}`;
    let result;

    try {
        result = _GoodWePost(apiURL, method, params);
    } catch (e) {
        console.log(e);
    }
    return result;
}

module.exports = {
    GoodWeGet,
    GoodWePost,
    GoodWeLogin,
    AuthenticatedGoodWePost,
};
