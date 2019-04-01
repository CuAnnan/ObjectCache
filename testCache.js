let assert = require('assert');



class SampleClass
{
    constructor(var1, var2)
    {
        this.var1 = var1;
        this.var2 = var2;
    }

    toJSON()
    {
        return {
            'var1':this.var1,
            'var2':this.var2
        };
    }
}

const Cache = require('./ObjectCache');
let cache = new Cache(1000),
    sampleData = new SampleClass("test", "more Test"),
    key1 = cache.add(sampleData),
    key2 = cache.add(sampleData),
    key3 = cache.add(sampleData),
    sampleData2 = cache.get(key1);
setTimeout(
    ()=>{
        let sampleData3 = new SampleClass('test', 'even More Test'),
            key4 = cache.add(sampleData3);
    },
    500);

console.log(cache.get('This should fail'));