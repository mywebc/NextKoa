import { cloneElement } from "react";

const style = {
  width: "100%",
  maxWidth: 1200,
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: 20,
  paddingRight: 20
};
// cloneElement 能够很方便的帮我们扩展节点
export default ({ children, renderer = <div /> }) => {
  const newElement = cloneElement(renderer, {
    style: Object.assign({}, renderer.props.style, style),
    children
  });

  return newElement;

};
