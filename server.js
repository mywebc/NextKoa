const Koa = require("koa")
const Router = require("koa-router")
const next = require("next")
// koa中的session 包
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
    // 设置一个keys用来给cookie加密的
    server.keys = ["hello develop"]
    // 创建session配置
    const SESSION_CONFIG = {
        key: "myId",
        // 用来连接redis数据库 new RedisSessionStore(redis)
        // store: new RedisSessionStore(redis)
    }
    // 使用session
    server.use(session(SESSION_CONFIG, server))

    server.use(async (ctx, next) => {
        console.log('session is', ctx.session)
        await next()
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
        // 不再使用koa内部的处理， 由我们手动的返回的内容
        ctx.respond = false
    })

    // 单独写一个请求来设置session
    router.get("/set/user", async ctx => {
        ctx.session.user = {
            name: "yun",
            age: 12
        }
        ctx.body = "设置session成功！"
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