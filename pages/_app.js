import App, { Container } from "next/app";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import AppHoc from "../lib/with-redux";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps;
    if (Component.getInitialProps) {
      pageProps = Component.getInitialProps(ctx);
    }
    return {
      pageProps
    };
  }
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Container>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}
// 使用高阶组件包裹app，保证每次创建新的store
export default AppHoc(MyApp);
