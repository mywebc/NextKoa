const Koa = require("koa");
const Router = require("koa-router");
const next = require("next");
const koaBody = require('koa-body')
// koa中的session 包
const session = require("koa-session");
const RedisSessionStore = require("./server/session-store");
const auth = require("./server/auth")
const api = require("./server/api")
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev
});
const handle = app.getRequestHandler();
const Redis = require("ioredis")
// 将乱码转化为markdown
const atob = require("atob")

// 创建redis client
const redis = new Redis();

// 设置nodejs全局增加一个atob方法
global.atob = atob;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  // 设置一个keys用来给cookie加密的
  server.keys = ["hello develop"];
  // 创建session配置
  const SESSION_CONFIG = {
    key: "myId",
    // 用来连接redis数据库 new RedisSessionStore(redis)
    store: new RedisSessionStore(redis)
    // maxAge: 6 * 1000
  };
  // 使用session  
  server.use(session(SESSION_CONFIG, server));
  server.use(koaBody())

  server.use(async (ctx, next) => {
    await next();
  });
  // 处理github登录
  auth(server);
  // 代理请求初始化数据
  api(server);
  // 路由
  router.get("/a/:id", async ctx => {
    const id = ctx.params.id;
    await handle(ctx.req, ctx.res, {
      pathname: "/a",
      query: {
        id
      }
    });
    // 不再使用koa内部的处理， 由我们手动的返回的内容
    ctx.respond = false;
  });

  // 单独写一个请求来设置session
  router.get("/set/user", async ctx => {
    ctx.session.user = {
      name: "yun",
      age: 12
    };
    ctx.body = "设置session成功！";
  });
  // 销毁session
  router.get("/delete/user", async ctx => {
    ctx.session = null
    ctx.body = "删除session成功！";
  });

  // 从session里获取用户信息
  router.get("/api/user/info", async ctx => {
    const user = ctx.session.userInfo;
    if (!user) {
      ctx.status = 401;
      ctx.body = "Need Login";
    } else {
      ctx.body = user;
      ctx.set("Content-Type", "application/json");
    }
  });
  // detail 页面
  // router.get("/detail", async ctx => {
  //   const user = ctx.session.userInfo;
  //   if (!user) {
  //     ctx.status = 401;
  //     ctx.body = "Need Login";
  //   } else {
  //     ctx.response = false
  //   }
  // });


  server.use(router.routes());

  server.use(async (ctx, next) => {
    // 将session中的用户信息保存到req.session
    ctx.req.session = ctx.session;
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.listen(3000, () => {
    console.log("koa server listening on 3000");
  });
});