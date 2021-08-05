## 비동기 - 콜백과 프로미스 객체의 이해

```javascript
function a() {
  console.log("A");
}
function b() {
  console.log("B");
}

b();
a();
```

위 코드의 결과는 B 가 출력되고 A 가 출력된다.<br />
이처럼 호출된 순서대로 함수가 동작하는 방식을 동기(Synchronous)라고 한다.

반대로 아래 코드는 호출 순서가 어떻게 되었던 반드시 B가 출력되고 1초 후에 A가 출력된다.

```javascript
function a() {
  setTimeout(() => {
    console.log("A");
  }, 1000);
}
function b() {
  console.log("B");
}
a();
b();
```

이 때 A가 출력되고 B가 출력되도록 보장하려면 어떻게 해야할까

### 콜백 함수

- setTimeout 내부에서 A 가 호출되고 B 가 출력되도록 한다.
- 콜백 함수를 사용하는 것.

```javascript
function a(callback) {
  setTimeout(() => {
    console.log("A");
    callback();
  }, 1000);
}
function b() {
  console.log("B");
}
a(function () {
  b();
});
```

위 코드는 1초 뒤에 A가 출력되고 B가 출력된다.

- 단점
  - 보장해야 할 순서가 많아진다면 `콜백 지옥` 에 빠질 수 있다.
  - 예로 A->B->C->D->Done! 순서대로 출력이 보장되도록 하는 코드를 아래에 작성한다.

```javascript
function a(callback) {
  setTimeout(() => {
    console.log("A");
    callback();
  }, 1000);
}
function b(callback) {
  setTimeout(() => {
    console.log("B");
    callback();
  }, 1000);
}
function c(callback) {
  setTimeout(() => {
    console.log("C");
    callback();
  }, 1000);
}
function d(callback) {
  setTimeout(() => {
    console.log("D");
    callback();
  }, 1000);
}

// 순서를 보장하기 위해 함수 내에 함수를 계속 넣음으로써 depth가 계속 깊어지며, 개미 지옥과 같다고 하여 콜백 지옥이라고 함.
a(function () {
  b(function () {
    c(function () {
      d(function () {
        console.log("Done!");
      });
    });
  });
});
```

<br />

## Promise 객체

콜백 함수의 불편한 패턴을 개선하기 위해 Promise 객체를 사용해본다.

```javascript
function a() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log("A");
      resolve("Hello A");
    }, 1000);
  });
}
function b() {
  console.log("B");
}
async function test() {
  const res = await a();
  console.log("res:", res);
  b();
}
test();
```

- a 함수 내에 Promise 라는 생성자 함수를 정의 하였음
- 콟백으로 가져온 resolve 라는 매개를 보장하고 싶은 위치에서 호출함으로써 순서를 보장할 수 있게 된다.
- Promise 생성자 함수를 내부에 정의함으로써 해당 함수는 앞에 await 키워드를 사용할 수 있게 된다.
- await 는 resolve 가 실행될 떄 까지 기다린다.
- resolve 인자는 Promise 의 콜백 함수의 return 값이 된다.
  - 따라서 위 코드의 변수 `res` 는 resolve 가 호출되며 반환되어진 "Hello A" 를 Promise 를 거쳐 함수 `a()`가 종료되며 전달받은 것이다.

이를 바탕으로 콜백 함수에서 예시로 든 콜백 지옥을 개선하면 아래와 같다.

```javascript
function a() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log("A");
      resolve();
    }, 1000);
  });
}
function b() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log("B");
      resolve();
    }, 1000);
  });
}
function c() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log("C");
      resolve();
    }, 1000);
  });
}
function d() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log("D");
      resolve();
    }, 1000);
  });
}

async function test() {
  await a();
  await b();
  await c();
  await d();
  console.log("Done!");
}
test();
```

<br />

## Promise 심화 - then, catch, finally

직전 예시들은 `await` 와 `async` 로 실행 순서를 보장해왔다. 하지만 이 두 키워드들은 `ECMAScript 2017(ES8)` 에 처음 도입된 것이고, Promise 개념은 `ECMAScript 2015(ES6)` 에 도입된 것이다.

불가피하게 await 와 async 를 사용할 수 없는 상황이 있을 수 있으므로, 아래 코드를 `then, catch, finally` 를 이용하여 순서를 보장할 수 있도록 해보자.

<br />

### then

```javascript
function a() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("A");
      resolve();
    }, 1000);
  });
}

// async, await 를 사용하지 않고 then 을 사용하여 비동기처리.
function test() {
  a().then(() => {
    console.log("B");
  });
}
```

A > B > C > D 순으로 출력되도록 하는 예제는 아래와 같이 짤 수 있다.

```javascript
// ...
function test() {
  a().then(() => {
    b().then(() => {
      c().then(() => {
        d().then(() => {
          console.log("Done!");
        });
      });
    });
  });
}

test();
```

`then` 을 활용하여 순서를 보장하였으나, 콜백 지옥과 아주 흡사한 모습이다. <br />
아래와 같이 코드를 개선할 수 있다.

```javascript
// ...

// return 키워드로 then 밖으로 반환해 줌으로써 체이닝할 수 있음.
function test() {
  a()
    .then(() => {
      return b();
    })
    .then(() => {
      return c();
    })
    .then(() => {
      return d();
    })
    .then(() => {
      console.log("Done!");
    });
}
```

- 가급적 최신 기술인 `await`, `async` 를 사용하는 것이 권장됨.

<br />

### reject, finally

예시 코드를 보자. a 함수는 number를 받는데, 이 숫자가 4 보다 클 경우 `거절`하도록 작성되었다.

```javascript
function a(number) {
  return new Promise((resolve, reject) => {
    if (number > 4) {
      reject();
      return;
    }

    setTimeout(() => {
      console.log("A");
      resolve();
    }, 1000);
  });
}

function test() {
  a(7)
    .then(() => {
      console.log("Resolve!");
    })
    .catch(() => {
      console.log("Reject!");
    })
    .finally(() => {
      console.log("Done!");
    });
}
```

- a 함수에 인자로 7이 들어감.
- 4보다 크므로 reject() 가 실행되어, then이 호출되지 않고 catch가 실행되어 'Reject!' 가 출력됨.
- 함수에서 조건에 맞지 않거나, 함수 처리에 문제가 생겨 거절되었을 때에 동작하는 코드를 작성할 수 있다.
- finally 는 resolve 혹은 reject 가 동작되어 then 혹은 catch 가 실행된 후 가장 마지막에 반드시 실행할 코드를 작성할 수 있다.
- 따라서 위 코드는 'Resolve!' 혹은 'Reject!' 가 출력된 후 반드시 'Done!' 이 출력된다.

<br />

### async, await 에서의 then, catch, finally

위 코드를 async, await 구문으로 작성해본다.

```javascript
// ...
async function test() {
  try {
    await a(8);
    console.log("Resolve!");
  } catch (error) {
    console.log("Reject!");
  } finally {
    console.log("Done!");
  }
}
```
