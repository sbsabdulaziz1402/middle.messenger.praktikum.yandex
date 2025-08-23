const chats = [
  { name: 'Чат 1' },
  { name: 'Чат 2' },
  { name: 'Чат 3' }
];

const messages = [
  { text: 'Привет!', isOutgoing: false },
  { text: 'Здравствуйте, как дела?', isOutgoing: true },
  { text: 'Всё хорошо, спасибо!', isOutgoing: false },
  { text: 'Отлично!', isOutgoing: true }
];

const messengerContext = {
  activeChatTitle: 'Чат 1',
  chats,
  messages
};

import Page from "../../utils/Page";
import template from "./mainPage.hbs";
import ChatItem from "../../components/ChatItem/chatItem";
import Block from "../../utils/Block";
import Button from "../../components/Button/button";
import Input from "../../components/Input/input";
import { validateField } from "../../utils/validation";

export default class MainPage extends Page {
  private pageComponents: Record<string, Block> = {
    sendButton: new Button({
      icon: "MdiSend.svg",
      type: "submit",
      className: "message-input-form__button",
      events: {
        click: (e) => {
          e.preventDefault();
          this.getFormData();
        },
      },
    }),
    messageInput: new Input({
      wrapperClassName: "full-wrapper",
      className: "message-input-form__input",
      name: "message",
      id: "message",
      inputType: "text",
    })
  };
  
  constructor() {
    const chatsList = chats.map((el) => {return new ChatItem(el).getContent()?.outerHTML}).join("");
    super(template.toString(), {title: "Основной", ...messengerContext, chatsList});
    super.initComponents(this.pageComponents);
  };

  getFormData() {
    const form = document.getElementById('chat-message-form') as HTMLFormElement;
    if(form) {
      const formData = new FormData(form);
      const values: Record<string, string> = {};
      formData.forEach((value, key) => {
        values[key] = value.toString();
        const errors = validateField(key, value.toString());
        if (!errors.isValid) {
            this.showError(errors.error);
        } else {
          console.log("Форма прошла валидацию ✅", values);
        }
      });
    }
  };
};
