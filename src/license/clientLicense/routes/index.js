const router = require('koa-router')()

const generateRegCode = require('../api/generate_register')
const licenseFile = require('../api/licenseFile')
const checkMachine = require('../api/checkMachine')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.post('/api/license/registerID', async (ctx, next) => {
  let res = await generateRegCode.generateRegCode()
  console.log("registerID", res)
  ctx.body = res
})

router.post('/api/license/licenseFile', async (ctx, next) => {
  let res = await licenseFile.licenseFile(ctx)
  console.log(res);
  ctx.body = res
})

router.post('/api/license/checkMachine', async (ctx, next) => {
  let res = await checkMachine.checkMachine()
  console.log(res);
  ctx.body = res
})
// router.post('/api/license/getLicense', async (ctx, next) => {
//   let res = await getLicense.getLicense(ctx.request.body.license)
//   ctx.body = res
// })


module.exports = router
