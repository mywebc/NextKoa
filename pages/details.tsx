import { Button } from "antd";
import Router from "next/router";

export default () => (
  <>
    <span>需求</span>
    <Button onClick={() => Router.push("/home")}>返回</Button>
  </>
);
