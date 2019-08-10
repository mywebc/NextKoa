import { useEffect } from "react";
import { Button, Icon, Tabs } from "antd";
import getCofnig from "next/config";
import { connect } from "react-redux";
import Router, { withRouter } from "next/router";
import Repo from "../components/Repo";
import { cacheArray } from "../lib/repo-basic-cache";

const api = require("../lib/api");

import Link from "next/link";
import Router from "next/router";
import { Button } from "antd";
import { connect } from "react-redux";
import getCofnig from "next/config";

const { publicRuntimeConfig } = getCofnig();

let cachedUserRepos, cachedUserStaredRepos;

const isServer = typeof window === "undefined";

function Index({ userRepos, userStaredRepos, user, router }) {
  // console.log(userRepos, userStaredRepos)

  const tabKey = router.query.key || "1";

  const handleTabChange = activeKey => {
    Router.push(`/?key=${activeKey}`);
  };

events.forEach(event => {
  Router.events.on(event, makeEvent(event));
});

const Index = ({ counter, username, rename }) => {
  function gotoTestB() {
    Router.push(
      {
        pathname: "/test/b",
        query: {
          id: 2
        }
      },
      "/test/b/2"
    );
  }

  useEffect(() => {
    if (!isServer) {
      cacheArray(userRepos);
      cacheArray(userStaredRepos);
    }
  });

  if (!user || !user.id) {
    return (
      <div className="root">
        <p> 亲， 您还没有登录哦~ </p>
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
        
        {/* {userRepos.map(repo => (
                      <Repo repo={repo} />
                    ))} */}
        <Tabs activeKey={tabKey} onChange={handleTabChange} animated={false}>
          <Tabs.TabPane tab="你的仓库" key="1">
            
            {userRepos.map(repo => (
              <Repo key={repo.id} repo={repo} />
            ))}
          </Tabs.TabPane>
          <Tabs.TabPane tab="你关注的仓库" key="2">
            
            {userStaredRepos.map(repo => (
              <Repo key={repo.id} repo={repo} />
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

Index.getInitialProps = async ({ reduxStore }) => {
  return {};
};

  const user = reduxStore.getState().user;
  console.log(reduxStore);
  if (!user || !user.id) {
    return {
      isLogin: false
    };
  }

  if (!isServer) {
    // if (cache.get('userRepos') && cache.get('userStaredRepos')) {
    //   return {
    //     userRepos: cache.get('userRepos'),
    //     userStaredRepos: cache.get('userStaredRepos'),
    //   }
    // }

    if (cachedUserRepos && cachedUserStaredRepos) {
      return {
        userRepos: cachedUserRepos,
        userStaredRepos: cachedUserStaredRepos
      };
    }
  }

  const userRepos = await api.request(
    {
      url: "/user/repos"
    },
    ctx.req,
    ctx.res
  );

  const userStaredRepos = await api.request(
    {
      url: "/user/starred"
    },
    ctx.req,
    ctx.res
  );

  return {
    isLogin: true,
    userRepos: userRepos.data,
    userStaredRepos: userStaredRepos.data
  };
};

export default withRouter(
  connect(function mapState(state) {
    return {
      rename: name =>
        dispatch({
          type: "UPDATE_USERNAME",
          name
        })
    };
  })(Index)
);
