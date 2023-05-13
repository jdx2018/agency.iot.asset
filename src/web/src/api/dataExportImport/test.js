const dayjs = require('dayjs');
const arrayList = [];

for (let i = 0; i < 10000; i++) {
  arrayList.push(i);
  // arrayList.sort();
}
console.log("排序完成");
function functional() {
  const curDate = dayjs();
  let result = null;
  for (let i = 0; i < 10000; i++) {
    result = arrayList.find((_) => _ === 6666);
  }

  const afterDate = dayjs();
  console.log('functional', result, afterDate.diff(curDate, 'ms'));
}

// functional();

function foreach() {
  let obj = {};
  for (let j = 0; j < arrayList.length; j++) {
    obj[j] = j;
  }

  const curDate = dayjs();

  let result = null;
  for (let i = 0; i < 10000; i++) {
    result = obj[66666];
  }
  const afterDate = dayjs();
  console.log('foreach', result, afterDate.diff(curDate, 'ms'));
}

// foreach();

function objSet() {
  let obj = {};
  obj["A0"] = 1;
  obj["A2"] = 1;
  obj["A1"] = 1;
  obj["A3"] = 1;
  Object.keys(obj).forEach((key) => {
    console.log(key);
  })
}
objSet()
console.log(10 + String(20));


async function waitSecond(timeSpan) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // console.log("time is already.");
      resolve();
    }, timeSpan);
  });
}

let arr = [1, 3, 2, 4, 5];
arr.forEach(async (key) => {
  await waitSecond(key * 3000);
  console.log(key, "1-wait");
  // await waitSecond(key * 2000);
  // console.log(key, "2-wait");
})