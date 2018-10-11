import chalk from 'chalk';
import log2file from 'log-to-file';
import Config from './Config';

class GoodWeLogger {
    static log(...args) {
        // for now log to console
        if (Config().get('log-to-file')) {
            log2file(chalk.reset(...args), Config().get('log-to-file'));
        } else {
            console.log(...args); // eslint-disable-line
        }

    }
}

export default GoodWeLogger;
