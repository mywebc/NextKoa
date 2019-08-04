const Koa = require("koa")
const Router = require("koa-router")
const next = require("next")
const session = require("koa-session")
const RedisSessionStore = require("./server/session-store")

const dev = process.env.NODE_ENV !== 'production'
const app = next({})
const handle = app.getRequestHandler()

const Redis = require("ioredis")
// 创建redis client, 需要传入Session config 中 
const redis = new Redis()

app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()
    server.keys = ["hello develop"]
    const SESSION_CONFIG = {
        key: "myId",
        store: new RedisSessionStore(redis)
    }
    server.use(session(SESSION_CONFIG, server))

    server.use(async (ctx, next) => {
        if (!ctx.session.user) {
            ctx.session.user = {
                name: "yun",
                age: 24
            }
        } else {
            console.log('session is', ctx.session)
        }
    })

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

    router.get('/api/user/info', async (ctx) => {
        const user = ctx.session.userInfo
        if (!user) {
            ctx.status = 401
            ctx.body = 'Need Login'
        } else {
            ctx.body = user
            ctx.set('Content-Type', 'application/json')
        }
    })


    server.use(router.routes())

    server.listen(3000, () => {
        console.log('koa server has connected!')
    })
})