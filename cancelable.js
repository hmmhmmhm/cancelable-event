const StackTrace = require('stack-trace')
const Priority = require('./priority.js')

const Capsule = require('capsulable/src/capsule')
const _private = Capsule('private')

const Trace = ()=>{
    let traceData = []
    try{
        let stack = StackTrace.get()
        for(let stackItem of stack){
            let traceItem = {
                text: '',
                fileName: '',
                lineNumber: null,
                columnNumber: null,
                typeName: '',
                functionName: ''
            }
            try{
                traceItem.text = stackItem.toString()
                traceItem.fileName = stackItem.getFileName()
                traceItem.lineNumber = stackItem.getLineNumber()
                traceItem.columnNumber = stackItem.getColumnNumber()
                traceItem.typeName = stackItem.getTypeName()
                traceItem.functionName = stackItem.getFunctionName()
            }catch(e){}
            traceData.push(traceItem)
        }
    }catch(e){}
    return traceData
}

class Cancelable {
    constructor(initOption = {}) {
        if(typeof initOption.async == 'undefined')
            initOption.async = false
        if(typeof initOption.override == 'undefined')
            initOption.override = true
        if(typeof initOption.trace == 'undefined')
            initOption.trace = true

        this._extendedDepth = -1
        let traces = Trace()
        for(let traceIndex in traces){
            let trace = traces[traceIndex]
            if(trace.fileName == __filename
                && trace.functionName == String('Cancelable')){

                this._extendedDepth = String(traceIndex)
                break
            }
        }

        /**
         * @description
         * Configure a Private variable
         */
        _private.set(this, 'listeners', {})
        _private.set(this, 'asyncListeners', {})
        _private.set(this, 'override', initOption.override)
        _private.set(this, 'async', initOption.async)
        _private.set(this, 'trace', initOption.trace)

        /**
         * @description
         * Configure a Private Function
         */

        // Configure a Private Emit Function
        _private.set(this, 'emit', (eventName, param, callback, option={})=>{
            let _listeners = _private.get(this, 'listeners')

            if(typeof option != 'object' || Array.isArray(option))
                option = {}

            let currentParam = param
            let traceData = {
                stopper: null,
                override: [],
                listeners: []
            }

            if(typeof eventName != 'string' || eventName.length == 0){
                if(typeof callback === 'function') callback(false, currentParam)
                return false
            }

            // ASYNCHRONUS WORKS
            let _asyncListeners = _private.get(this, 'asyncListeners')
            if (typeof _asyncListeners[eventName] !== 'undefined'){
                for (let asyncListener of _asyncListeners[eventName])
                    asyncListener(param)
            }

            // SYNCHRONUS WORK
            if (typeof _listeners[eventName] === 'undefined'){
                if(typeof callback === 'function') callback(false, currentParam)
                return true
            }

            let listeners = _listeners[eventName]
            let isCancelled = false

            let override = (modifiedParam)=>{
                if(!_private.get(this, 'override')) return
                let beforeParam = currentParam
                currentParam = modifiedParam

                if(typeof option['trace'] != 'undefined' && option['trace'] && _private.get(this, 'trace')){
                    let traceItem = Trace()
                    if(this._extendedDepth == -1 || (typeof option['deep'] != 'undefined' && option['deep'])){
                        traceData.override.push(traceItem)
                    }else{
                        let sourceIndex = String(Number(this._extendedDepth)+1)
                        if(typeof traceItem[sourceIndex] != 'undefined'){
                            traceItem[sourceIndex].isModified = beforeParam != currentParam
                            if(beforeParam != currentParam){
                                traceItem[sourceIndex].before = beforeParam
                                traceItem[sourceIndex].after = modifiedParam
                            }
                            traceData.override.push(traceItem[sourceIndex])
                        }
                    }
                }
            }

            for (let priority = 6; priority >= 0; priority--) {
                if(isCancelled) break
                if(!listeners[priority]) continue
                for (let key in listeners[priority]){
                    let response = listeners[priority][key]['callback'](currentParam, override)

                    if(_private.get(this, 'trace')){
                        if(typeof option['trace'] != 'undefined' && option['trace']){
                            if(this._extendedDepth == -1 || typeof option['deep'] != 'undefined' && option['deep']){
                                traceData.listeners.push(listeners[priority][key]['deep'])
                            }else{
                                traceData.listeners.push(listeners[priority][key]['trace'])
                            }
                        }
                    }

                    if(response === false){
                        if(_private.get(this, 'trace')){
                            if(this._extendedDepth == -1 || typeof option['deep'] != 'undefined' && option['deep']){
                                traceData.stopper = listeners[priority][key]['deep']
                            }else{
                                traceData.stopper = listeners[priority][key]['trace']
                            }
                        }
                        isCancelled = true
                        break
                    }
                }
            }

            if(typeof callback === 'function')
                callback(isCancelled, currentParam, traceData)
            return true
        })

        // Configure a Private addListener Function
        _private.set(this, 'addListener', (eventName, callback, priority = null)=>{
            if(typeof callback !== 'function') return false
            if(!_private.get(this, 'async') && priority == -1)
                priority = Priority.normal

            let queryPriority = Priority.normal
            if (priority !== null) queryPriority = String(priority)
    
            // If the priority is -1, It will be
            // add it as an asynchronous listener.
            if(queryPriority == -1){
                let _asyncListeners = _private.get(this, 'asyncListeners')
                if (!_asyncListeners[eventName])
                    _asyncListeners[eventName] = []
                _asyncListeners[eventName].push(callback)
                _private.set(this, 'asyncListeners', _asyncListeners)
            }else{
                let _listeners = _private.get(this, 'listeners')
                let listener = {
                    callback,
                    deep: Trace(),
                    trace: null
                }
    
                if(this._extendedDepth != -1){
                    let traceIndex = String(Number(this._extendedDepth)+2)
                    if(typeof listener.deep[traceIndex] != 'undefined')
                        listener.trace = listener.deep[traceIndex]
                }
    
                if (!_listeners[eventName])
                    _listeners[eventName] = {}
                if (!_listeners[eventName][queryPriority])
                    _listeners[eventName][queryPriority] = []
                _listeners[eventName][queryPriority].push(listener)
    
                _private.set(this, 'listeners', _listeners)
            }
    
            return true
        })
    }
 
    get priority (){
        return Priority
    }

    /**
     * @callback eventCallback
     * @param {object} param
     */
    /**
     * @param {string} eventName
     * @param {eventCallback} callback
     * @param {integer} priority
     */
    on(eventName, callback, priority = null){
        return _private.get(this, 'addListener')(eventName, callback, priority)
    }

    /**
     * @callback eventCallback
     * @param {object} param
     */
    /**
     * @param {string} eventName
     * @param {eventCallback} callback
     * @param {integer} priority
     */
    addListener(eventName, callback, priority = null){
        return _private.get(this, 'addListener')(eventName, callback, priority)
    }

    /**
     * @callback emitCallback
     * @param {boolean} isCancelled
     * @param {object} overridedParam
     */
    /**
     * @param {string} eventName
     * @param {object} param
     * @param {emitCallback} callback
     * @param {boolean} needTrace
     */
    emit(eventName, param, callback, option={}){
        return _private.get(this, 'emit')(eventName, param, callback, option)
    }

    eventNames(){
        let collectedNames = []
        for(let name of Object.keys(_private.get(this, 'listeners')))
            collectedNames[name] = true
        for(let name of Object.keys(_private.get(this, 'asyncListeners')))
            collectedNames[name] = true
        return Object.keys(collectedNames)
    }
}

module.exports = Cancelable