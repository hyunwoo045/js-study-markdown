// function a() {
//   return new Promise(function (resolve) {
//     setTimeout(function () {
//       console.log("A");
//       resolve("Hello A");
//     }, 1000);
//   });
// }
// function b() {
//   return new Promise(function (resolve) {
//     setTimeout(function () {
//       console.log("B");
//       resolve("Hello B");
//     }, 1000);
//   });
// }
// function c() {
//   return new Promise(function (resolve) {
//     setTimeout(function () {
//       console.log("C");
//       resolve("Hello C");
//     }, 1000);
//   });
// }
// function d() {
//   return new Promise(function (resolve) {
//     setTimeout(function () {
//       console.log("D");
//       resolve("Hello D");
//     }, 1000);
//   });
// }

// async function test() {
//   await a();
//   await b();
//   await c();
//   await d();
//   console.log("Done!");
// }
// test();

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

test();
