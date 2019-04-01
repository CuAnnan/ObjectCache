'use strict';
const   MAX_TTL_DEFAULT = 60000,
        md5 = require('md5');

class ObjectCacheEntity
{
    constructor(entry)
    {
        this.entry = entry;
        this.updateLastAccessed();
    }

    updateLastAccessed()
    {
        this.lastAccessed = Date.now();
    }

    get age()
    {
        return Date.now() - this.lastAccessed;
    }
}

/**
 * A simple object cache
 */
class ObjectCache
{
    constructor(maxTTL)
    {
        this.maxTTL = maxTTL && !isNaN(maxTTL)?parseInt(maxTTL):MAX_TTL_DEFAULT;
        this.cache = {};
        this.timeout = setTimeout(()=>{this.checkCache();}, this.maxTTL);
        this.size = 0;
    }

    /**
     * Adds an item to the cache and sets the time it was last accessed at to now
     * @param key The key by which to store the object, or an object you want to store. A hash will be created of the object, by its properties.
     * @param object The object to store
     * @return The key by which the item was stored in the cache
     */
    put(key, object)
    {
        if(key === undefined || object === undefined)
        {
            throw new Error('Invalid number of arguments');
        }

        if(this.cache[key])
        {
            this.cache[key].updateLastAccessed();
            return key;
        }

        this.cache[key] = new ObjectCacheEntity(object);
        this.size++;

        return key;
    }

    add(object)
    {
        let key = md5(JSON.stringify(object));
        return this.put(key, object);
    }

    /**
     * Gets an item from the cache by its key and updates the time it was last accessed at
     * @param key
     * @returns The object in the cache for the key. Or null if no entry found.
     */
    get(key)
    {
        if(this.cache[key] !== null)
        {
            this.cache[key].updateLastAccessed();
            return this.cache[key].entry;
        }
        return null;
    }

    /**
     * Remove an item from the cache by its key and return it
     * @param key
     */
    remove(key)
    {
        let object = this.cache[key].entry;
        if(this.cache[key])
        {
            this.size --;
            delete this.cache[key];
        }
        return object;
    }

    clear()
    {
        this.cache = {};
        this.size = 0;
        return this;
    }

    destroy()
    {
        this.clear();
        clearTimeout(this.timeout);
    }

    empty()
    {
        this.clear();
        return this;
    }

    /**
     * Check the cache. This is done every this.maxTTL milliseconds via a timeout
     */
    checkCache()
    {
        clearTimeout(this.timeout);
        let removedItems = 0;

        for (let i in this.cache)
        {
            if (this.cache[i].age > this.maxTTL)
            {
                removedItems++;
                delete this.cache[i];
            }
        }
        this.size -= removedItems;
        this.timeout = setTimeout(() => {this.checkCache();}, this.maxTTL);
    }

}

module.exports = ObjectCache;