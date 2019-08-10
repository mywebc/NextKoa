import "../static/styles/test.css";
import { Button } from "antd";
import Link from "next/link";

export default () => (
  <Link href="/details">
    <Button className="test">link</Button>
  </Link>
);
