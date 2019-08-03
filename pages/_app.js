import App, { Container } from "next/app";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import store from "../store/store";

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
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default MyApp;
