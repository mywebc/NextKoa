import { Button, Icon, Tabs } from "antd";
import getCofnig from "next/config";
import { connect } from "react-redux";
import Router, { withRouter } from "next/router";
import Repo from "../components/Repo";
import { getStore } from '../store'
import axios from 'axios'
const api = require('../lib/api')
import { useEffect } from 'react'
// 具有时效性的缓存策略
import LRU from 'lru-cache'


const cache = new LRU({
  maxAge: 1000 * 10,
})

const { publicRuntimeConfig } = getCofnig();

const isServer = typeof window === "undefined";
function Index(props) {
  console.log("props", props)
  console.log("isServer", isServer)

  const { userRepos, starredRepos, user, router } = props
  const tabKey = router.query.key || "1";

  const handleTabChange = activeKey => {
    Router.push(`/?key=${activeKey}`);
  };

  useEffect(() => {
    if (!isServer) {
        cache.set('userRepos', userRepos)
        cache.set('starredRepos', starredRepos)
    }
  }, [userRepos, starredRepos])

  if (!user || !user.id) {
    return (
      <div className="root">
        <p> 请求先登录哦~ </p>
        <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>
          点击登录
        </Button>
        <style jsx>
          {`
            .root {
              height: 400px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div className="root">
      <div className="user-info">
        <img src={user.avatar_url} alt="user avatar" className="avatar" />
        <span className="login"> {user.login} </span>
        <span className="name"> {user.name} </span>
        <span className="bio"> {user.bio} </span>
        <p className="email">
          <Icon
            type="mail"
            style={{
              marginRight: 10
            }}
          />
          <a href={`mailto:${user.email}`}> {user.email} </a>
        </p>
      </div>
      <div className="user-repos">
        <Tabs activeKey={tabKey} onChange={handleTabChange} animated={false}>
          <Tabs.TabPane tab="你的仓库" key="1">
            {userRepos&&userRepos.map(repo => (
              <Repo key={repo.id} repo={repo} key={repo.id}/>
            ))}
          </Tabs.TabPane>
          <Tabs.TabPane tab="你关注的仓库" key="2">
            {starredRepos&&starredRepos.map(repo => (
              <Repo key={repo.id} repo={repo} key={repo.id}/>
            ))}
          </Tabs.TabPane>
        </Tabs>
      </div>
      <style jsx>
        {`
          .root {
            display: flex;
            align-items: flex-start;
            padding: 20px 0;
          }
          .user-info {
            width: 200px;
            margin-right: 40px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
          }
          .login {
            font-weight: 800;
            font-size: 20px;
            margin-top: 20px;
          }
          .name {
            font-size: 16px;
            color: #777;
          }
          .bio {
            margin-top: 20px;
            color: #333;
          }
          .avatar {
            width: 100%;
            border-radius: 5px;
          }
          .user-repos {
            flex-grow: 1;
          }
        `}
      </style>
    </div>
  );
}
const API_BASE = process.env.API_BASE + '/github'

Index.getInitialProps = async (ctx) => {
  const store = getStore()
  // 从redux里面拿到信息实时的
  const user = store.getState().user;
  console.log("用户信息", user);
  if (user || user.id) {
    let headers = {}
    if (isServer) {
      headers['cookie'] = ctx.req.headers.cookie
    }
    if(!isServer) {
        if (cache.get("userRepos") && cache.get("starredRepos")) {
          return {
            userRepos: cache.get("userRepos"),
            starredRepos: cache.get("starredRepos"),
          }
        }
    }
   
    try {
      const [userRepos, starredRepos] = await Promise.all([
        axios({
          method: 'GET',
          url: `${API_BASE}/user/repos`,
          headers,
        }),
        axios({
          method: 'GET',
          url: `${API_BASE}/user/starred`,
          headers,
        }),
      ])
      return {
        starredRepos: starredRepos.data,
        userRepos: userRepos.data,
      }
    } catch (err) {
      console.error('---------------', err.message)
      return {
        starredRepos: [],
        userRepos: [],
      }
    }
  }else {
    return {
      starredRepos: [],
      userRepos: [],
    }
  }
};

export default withRouter(
  connect(function mapState(state) {
    // 拿到user信息
    return {
      user: state.user
    };
  })(Index)
);
