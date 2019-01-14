<img src="https://image.flaticon.com/icons/svg/1161/1161388.svg" alt="icon" width="150"/>

# **Cancelable-event**

[![Build Status](https://travis-ci.org/hmmhmmhm/cancelable-event.svg?branch=master)](https://travis-ci.org/hmmhmmhm/cancelable-event)

> 취소 가능한, 
>
> 우선순위가 있는,
>
> 값을 바꿀 수 있는 이벤트

캔슬러블은 Event 전파&처리 모듈로, ```Node.JS``` 의 **EventEmitter** 와 ```Minecraft``` 의 **Bukkit Plugin** 이벤트 체계에 영감을 받아 개발된 Node.JS 모듈입니다. **MIT 라이센스**로 자유롭게 이용할 수 있으며, **Webpack**을 통해 브라우저에서 호환될 수 있습니다.



## 설치방법

```
npm install cancelable-event --save
```



## 장점

### **취소 가능한 이벤트**

이벤트 수신자는 이벤트의 취소여부를 결정할 수 있으며, 이벤트 수신자는 해당 이벤트의 취소여부에 따라 특정 코드를 실행하거나 실행하지 않을 수 있습니다. 이를 통해서 **특정 이벤트의 실행이 적합한지**를 **유동적으로 평가**후 실행할 수 있게됩니다.

### **우선순위가 있는 이벤트**

이벤트는 **우선순위**에 따라 수신자에게 전달되며, 수신자는 우선순위에 따라 이벤트 값을 먼저 받아서 **최종적으로 송신자에게 전달될 값을 변경**할 수 있습니다. 이를 통해서 **모든 상황이 고려된 이벤트의 결과 값**을 **당장 모든 이벤트 상황을 고려하지 않고도** 만들 수 있게됩니다.

### **추적가능한 이벤트**

이벤트는 **이벤트 값의 수정과정**과 **이벤트 중단을 결정한 수신자** 정보가 모두 기록되어 이벤트 송신자에게 전달됩니다. 이를 통해서 **값을 예상과 달리 수정한 수신자의 역추적** 및 **이벤트를 예상과 다르게 중단한 수신자 역추적**을 이벤트 송신자 함수에서 할 수 있습니다. 즉 유동적인 상황을 고려한 **이벤트의 디버깅이 매우 편리해집니다**.



## 설명

캔슬러블로 Class 또는 변수를 생성하면 **이벤트 전파자** 가 생성되는데, 해당 **전파자**를 통해서 **이벤트를 송신하고 수신할 수 있게 됩니다.** 여기엔 **송신자**와 **수신자**가 나뉘어집니다.

### **송신자 (Caller)**

송신자는 이벤트명을 문자열로 작성한 후, 그 이벤트에 <u>**원하는 타입의 값**</u>을 하나 인자로 달아서 수신자들에게 이벤트를 전파할 수 있습니다. 송신자는 모든 수신자들에게 값이 차례대로 전파된 후 **최종적인 이벤트 전파 결과 값**을 받게되는데, 여기엔 **해당 이벤트가 중단되길 원하는지**, 아니면 **이벤트 값이 특정한 값으로 바뀌길 원하는지**와 **수신자가 값을 바꾼 이력**과 **어느 수신자가 이벤트를 중단시켰는지** 기록한 내용이 담깁니다.

### **수신자 (Listener)**

수신자는 이벤트 발생시 이를 전달 받을 함수를 뜻하며, 어떠한 이벤트가 발생했을때 이를 수신받고자 한다면 **이벤트를 전달 받을 함수를(콜백) 수신자로 등록**할 수 있습니다.

### **전파자 (Dispatcher)**

**전파자**는 **송신자**로부터 이벤트를 대신 전달받습니다. 그후 해당 이벤트를 수신받길 희망하는 수신자들에게 해당 이벤트를 **우선순위대로 전파**합니다. 전파자는 어느 수신자가 이벤트 값을 어떻게 바꾸었는지 **수신자에 의한 이벤트 값의 변경 전 후를 모두 기록**하며, **어느 수신자에 의해서 이벤트가 중단되었는지를 기록**합니다. 이렇게 수신자에게 모두 전파가 끝난 이벤트는 최종적으로 송신자에게 다시 전달됩니다.

### **우선순위 (Priority)**

우선순위는 **총 7단계**로 0부터 6까지 숫자로 나뉘어지며 숫자가 높을수록 우선순위가 높습니다.  우선순위가 높으면 먼저 이벤트 값을 전달받아 처리할 수 있게됩니다. **가장 우선순위가 낮은 0** 부터 **가장 우선순위가 높은 6**까지 7단계가 존재합니다. 우선순위는 숫자로 바로 표현이 가능하며, 우선순위의 이름을 통한 사용 또한 가능합니다. 기본적으로 적용되는 우선순위는 ```normal = 3``` 입니다.

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



## **코드 예시**

코드예시에는 ```Dispatcher``` 생성과, ```이벤트 송신```, ```이벤트 수신``` 등의 예시가 담깁니다.



### **전파자 생성 코드**

전파자는 변수 또는 클래스 상속을 통해서 생성할 수 있습니다.

#### **변수를 통한 Dispatcher 생성**

```javascript
// ES6
import Cancelable from 'cancelable-event'
let myDispatcher = new Cancelable()

// ES3
var Cancelable = require('cancelable-event')
var myDispatcher = new Cancelable()
```

#### **클래스를 통한 Dispatcher 생성**

```javascript
// ES6
class Dispatcher extends Cancelable{
    constructor(){
        super() // 반드시 필요합니다.
    }
}
let myDispatcher = new Cancelable()
```



### **이벤트 송신 코드**

이벤트는 전파자에 접근할 수만 있으면 누구나 이벤트를 송신할 수 있습니다.

#### **단순한 이벤트 전파방법**

첫번째 인자는 반드시 ```string``` 형태여야하며, 두번째 인자는 형태를 자유롭게 선택가능합니다.

```javascript
dispatcher.emit(`EVENT_NAME`, `EVENT_VALUE`)
```

#### **기본적 이벤트 전파방법**

```javascript
dispatcher.emit(`SMS_RECEIVED`, `it's sms message text!`, 
    (isCanceled, overridedParam, traceData)=>{
        // 여기에서 이벤트 결과 값을 받습니다.
    }
)
```

- ```isCanceled``` 이벤트가 중단되었는지를 뜻합니다. ```boolean``` 형의 값을 가집니다.
- ```overridedParam``` 최종적으로 변경된 이벤트 값을 뜻합니다.
- ```traceData``` 이벤트 값이 변경된 내역과, 중단 내역을 추적한 값이 담깁니다.



### **이벤트 수신코드**

이벤트는 전파자에 접근할 수만 있으면 누구나 이벤트를 수신받을 수 있습니다.

#### **단순한 이벤트 수신방법**

```javascript
dispatcher.on(`EVENT_NAME`, (eventValue)=>{
    // 여기에서 첫번째 인자로 이벤트 값을 받습니다.
})
```

#### **기본적 이벤트 수신방법**

dispatcher.on 의 세번째 인자를 통해서 우선순위를 정할 수 있습니다. ```dispatcher.priority``` 또는 ```0~5``` 까지 숫자를 인자로 사용할 수 있으며 우선순위를 정하지 않으면 ```normal``` 이 우선순위로 적용됩니다.

```javascript
dispatcher.on(`EVENT_NAME`, (value, override)=>{
    // 두번째 인자를 호출하고
    // 변경할 값을 넣음으로써
    // 이벤트 값을 변경할 수 있습니다.
    override(`I_WANT_TO_CHANGE_VALUE_TO_THIS`)
    
    // false 를 반환하면
    // 이벤트가 중단처리 됩니다.
    return false

    // 여기서 우선순위를 지정합니다.
}, dispatcher.priority.high)
```



### **응용된 사용방법**

Cancelable 에는 여러 응용가능한 기능이 포함되어 있습니다. 필요에 따라서 사용가능합니다.



#### **송신자의 이벤트 추적결과 확인방법**

이벤트는 중단되면 즉시 전파가 중단되며, 모든 이벤트 추적은 `stack-trace` 모듈을 통해서 이뤄집니다.

```javascript
dispatcher.emit(`EVENT_NAME`, `EVENT_VALUE`, 
    (isCanceled, overridedParam, traceData)=>{
        // traceData 구조
        traceData.stopper   // [1]
        traceData.listeners // [2]
        traceData.override  // [3]

        // [1] 이벤트를 중단시킨 함수의 추적정보가 담깁니다.
        // [2] 이벤트를 전달받은 함수들의 추적정보가 담깁니다.
        // [3] 이벤트 값을 변경한 함수들의 추적정보와 변경사항이 담깁니다.

        // traceData 의 하위요소 반환 값 구조
        traceData.override   // Override
        traceData.stopper    // TraceItem || null
        traceData.listeners  // TraceItem

        // Override 구조
        // (Override 는 Trace 의 하위요소를 모두 가집니다.)
        traceData.override[].isModified // [1]
        traceData.override[].before     // [2]
        traceData.override[].after      // [3]

        // [1] 해당 순서에서 값이 변경되었는지 여부가 담깁니다.
        // [2] 바뀌기 전 값이 담깁니다.
        // [3] 바뀐 후의 값이 담깁니다.

        // TraceItem 의 하위요소 구조
        traceData.override[].functionName  // [1]
        traceData.override[].lineNumber    // [2]
        traceData.override[].columnNumber  // [3]
        traceData.override[].fileName      // [4]
        traceData.override[].typeName      // [5]
        traceData.override[].text          // [6]

        // [1] 파악된 함수명이 담깁니다.
        // [2] 파악된 코드줄 번호가 담깁니다.
        // [3] 파악된 코드열 번호가 담깁니다.
        // [4] 파악된 파일주소가 담깁니다.
        // [5] 파악된 객체 타입명이 담깁니다.
        // [6] 파악된 해당 코드원문이 담깁니다.
    }
)
```



#### **송신자의 깊은 이벤트 추적결과 확인방법**

```dispatcher.emit``` 의 세번째 인자에 객체형태로 옵션을 넣을 수 있습니다. ```trace``` 와 ```deep``` 이 옵션으로 사용 가능합니다.

- `trace` 기록변경 및 중단자 정보를 수집할지를 선택할 수 있습니다. 기본옵션은 `true` 이며 `false` 를 적용시 추적정보를 수집하지 않습니다. 이 옵션을 끄면 당연히 `deep`  옵션도 활성화 할 수 없게 됩니다.
- `deep` trace 정보 수집 깊이를 조절할 수 있습니다. `false` 로 설정시 문제되거나 해당행동을 실행한 소스코드를 자동으로 특정합니다. `true` 로 설정되면 해당 문제되는 소스코드 실행과정 전체를 최대 10개까지 모두 반환합니다. **deep 옵션을 활성화 한 경우 기존 trace 객체는 배열로 반환됩니다.**

```javascript
dispatcher.emit(`EVENT_NAME`, `EVENT_VALUE`, 
    (isCanceled, overridedParam, traceData)=>{
         for(let overrideIndex in traceData.override){

             // deep 옵션을 켜면 TraceItem 이 아닌 TraceList 를 획득합니다.
             let traceList = traceData.override[overrideIndex]

             for(let traceListIndex in traceList){
                 // for 문으로 한번 순회하면 TraceItem 에 접근할 수 있습니다.
                 traceData.override[overrideIndex][traceListIndex]
             }
         }
	}

    // 세번째 인자로 이벤트 송신 옵션을 정의합니다.
, { trace: true, deep: true})
```



#### **이벤트 비동기 수신 방법**

> 경고: 비동기 수신은 전파자 생성시 `비동기수신자 사용여부` 를 반드시 허용해야만 사용 가능합니다. 일반적 전파자에서는 `비동기 수신자`를 사용할 수 없으며, `비동기 수신자`사용을 활성화 하는 방법은 아래 항목에서 설명됩니다.

해당 수신자가 이벤트 값을 **변경하지 않고** 이벤트를 **중단시키지 않고** 이벤트가 나중에 **취소되도 상관 없는 경우** 이 방법을 사용할 수도 있습니다. 비동기 수신자로 추가된 경우 우선순위에 따라 차례차례 이벤트 값을 받지 않고 비동기로 즉시 값을 받아보게 됩니다. 동기적으로 이벤트를 받게되면 성능 저하가 예상되는 작업에 활용할 수 있습니다.

```javascript
dispatcher.on(`EVENT_NAME`, (eventValue)=>{
    // dispatcher.priority.async
    // 또는 -1 로 우선순위를 지정함으로써
    // 비동기 수신자로 등록할 수 있습니다.
}, dispatcher.priority.async)
```



#### **전파자 생성시 사용할 기능 설정방법**

전파자를 생성할 때 `비동기수신자 사용여부` 와 `값 재정의 제한여부` 와 `추적정보 수집 제한여부` 를 각각 설정할 수 있습니다.

#### **변수를 통한 커스텀 Dispatcher 생성**

```javascript
// ES6
import Cancelable from 'Cancelable'
let myDispatcher = new Cancelable({
    async: true,   // 기본: false
    trace: true,   // 기본: true
    override: true // 기본: true
})
```

#### **클래스를 통한 커스텀 Dispatcher 생성**

```javascript
// ES6
class Dispatcher extends Cancelable{
    constructor(){
        super({
            async: true,   // 기본: false
            trace: true,   // 기본: true
            override: true // 기본: true
        })
    }
}
let myDispatcher = new Cancelable()
```



## 개발목표

Cancelable 모듈은 Node.JS의 EventEmitter 와의 호환을 지향하고 있습니다.

- [x] 취소가능한 이벤트 구현
- [x] 우선순위에 따른 이벤트 값 변동 구현
- [x] 이벤트 값 변동 및 취소자 정보 역추적 구현
- [x] Capsulable 모듈을 통한 객체 은닉성 구현
- [x] 비동기 이벤트 함수 구현
- [x] 기초 테스트 유닛 작성
- [ ] object 형 이벤트 값의 전 후 값 추적 구현
- [ ] EventEmitter 함수 완벽지원
- [ ] 테스트 유닛 추가작성
- [ ] 브라우저 테스트 유닛 추가작성
- [ ] 코드 커버리지 테스트 유닛 추가작성
- [ ] 비동기 이벤트 함수의 선실행 이후 이벤트 완료 후 다시한번 재실행 구현



## 로고 아이콘 출처

<div>Icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" 			    title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 			    title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>



## 라이센스

MIT License.