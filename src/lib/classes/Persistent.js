import path from 'path';
import Config from './Config';

const flatCache = require('flat-cache');

class Persistent {
    #cache = '';
    #cacheId = '';
    // loads the cache, if one does not exists for the given
    // Id a new one will be prepared to be created
    constructor(cacheId) {
        const config = new Config();
        this.cacheId = cacheId;
        this.cache = flatCache.load(cacheId, path.resolve(config.get('CACHE_FOLDER')));
    }

    // sets a key on the cache
    set(key, value) {
        this.cache.setKey(key, value);
        this.cache.save();
    }

    get(key) {
        return this.cache.getKey(key);
    }

    all() {
        return this.cache.all();
    }

    delete(key) {
        this.cache.removeKey(key); // removes a key from the cache
    }

    deleteAll() {
        // removes the cacheId document if one exists.
        flatCache.clearCacheById(this.cacheId);
    }
}

module.exports = Persistent;
