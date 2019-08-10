import { useEffect } from "react";

import axios from "axios";

import Link from "next/link";
import Router from "next/router";
import { Button } from "antd";
import { connect } from "react-redux";
import getCofnig from "next/config";

const { publicRuntimeConfig } = getCofnig();


const events = [
  "routeChangeStart",
  "routeChangeComplete",
  "routeChangeError",
  "beforeHistoryChange",
  "hashChangeStart",
  "hashChangeComplete"
];

function makeEvent(type) {
  return (...args) => {
    console.log(type, ...args);
  };
}

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
    axios.get("/api/user/info").then(resp => console.log(resp));
  }, []);

  return (
    <>
      <span> Count: {counter} </span> <a> UserName: {username} </a>
      <input value={username} onChange={e => rename(e.target.value)} />
      <a href={publicRuntimeConfig.OAUTH_URL}> 去登录 </a>
    </>
  );
};

Index.getInitialProps = async ({ reduxStore }) => {
  return {};
};

export default connect(
  function mapStateToProps(state) {
    return {
      counter: state.counter.count,
      username: state.user.username
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      rename: name =>
        dispatch({
          type: "UPDATE_USERNAME",
          name
        })
    };
  }
)(Index);
