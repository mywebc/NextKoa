import React from "react";
import { reset } from "ansi-colors";
// 在next中使用HOC要注意，返回的组件是没有getInitialProps这个方法的

// 判断是什么环境
const isServer = typeof window === "undefined";
const _NEXT_REDUX_STORE = "_NEXT_REDUX_STORE";

function getOrCreateStore(initialState) {
  if (isServer) {
    return createSore(initialState);
  }

  if (!window[__NEXT_REUDX_STORE__]) {
    window[__NEXT_REUDX_STORE__] = createSore(initialState);
  }
  return window[__NEXT_REUDX_STORE__];
}

export default Comp => {
  class WithReduxApp extends React.Component {
    constructor(props) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }
    render() {
      const { Component, pageProps, ...restres } = this.props;
      return (
        <Comp
          Component={Component}
          pageProps={pageProps}
          {...rest}
          reduxStore={this.reduxStore}
        />
      );
    }
  }
  WithReduxApp.getInitalProps = async ctx => {
    // 根据当前环境创建store
    const reduxStore = getOrCreateStore();
    let appProps = {};
    if (typeof Comp.getInitialProps === "function") {
      appProps = await Comp.getInitialProps(ctx);
    }

    return {
      ...appProps,
      initialReduxState: reduxStore.getState()
    };
  };
  return WithReduxApp;
};
