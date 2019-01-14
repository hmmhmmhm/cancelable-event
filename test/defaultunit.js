module.exports = (emitter, showMessage = false, callback)=>{
    emitter.on('notify', (param)=>{
        if(showMessage)
            console.log(`LOWEST PRIORITY: ${param}`)
    }, emitter.priority.lowest)

    emitter.on('notify', (param)=>{
        if(showMessage)
            console.log(`LOW PRIORITY: ${param}`)
        return false // Cancels an event.
    }, emitter.priority.low)

    emitter.on('notify', (param)=>{
        if(showMessage)
            console.log(`NORMAL PRIORITY: ${param}`)
    }, emitter.priority.normal)

    emitter.on('notify', (param, override)=>{
        if(showMessage)
            console.log(`HIGH PRIORITY: ${param}`)
        override(`${param} world`) // Override the event value.
    }, emitter.priority.high)

    emitter.emit('notify', 'hello?', (isCanceled, overridedParam, traceData)=>{
        if(showMessage){
            console.log(`EVENT HAS ${(isCanceled)?'CANCELED':'PASSED'}`)
            console.log(`OVERRIDED PARAM: ${overridedParam}`)
            console.log(`TRACE DATA:`)
            console.log(traceData)
        }
    }, { trace: true, deep: false})
    return __filename
}