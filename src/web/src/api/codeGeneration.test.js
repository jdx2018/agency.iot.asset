const codeGeneration = require('./codeGeneration.js').codeGeneration;
async function test() {
  // console.log("get code.");
  const res = await codeGeneration([
    { codeType: 'asset', count: 22 },
    { codeType: 'epc', count: 2 },
    { codeType: 'ppp', count: 1 },
  ]);
  console.log(res);
}
// async function waitSecond(timeSpan) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // console.log("time is already.");
//       resolve();
//     }, timeSpan);
//   });
// }
// test();
// new Array(100).fill(1).forEach(async (v) => {
// await waitSecond(2000);
test();
// setTimeout(() => {}, Math.ceil(Math.random() * 1000));
// });
