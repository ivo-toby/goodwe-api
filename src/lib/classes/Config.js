/**
 * Small utility to handle config values.
 * This class can be considered a singleton.
 * You can get either locally stored,  cli-arguments or environment values by using the get() method
 * Setting a locally stored value can be done using setItem.
 *
 * Values in this class are immutable! Once set you can not reset :)
 *
 * @author Ivo Toby
 * @copyright 2018 - Ivo Toby
 * @license MIT
 *
 */
import { argv } from 'yargs';
import dotenv from 'dotenv';

dotenv.config();
let instance = null;

class Config {
    #data = null
    #immutable = false

    constructor(immutable = false) {
        this.#immutable = immutable;
        this.#data = {};
    }

    /**
     * retrieves value from;
     * 1. local storage
     * 2. arguments
     * 3. environment variables
     * @param {string} key
     */
    get(key) {
        // Order;
        // 1. local value (set in setItem);
        // 2. value from arguments
        // 3. value from env
        if (this.#data[key]) {
            return this.#data[key];
        }
        if (argv[key]) {
            return argv[key];
        }
        if (process.env[key]) {
            return process.env[key];
        }
        return '';
    }

    /**
     * Sets item in local storage
     * @param {string} key
     * @param {*} value
     */
    set(key, value) {
        if (this.isMutable(key)) {
            this.#data[key] = value;
        }
    }

    /**
     * Returns an instance of this class, creates one if not available (singleton-pattern)
     * @param {boolean} immutable
     */
    static getInstance(immutable = false) {
        if (!instance) {
            instance = new Config(immutable);
        }
        return instance;
    }

    isMutable(key) {
        const errorMessage = `Config is set to be immutable and value ${key} was already set to a value so it cannot be set again. Sorry.`;
        if (!this.#immutable) {
            return true;
        }
        if (Object.keys(this.#data).indexOf(key) > -1) {
            // value already exists and has been set to instance store!
            throw new Error(errorMessage);
        }

        if (argv[key]!==null) {
            throw new Error(errorMessage);
        }

        if (process.env!==null) {
            throw new Error(errorMessage);
        }
        return true;
    }

}

export default Config.getInstance;
