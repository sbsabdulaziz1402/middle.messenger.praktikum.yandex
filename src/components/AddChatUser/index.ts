import Block from "../../utils/Block";
import template from "./template.hbs";
import "./style.scss";

import Input from "../../components/Input/input";
import Button from "../../components/Button/button";
import { searchUserApi, addUserToChatApi } from "../../pages/mainPage/mainPage.api";

interface AddChatUserModalProps {
  chatId?: number | null;
  visible?: boolean;
  onClose?: () => void;
  children?: { [key: string]: Block };
  [key: string]: unknown;
}

export class AddChatUserModal extends Block<AddChatUserModalProps> {
  private addUserInput: Input;

  constructor(props: AddChatUserModalProps) {
    const addUserInput = new Input({
      id: "chatAddUserInput",
      name: "login",
      inputType: "text",
      label: "Введите логин пользователя",
      className: "chat-add-user-modal__input",
    });

    const addUserBtn = new Button({
      label: "Добавить",
      type: "button",
      className: "chat-add-user-modal__submit",
      events: {
        click: () => this.addUser(),
      }
    });

    super("div", {
      ...props,
      visible: false,
      children: {
        addUserInput,
        addUserBtn,
      },
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.id === "closeAddUser") {
            this.hide();
            props.onClose?.();
          }
        },
      },
    });

    this.addUserInput = addUserInput;
  }

  public show(chatId: number) {
    this.setProps({ chatId, visible: true });
    this.getContent()?.classList.remove("hidden");
  }

  public hide() {
    this.setProps({ visible: false });
    this.getContent()?.classList.add("hidden");
  }

  private async addUser() {
    const inputEl = this.addUserInput.getContent()?.querySelector("input") as HTMLInputElement;
    if (!inputEl || !inputEl.value.trim()) {
      console.log("Введите логин", "error");
      return;
    }

    try {
      const users = await searchUserApi(inputEl.value.trim());

      if (!users || users.length === 0) {
        console.log("Пользователь не найден", "error");
        return;
      }

      const userId = users[0].id;
      await addUserToChatApi(this.props.chatId!, userId);

      console.log("Пользователь добавлен", "success");
      this.hide();
      inputEl.value = "";
    } catch {
      console.log("Ошибка при добавлении", "error");
    }
  }

  render() {
    const el = this.compile(template.toString(), this.props);
    Object.entries(this.props.children || {}).forEach(([id, component]) => {
      const placeholder = el.querySelector(`#${id}`);
      if (placeholder && component instanceof Block) {
        placeholder.replaceWith(component.getContent()!);
      }
    });
    return el;
  }
}
