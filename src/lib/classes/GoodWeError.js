import chalk from 'chalk';
import GoodWeLogger from './GoodWeLogger';

class GoodWeError extends Error {
    constructor(err) {
        super(err.message);
        this.error = err;
        this.name = 'GoodWeError';
        GoodWeLogger.log(err.message, err);
        console.log(chalk.bgRed.black.bold(err.message)); // eslint-disable-line
    }
}

export default GoodWeError;
