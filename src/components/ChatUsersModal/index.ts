import Block from "../../utils/Block";
import template from "./template.hbs";
import "./style.scss";
import { ChatUsersModalProps } from "../../utils/types";

export class ChatUsersModal extends Block<ChatUsersModalProps> {
  constructor(props: ChatUsersModalProps) {
    super("div", {
      ...props,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;

          if (target.id === "closeChatUsersModal") {
            this.hide();
            this.props.onClose?.();
          }

          if (target.classList.contains("remove-user-btn")) {
            const userId = Number(target.dataset.userId);
            if (this.props.chatId && userId && this.props.onRemoveUser) {
              this.props.onRemoveUser(this.props.chatId, userId);
            }
          }
        },
      },
    });
  }

  public show(chatId: number, users: ChatUsersModalProps["users"]) {
    this.setProps({ chatId, users });
    this.getContent()?.classList.remove("hidden");
  }

  public hide() {
    this.getContent()?.classList.add("hidden");
  }

  render() {
    return this.compile(template.toString(), this.props);
  }
}
