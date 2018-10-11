import fetch from 'node-fetch';
import Config from './Config';
import GoodWeError from './GoodWeError';
import Persistent from './Persistent';
import Auth from './Auth';

async function _GoodWePost(apiURL, method, params, customHeaders) {
    let result;
    const db = new Persistent('Auth');
    let authData = db.get('authData');
    if (!authData || !authData.token) {
        authData = await Auth.login();
    }
    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        Token: JSON.stringify({
            language: 'en',
            timestamp: authData.timestamp,
            uid: authData.uid,
            client: Config().get('GOODWE_CLIENT_TYPE'),
            token: authData.token,
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
        if (result.code === 100002 || result.code === 100001) {
            // login again;
            db.set('authData', {});
            await Auth.login();
            const newResult = await _GoodWePost(apiURL, method, params, customHeaders);
            return newResult;
        }
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

async function GoodWeLogin(params) {
    let result;
    const config = new Config();
    const apiURL = `${config.get('GOODWE_LOGIN_API')}`;

    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        Token: JSON.stringify({
            language: 'en',
            timestamp: 0,
            uid: null,
            client: Config().get('GOODWE_CLIENT_TYPE'),
            token: null,
            version: Config().get('GOODWE_API_VERION'),
        }),
    };
    try {
        result = await fetch(`${apiURL}Common/CrossLogin`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers,
        });
        result = await result.json();
    } catch (e) {
        // TODO: implement nice error handler
        throw new GoodWeError(e);
    }
    return result.data;
}

async function UnAuthenticatedGoodWePost(method, params, headers) {
    const config = new Config();
    const apiURL = `${config.get('GOODWE_API_URI')}`;
    let result;

    try {
        result = _GoodWePost(apiURL, method, params, headers);
    } catch (e) {
        return new GoodWeError(e);
    }
    return result;
}

async function GoodWePost(method, params) {
    const apiURL = `${Config().get('GOODWE_API_URI')}`;
    let result;

    try {
        result = _GoodWePost(apiURL, method, params);
    } catch (e) {
        return new GoodWeError(e);
    }
    return result;
}

export {
    GoodWePost,
    GoodWeLogin,
    UnAuthenticatedGoodWePost,
};
