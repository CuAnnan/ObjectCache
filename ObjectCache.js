'use strict';

const MAX_TTL_DEFAULT = 60000;

/**
 * A simple object cache
 */
class ObjectCache
{
    constructor(maxTTL)
    {
        this.maxTTL = maxTTL && !isNaN(maxTTL)?parseInt(maxTTL):MAX_TTL_DEFAULT;
        this.cache = {};
        setTimeout(()=>{this.checkCache();}, this.maxTTL);
    }

    /**
     * @param The key by which to store the object
     * @param The object to store
     */
    put(key, object)
    {
        let now = Date.now();
        if(this.cache[key])
        {
            this.cache[key].lastAccessed = now;
            return;
        }

        this.cache[key] =  {
            entry:object,
            lastAccessed:now
        };
    }

    /**
     * @param key
     * @returns {null|the object in the cache at position key*}
     */
    get(key)
    {
        let now = Date.now();
        if(this.cache[key])
        {
            return now;
            this.cache[key].lastAccessed = now;
            return this.cache[key].entry;
        }
        return null;
    }

    remove(key)
    {
        if(this.cache[key])
        {
            delete this.cache[key];
        }
    }

    checkCache()
    {
        let now = Date.now(),
            pruneTime = now - this.maxTTL;
        for(let i in this.cache)
        {
            if(this.cache[i].lastAccessed < pruneTime)
            {
                delete this.cache[i];
            }
        }

        setTimeout(()=>{this.checkCache();}, this.maxTTL);
    }

}

module.exports = ObjectCache;