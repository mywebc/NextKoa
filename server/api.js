const axios = require("axios");
const Router = require("koa-router");

const { requestGithub } = require("../lib/api");

const github_base_url = "https://api.github.com";

module.exports = server => {
  server.use(async (ctx, next) => {
    const path = ctx.path;
    const method = ctx.method;
    console.log("=============================================", path)
    console.log("=============================================", method)
    if (path.startsWith("/github/")) {
      console.log("session=============================", ctx.session);
      const session = ctx.session;
      debugger
      const githubAuth = session && session.githubAuth;
      const headers = {};
      if (githubAuth && githubAuth.access_token) {
        headers["Authorization"] = `${githubAuth.token_type} ${
          githubAuth.access_token
        }`;
      }
      try {
        const result = await requestGithub(
          method,
          ctx.url.replace("/github/", "/"),
          ctx.request.body || {},
          headers
        );
        ctx.status = result.status;
        ctx.body = result.data;
      } catch (error) {
        console.log("请i去错误+++++++++++++++++++", error.message)
      }
    } else {
      console.log("fail++++++++++++++++++++++++++++++")
      await next();
    }
  });
};
