import Page from "../../utils/Page";
import Block from "../../utils/Block";
import Button from "../Button/button";
import Input from "../Input/input";
import template from "./template.hbs";
import "./style.scss";

interface AddChatModalProps {
  onSave: (title: string) => void;
  onClose: () => void;
  visible?: boolean;
}

export class AddChatModal extends Page {
  constructor(props: AddChatModalProps) {
    const children = {
      chatTitleInput: new Input({
        className: "add-chat-modal__body-input",
        id: "chatTitle",
        inputType: "text",
        name: "title",
      }),
      addChatModalSubmit: new Button({
        label: "Создать",
        type: "button",
        className: "add-chat-modal__body-submit",
        id: "saveAddChatModal",
        events: {
          click: (e) => {
            e.preventDefault();
            const input = this.element?.querySelector<HTMLInputElement>("#chatTitle");
            const title = input?.value.trim();
            if (title) {
              props.onSave?.(title);
            }
            this.hide();
          }
        }
      }),
    };

    super(template.toString(), {
      ...props,
      children,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.id === "closeAddChatModal") {
            this.hide();
            props.onClose?.();
          }
        },
      },
    });
    super.initComponents(children);
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

  public show() {
    this.getContent()?.classList.remove("hidden");
  }

  public hide() {
    this.getContent()?.classList.add("hidden");
  }
}
