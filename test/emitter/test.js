const assert = require('assert')

module.exports = (callback)=>{
    const Cancelable = require('../../')
    const defaultUnit = require('../defaultunit.js')

    let depthChecker = (emitter)=>{
        let defaultUnitPath = defaultUnit(emitter)
        emitter.emit('notify', 'hello?', (isCanceled, overridedParam, traceData)=>{
            assert(isCanceled)
            assert(overridedParam === 'hello? world')
        }, { trace: true, deep: false})
    }

    depthChecker(new Cancelable())
}