import Document, { Html, Head, Main, NextScript } from "next/document";
// 只有在服务端被渲染时才会被执行
class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>{/* <title>MyApp</title> */}</Head>
        <body>
          <Main />
          <NextScript> </NextScript>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
