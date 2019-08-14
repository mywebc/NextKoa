import App, { Container } from "next/app";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import AppHoc from "../lib/with-redux";
import Router from "next/router";
import PageLoading from "../components/PageLoading";
import Layout from "../components/Layout";
import axios from "axios";

class MyApp extends App {
  state = {
    context: "value",
    loading: false
  };
  startLoading = () => {
    this.setState({
      loading: true
    });
  };

  stopLoading = () => {
    this.setState({
      loading: false
    });
  };

  componentDidMount() {
    Router.events.on("routeChangeStart", this.startLoading);
    Router.events.on("routeChangeComplete", this.stopLoading);
    Router.events.on("routeChangeError", this.stopLoading);
    console.log('app app')
    // node服务代理
    // axios
    //   .get("/github/search/repositories?q=react")
    //   .then(res => console.log(res));
  }

  componentWillUnmount() {
    Router.events.off("routeChangeStart", this.startLoading);
    Router.events.off("routeChangeComplete", this.stopLoading);
    Router.events.off("routeChangeError", this.stopLoading);
  }
  // static async getInitialProps(ctx) {
  //   const { Component } = ctx
  //   console.log('app init')
  //   let pageProps = {}
  //   if (Component.getInitialProps) {
  //     pageProps = await Component.getInitialProps(ctx)
  //   }
  //   return {
  //     pageProps,
  //   }
  // }
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    console.log('app props', this.props)
    return (
      <Container>
        <Provider store={reduxStore}>
          {this.state.loading ? <PageLoading /> : null}
          <Layout dispatch={reduxStore.dispatch}>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </Container>
    );
  }
}
// 使用高阶组件包裹app，保证每次创建新的store
export default AppHoc(MyApp);
