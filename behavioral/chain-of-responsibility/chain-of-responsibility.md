---
title: 책임 연쇄 패턴
author: Yejin Cho
date: Tue Jun 6 18:13:35 2023 +0900
type: behavioral
---
# 책임 연쇄 패턴

## 개요

책임 연쇄 패턴은 핸들러들의 체인(사슬)을 따라 요청을 전달할 수 있게 해주는 행동 디자인 패턴이다.

각 핸들러는 요청을 받으면 요청을 처리할지 아니면 체인의 다음 핸들러로 전달할지를 결정한다.

즉 특정 순서를 가지고 있는 로직을 처리하기 위해 주로 사용된다.

## 해결하고자 하는 문제

어플리케이션에선 요청 순서가 정해진 로직이 있는 경우가 있다.
<img src="https://refactoring.guru/images/patterns/diagrams/chain-of-responsibility/problem1-ko-2x.png?id=3c121f18651118d1f87703b80b7a6717" alt="요청 순서가 정해진 로직">

요청 순서가 정해진 로직의 경우 실패하면 다음 순서를 진행할 이유가 없다.

요청 순서가 정해진 로직의 경우 이전 실행의 결과 혹은 순서에 영향을 받게 된다. 이는 요청을 처리하는 객체간의 결합도가 높아지는 것을 의미한다.

<img src="https://refactoring.guru/images/patterns/diagrams/chain-of-responsibility/problem2-ko-2x.png?id=1c8aeab6ceee85b6bb4d10a9470febf8" alt="거대한 객체">

만약 요청을 처리하는 로직이 집중된 객체가 있다면 추가 혹은 삭제, 수정하기 더욱 어려워진다.
요청을 처리하는 객체 하나를 수정할 때 다른 객체들도 수정해야 할 수 있기 때문이다.

## 해결방안

<img src="https://refactoring.guru/images/patterns/diagrams/chain-of-responsibility/solution1-ko-2x.png?id=d36782ad64bf8aa8369e185a36869ec4" alt="책임 연쇄 패턴">

객체간 결합도를 줄이기 위해 특정 행동들을 핸들러라는 독립 실행형 객체들로 변환할 수 있다.
이러한 순서가 있는 로직들을 핸들러간 참조를 통해 핸들러에서 요청을 처리한 뒤 다음 핸들러에게 요청을 전달하는 형태로 수정할 수 있다.

다음 순서를 진행할지 말지 결정하는 권한이 핸들러에게 있기 때문에 핸들러에서 다른 핸들러에게 전달하지 않고 추가 처리를 중지할 수 있다.

<img src="https://refactoring.guru/images/patterns/diagrams/chain-of-responsibility/solution2-ko-2x.png?id=a046b0c919f5b079294e2e2437f9cbff" alt="핸들러 변형">

해당 패턴의 변형으로 요청을 처리할 핸들러가 있을 때 까지 다음 핸들러에게 전달하는 경우도 있다.

이는 정확한 요청들의 유형과 순서를 미리 알 수 없는 상황에서 모든 핸들러들에게 요청을 처리할 기회를 주기 위한 것이다.

## 정리

책임 연쇄 패턴의 두 가지 핵심은 다음과 같다.

1. 모든 요청이 체인에 따라 순서대로 통과한다.

2. 다음 핸들러로 요청을 넘길지, 처리를 중지할지 각 핸들러가 결정한다. 즉 핸들러는 각 단계별 처리 로직과 진행여부를 결정할 수 있다.

이로 인해 다음과 같은 두 가지 케이스에서 모두 적용할 수 있다.

1. 특정 순서로 실행되어야 하는 로직

모든 요청이 체인에 따라 순서대로 처리되고, 체인의 어디서든 중지할 수 있기 떄문에 특정 순서로 실행되어야 하는 로직의 처리와 예외처리에도 적합하다.

2. 요청 유형들과 순서들을 알 수 없을 때

<img src="https://refactoring.guru/images/patterns/diagrams/chain-of-responsibility/example2-ko.png" alt="책임 연쇄 패턴의 사용예시">

요청을 처리할 수 있는지 묻고, 다음 핸들러로 넘기는 방식으로 모든 핸들러에게 요청을 처리할 기회를 줄 수 있다.

보통 GUI나 웹에서 많이 쓰인다. 요청이 발생했을 때 어떤 GUI 요소가 그 요청을 처리해야할지 미리 알 수 없기 떄문이다.

## UML

