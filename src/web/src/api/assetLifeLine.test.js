const writeAssetBehavior = require('./assetLifeLine.js').writeAssetBehavior;
async function test() {
  const res = await writeAssetBehavior(
    '1',
    [
      {
        assetId: 'ssss',
      },
      {
        assetId: 'xxx',
      },
    ],
    'JC002'
  );
  console.log(res);
}

test();
