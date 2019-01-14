<img src="https://image.flaticon.com/icons/svg/1161/1161388.svg" alt="icon" width="150"/>

# **Cancelable-event**

> Cancelable, 
>
> Prioritized,
>
> Changeable-value Event



The Cancelable module is an event propagation-processing module, inspired by the **EventEmitter** in ``'Node.JS''' and **Bukit Plugin**" in ``"Minecraft"" . Licenses are MIT and freely available, and Compatible with your browser via **Webpack**.



[한국어 문서는 여기로 와주세요](https://github.com/hmmhmmhm/cancelable-event/blob/master/README.KOR.md)



## How to install

```
npm install cancelable-event --save
```



## Advantage

### **Cancelable Events**

Event recipients can decide whether to cancel an event, and the event recipient may or may not run a specific code depending on whether the event is canceled. This allows you to **post-evaluation** and then run a particular event to **see if it is appropriate to run**.

### **Events with priority**

Events are forwarded to the recipient according to **priority**, and the recipient receives the event value first based on priority, and **Change the value that will ultimately be delivered to the sender**. This allows **The resulting value of all events considered** to be created without considering all event conditions at the moment.

### **Traceable Events**

Both the process of **modifying the event values** and the **recipient information that determined the event to be aborted** are recorded and communicated to the event sender. This allows you to see the event sender function backtrace of the **recipient who modified the value unexpectedly** and the **recipient backtrace that interrupted the event differently**. **This makes events debugging very easy**, considering the fluid situation.



## Explanation

When you create a class or variable with Cancelable, an **event dispatcher** is generated, which **allows you to send and receive events**. It's divided between the **caller** and the **listener**.

### **Caller**

Caller can create event names in a string and then forward the event to the Listeners by putting a <u>**value of the desired type**</u> as a parameter. **Caller receives the final event propagation result value** after the value is propagated sequentially to all recipients, It will be contains **whether want the event to stop**, or **whether the event value wants to be changed to a specific value**, and **the history of the listener changing the value** and **which listener has stopped the event**.

### **Listener**

Listener means a function to receive forwarding when an event occurs. If you want to receive an event when it occurs, you can **register the function to receive the event** as a callback listener.

### **Dispatcher**

**Dispatcher** receives events from the **sender**. It then propagates the event **in a priority order** to the Listeners who wish to receive it. Dispatcher records **how a listener changed the value of an event, both before and after** an event value change by the listener, and **if the event was interrupted by the listener**. Events that have all propagated to the listener are finally passed back to the sender.

### **Priority**

The priority is divided into **seven steps**, from 0 to 6, and the higher the number, the higher the priority. High priority allows you to receive and process event values first. There are seven steps from the **lowest priority 0** to the **highest priority 6**. Priority can be expressed in numbers immediately, and use by priority name is also possible. The default priority applied is ```normal = 3```.

```javascript
var Priority = {
    under: 0,
    lowest: 1,
    low: 2,
    normal: 3,
    high: 4,
    highest: 5,
    monitor: 6
}
```



## **Code Example**

Coding examples include creating a ```dispatcher``` and ```send event``` and ```receiving an event```.



### **Dispatcher Create Example**

Dispatcher can be created by inheriting variables or classes.

#### **Creating Dispatcher with Variables**

```javascript
// ES6
import Cancelable from 'cancelable-event'
let myDispatcher = new Cancelable()

// ES3
var Cancelable = require('cancelable-event')
var myDispatcher = new Cancelable()
```

#### **Creating Dispatcher with Class**

```javascript
// ES6
class Dispatcher extends Cancelable{
    constructor(){
        super() // It is absolutely necessary.
    }
}
let myDispatcher = new Cancelable()
```



### **Event transmission code**

Events can be sent to anyone who has access to Dispatcher.

#### **Simple way to propagate an event**

The first parameter must be in the form of a ``string'' and the second parameter is you can be free to choose the type of which you want.

```javascript
dispatcher.emit(`EVENT_NAME`, `EVENT_VALUE`)
```

#### **Basic method of event propagation**

```javascript
dispatcher.emit(`SMS_RECEIVED`, `it's sms message text!`, 
    (isCanceled, overridedParam, traceData)=>{
        // Get event result values here.
    }
)
```

- ```isCanceled``` Indicates whether the event was interrupted. Has a value of the ```boolean``` type.
- ```overridedParam``` Indicates the last changed event value.
- ```traceData``` Contains the history of the event value changes and the value of the break history.



### **Event receiving code**

Events can be received by anyone as long as they have access to Dispatcher.

#### **Simple way to receive events**

```javascript
dispatcher.on(`EVENT_NAME`, (eventValue)=>{
    // Get event result values here.
})
```

#### **Basic way to receive events**

You can prioritize through the third factor of dispatcher.on. ``dispatcher.priority'' or ```0-5``` numbers can be used as factors, and If you didn't yet prioritize, the ```normal``` will be applied to the priority.

```javascript
dispatcher.on(`EVENT_NAME`, (value, override)=>{
    // You can change the event value
    // by invoking the second parameter
    // and entering the value you want to change.
    override(`I_WANT_TO_CHANGE_VALUE_TO_THIS`)
    
    // If you return false,
    // the event is aborted.
    return false

    // Prioritize here.
}, dispatcher.priority.high)
```



### **Advanced usage**

The Cancelable includes a number of available functions.



#### **How to check the sender's event tracking result**

If the event is interrupted, the propagation of the event is stopped immediately and all event traces are conducted through the 'stack-trace' module.

```javascript
dispatcher.emit(`EVENT_NAME`, `EVENT_VALUE`, 
    (isCanceled, overridedParam, traceData)=>{
        // traceData structure
        traceData.stopper   // [1]
        traceData.listeners // [2]
        traceData.override  // [3]

        // [1] Contains the tracking information 
        //     for the function that stopped the event.
        // [2] Contains the tracking information
        //     of the functions that received the event.
        // [3] Contains the tracking information
        //     and changes for the functions
        //     that changed the event values.

        // traceData Subcomponent return value structure
        traceData.override   // Override
        traceData.stopper    // TraceItem || null
        traceData.listeners  // TraceItem

        // Override structure
        // (Override has all the subcomponents of Trace.)
        traceData.override[].isModified // [1]
        traceData.override[].before     // [2]
        traceData.override[].after      // [3]

        // [1] Indicates whether the value has changed in that order.
        // [2] The value will be included before the change.
        // [3] The value after the change is included.

        // TraceItem Subcomponent structure
        traceData.override[].functionName  // [1]
        traceData.override[].lineNumber    // [2]
        traceData.override[].columnNumber  // [3]
        traceData.override[].fileName      // [4]
        traceData.override[].typeName      // [5]
        traceData.override[].text          // [6]

        // [1] Contains the function names identified.
        // [2] Contains the code line numbers identified.
        // [3] Contains the code column numbers identified.
        // [4] Contains the detected file address.
        // [5] Contains the identified object type name.
        // [6] It contains the corresponding source code.
    }
)
```



#### **How to check the deep event tracking result of the sender**

You can include options in object form in the third parameter of ```dispatcher.emit``` . ```Trace``` and ```deep``` are available as options.

- You can select whether to collect `trace` record change and breaker information. The default option is `true` and tracking information is not collected when applying `false`. If you turn off this option, you will naturally not be able to activate the `deep` option.
- You can adjust the depth of `deep` trace information collection. When set to `false`, the source code of the problem or the action is automatically specified. When set to `true`, it returns up to 10 full traces of the problem code execution process. **If the deep option is enabled, existing trace objects are returned as an array**.


```javascript
dispatcher.emit(`EVENT_NAME`, `EVENT_VALUE`, 
    (isCanceled, overridedParam, traceData)=>{
         for(let overrideIndex in traceData.override){

             // When the deep option is turned on,
             /// it acquires a TraceList other than TraceItem.
             let traceList = traceData.override[overrideIndex]

             for(let traceListIndex in traceList){
                 // Use a repeat to access TraceItem.
                 traceData.override[overrideIndex][traceListIndex]
             }
         }
	}

    // Third parameter defines
    // options for sending events.
, { trace: true, deep: true})
```



#### **How to receive events asynchronously**

> WARNING: Asynchronous reception is only available when `non-synchronous receiver is used` is allowed when dispatcher is created. `Non-Sync Receiver` is not available in a typical dispatcher, and the method for enabling the use of 'Non-Sync Receiver' is described in the following topics.

You can use this method only if the **receiver does not change the event value**, **does not stop the event**, and **does not need to know if the event is subsequently canceled**. If added as an asynchronous receiver, the value is immediately received asynchronously rather than as a sequence of event values, depending on the priority. When you receive events synchronously, you can take advantage of them for tasks that are expected to experience performance degradation.

```javascript
dispatcher.on(`EVENT_NAME`, (eventValue)=>{

    // You can register as an 
    // asynchronous receiver by setting 
    // dispatcher.priority.async
    // or -1 as a priority.
}, dispatcher.priority.async)
```



#### **How to Set Features to Use when Dispatcher is created**

When creating a Dispatcher, you can set options for `using a non-synchronous receiver`, `value override`, and `Restricting Information Collection`.

#### **Creating a Custom Dispatcher through a Variable**

```javascript
// ES6
import Cancelable from 'Cancelable'
let myDispatcher = new Cancelable({
    async: true,   // Default: false
    trace: true,   // Default: true
    override: true // Default: true
})
```

#### **Creating a Custom Dispatcher through a Class**

```javascript
// ES6
class Dispatcher extends Cancelable{
    constructor(){
        super({
            async: true,   // Default: false
            trace: true,   // Default: true
            override: true // Default: true
        })
    }
}
let myDispatcher = new Cancelable()
```



## Development goal

The Cancelable module aims to be compatible with Node.JS EventEmitter.

- [x] Implement cancelable events
- [x] Implementing event value changes based on priority
- [x] Implement event value variation and reverse tracking of canceler information
- [x] Implement object insecurities through Capable Modules
- [x] Implement asynchronous event function
- [x] Complete basic test unit
- [ ] Implement object tracking before and after the event value
- [ ] Completely support the EventEmitter function
- [ ] Add Test Unit
- [ ] Add Browser Test Unit
- [ ] Add Code Coverage Test Unit
- [ ] Re-execute async event function after pre-execution after completion of event


## Logo Icon Source

<div>Icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" 			    title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 			    title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>



## LICENSE

MIT License.