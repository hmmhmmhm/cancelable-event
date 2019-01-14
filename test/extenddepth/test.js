const assert = require('assert')

module.exports = (callback)=>{
    const Cancelable = require('../../')
    const OtherFiles1 = require('./a.js')
    const OtherFiles2 = require('./b.js')
    const OtherFiles3 = require('./c.js')
    const defaultUnit = require('../defaultunit.js')

    class Emitter extends Cancelable{
        constructor(){
            super()
        }
    }

    class InnerOtherClass extends Emitter{
        constructor(){
            super()
        }
    }

    let depthChecker = (emitter)=>{
        let defaultUnitPath = defaultUnit(emitter)
        emitter.emit('notify', 'hello?', (isCanceled, overridedParam, traceData)=>{
            assert(traceData.override[0].fileName == defaultUnitPath)
            assert(traceData.override[0].lineNumber == 21)
            assert(traceData.listeners[0].fileName == defaultUnitPath)
            assert(traceData.listeners[0].lineNumber == 18)
        }, { trace: true, deep: false})
    }

    depthChecker(new Cancelable()) // Direct
    depthChecker(new Emitter()) // Normal Extneded  
    depthChecker(new InnerOtherClass())
    depthChecker(new OtherFiles1())
    depthChecker(new OtherFiles2())
    depthChecker(new OtherFiles3())

    let asd = new Emitter()
}