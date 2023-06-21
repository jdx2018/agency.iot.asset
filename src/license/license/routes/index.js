const router = require('koa-router')()

const getLic = require('../api/register2license')




router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.post('/api/license/license', async (ctx, next) => {
  let res = await getLic.getLic(ctx);
  ctx.body = res;
})


module.exports = router
