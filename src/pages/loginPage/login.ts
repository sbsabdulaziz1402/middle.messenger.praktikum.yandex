import Page from "../../utils/Page";
import template from "./login.hbs";
import Block from "../../utils/Block";
import Button from "../../components/Button/button";
import Input from "../../components/Input/input";
import { validateField } from "../../utils/validation";
export default class LoginPage extends Page {
  private pageComponents: Record<string, Block> = {
    saveButton: new Button({
      label: "Войти",
      type: "submit",
      className: " auth-page__button",
      events: {
        click: (e) => {
          e.preventDefault();
          this.getFormData();
        },
      },
    }),

    loginInput: new Input({
      label: "Логин",
      labelClassName: "auth-page__label",
      wrapperClassName: "auth-page__input-wrapper",
      className: "auth-page__input",
      name: "login",
      id: "login",
      inputType: "text",
      events: {
        blur: (e) => {
          this.setValidate('loginInput', 'login', e);
        }
      }
    }),

    passwordInput: new Input({
      label: "Пароль",
      wrapperClassName: "auth-page__input-wrapper",
      labelClassName: "auth-page__label",
      className: "auth-page__input",
      name: "password",
      id: "password",
      inputType: "password",
      events: {
        blur: (e) => {
          this.setValidate('passwordInput', 'password', e);
        }
      }
    }),
  };

  constructor() {
    super(template.toString(), { title: "Авторизация" });
    super.initComponents(this.pageComponents);
  };

  getFormData() {
    const form = document.getElementById('log-in-form') as HTMLFormElement;
    if(form) {
      const formData = new FormData(form)
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

  private setValidate(componenentName: string, inputName: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const errorData = validateField(inputName, target.value);
    if(!errorData.isValid) {
      this.showError(errorData.error);
    }
  };
}