<img src="https://refactoring.guru/images/patterns/diagrams/chain-of-responsibility/structure-indexed-2x.png?id=4f27e2c48e635f45a78472d707a8df3c" alt="책임 연쇄 패턴">

1. 핸들러는 모든 구상 핸들러에 공통된 인터페이스를 선언한다.
   요청을 처리하기 위한 단일 메서드를 포함하고 때로는 체인의 다음 핸들러를 세팅하기 위한 메서드가 있을 수 있다.

2. 기초 핸들러는 선택적 클래스이며, 모든 핸들러 클래스들에 공통적인 상용구 코드를 넣을 수 있다. 일반적으로 핸들러에 대한 참조를 저장하기 위한 필드를 정의한다. 핸들러를 이전 핸들러의 생성자 혹은 setter에 전달하여 체인을 구축한다.

3. 구상 핸들러에는 요청을 처리하기 위한 실제 코드가 포함되어 있다. 그리고 어떻게 체인을 따라 전달할지를 결정할 수 있다.

4. 클라이언트는 앱의 로직에 따라 체인들을 한 번만 구성하거나 동적으로 구성할 수 있다.

## 구현 시 주의사항

### 같은 인터페이스

일반적으로 각 핸들러의 반환값들은 동일한 인터페이스로 구현되어야 한다.
핸들러마다 다른 인터페이스의 값을 반환하게 될 경우, 핸들러가 각 단계의 처리 로직 뿐만 아니라 이전 핸들러의 반환값의 인터페이스까지 알아야 하기 때문이다.
이는 각 핸들러가 이전 핸들러의 반환값의 인터페이스에 의존하게 됨으로서 책임연쇄패턴의 목적인 유연한 수정을 잃게 만든다.

## 헷갈렸던 점

메서드 체이닝 패턴과 유사한게 아닌가 싶어서 헷갈렸다.

### 메서드 체이닝 패턴

메서드 체이닝은 객체의 메서드를 여러번 호출해서 코드를 간결하게 작성할 수 있다.
배열의 map, filter, reduce이 적절한 예시이다.

짝수의 합을 구하는 코드를 작성해보면 다음과 같이 작성할 수 있다.

자바스크립트의 배열 내장 메서드(map,reduce,filter)등은 연산 결과를 다음 메서드로 전달한다.

```js
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let evenNumbers = [];
let sum = 0;

for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    evenNumbers.push(numbers[i]);
  }
}

for (let i = 0; i < evenNumbers.length; i++) {
  sum += evenNumbers[i];
}
```

이는 메서드 체이닝을 적용해서 다음과 같이 수정할 수 있다.

```js
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const sum = numbers
  .filter((num) => num % 2 === 0)
  .reduce((acc, curr) => acc + curr, 0);
```

### 메서드 체이닝 패턴과의 차이점

메서드 체이닝과 책임연쇄 패턴은 모두, 이전 핸들러의 결과값을 다음 핸들러가 받아서 처리한다는 공통점이 있다.

메서드 체이닝 패턴과는 몇 가지 차이점이 있다.

#### 목적에서의 차이

메서드 체이닝 패턴은 연속적인 작업을 간단하게 작성하는데에 그 목적이 있다.

반면 책임연쇄 패턴은 한 객체에 집중된 순서가 정해진 작업들을 핸들러 단위로 나누어서 각 단계에서 각 객체가 이를 처리하도록 하여 수정에 유연하도록 하는 것이 목적이다.

#### 예외 처리

메서드 체이닝 패턴에서는 예외가 발생할 시에 에러를 던진다.

반면 책임연쇄 패턴에서는 예외가 발생할 시에 이를 다음 핸들러에서 처리하도록 위임할지 예외를 던질지를 핸들러가 결정할 수 있다.

즉 책임 연쇄 패턴의 핵심은 체인의 어떤 지점이든 체인을 끊을지 핸들러가 결정할 수 있다는 것이다.

## 사용 예시

다음과 같은 사용 예시가 있다.

### 미들웨어

### nest의 pipe and filter

HTTP 요청에 대해 변환하거나 검증하는데에 사용된다.

https://docs.nestjs.com/pipes

https://learn.microsoft.com/ko-kr/azure/architecture/patterns/pipes-and-filters

### axios interceptor

axios에서도 요청과 응답을 가로채기 위해 interceptor를 사용할 수 있다.

요청과 응답을 가로채 처리하고 다음 interceptor에게 전달하거나 HTTP 요청을 보낸다.

https://axios-http.com/kr/docs/interceptors
