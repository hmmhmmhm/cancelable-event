var isErrorExist = false

process.on('uncaughtException', (error)=>{
    console.log('Error detected')
    isErrorExist = true
    throw error
})

process.on('exit', ()=>{
    if(!isErrorExist) console.log('All Passed!')
})

// Test the class's extended depth identification code.
require('./extenddepth/test.js')()

// Test the operation of the event-stop and override functions.
require('./emitter/test.js')()