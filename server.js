const Koa = require("koa")
const Router = require("koa-router")
const next = require("next")

const dev = process.env.NODE_ENV !== 'production'
const app = next({})
const handle = app.getRequestHandler()


app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()
    // 判断路径拿到id,返回相同ID
    router.get('/home/:id', async (ctx) => {
        const id = ctx.params.id
        await handle(ctx.req, ctx.res, {
            pathname: '/a',
            query: {
                id
            }
        })
        ctx.respond = false
    })

    server.use(router.routes())

    server.listen(3000, () => {
        console.log('koa server has connected!')
    })
})