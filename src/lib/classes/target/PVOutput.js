import fetch from 'node-fetch';
import querystring from 'querystring';
import AbstractTarget from './AbstractTarget';
import Config from '../Config';

class PVOutput extends AbstractTarget {
    constructor() {
        super();
        // define arguments which must be passed when using this target
        this.settings = [
            'PVapiKey',
            'PVSystemId',
        ];
    }

    async sync() {
        return new Promise(async (resolve, reject) => {
            const timestamp = new Date();

            const date = `${timestamp.getFullYear()}${timestamp.getMonth() + 1}${timestamp.getDate()}`;
            const time = `${timestamp.getHours()}:${timestamp.getMinutes()}`;

            const solarWatt = this.latest;
            const solarWattHour = this.total * 1000;

            const params = {
                key: Config().get('PVapiKey'),
                sid: Config().get('PVSystemId'),
                d: date,
                t: time,
                v1: solarWattHour,
                v2: solarWatt,
            };
            const uri = `http://pvoutput.org/service/r2/addstatus.jsp?${querystring.stringify(params)}`;
            let result = await fetch(uri, {
                method: 'GET',
            });
            result = await result;
            if (result.status === 200) {
                resolve(result);
            } else {
                reject(result);
            }
        });
    }
}

export default PVOutput;
