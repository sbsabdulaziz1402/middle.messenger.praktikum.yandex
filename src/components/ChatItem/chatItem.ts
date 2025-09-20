import Block from "../../utils/Block";
import template from "./chatItem.hbs";
import "./chatItem.scss";
import type { ChatData } from "../../utils/types";

export default class ChatItem extends Block {
  constructor(props: ChatData & { onClick?: () => void } ) {
    super("li", {
      ...props,
      events: {
        click: props.onClick
      }
    });
  }

  render() {
    return this.compile(template.toString(), this.props);
  }
}
