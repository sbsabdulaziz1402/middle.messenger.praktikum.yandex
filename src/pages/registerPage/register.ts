import Page from "../../utils/Page";
import template from "./register.hbs";
import Block from "../../utils/Block";
import Button from "../../components/Button/button";
import Input from "../../components/Input/input";
import { validateField } from "../../utils/validation";

export default class RegisterPage extends Page {
  private pageComponents: Record<string, Block> = {
    logInButton: new Button({
      label: "Зарегистрироваться",
      type: "submit",
      className: " auth-page__button",
      events: {
        click: (e) => {
          e.preventDefault();
          this.getFormData();
        },
      },
    }),

    emailInput: new Input({
      label: "Почта",
      wrapperClassName: "auth-page__input-wrapper",
      labelClassName: "auth-page__label",
      className: "auth-page__input",
      name: "email",
      id: "email",
      inputType: "email",
      events: {
        blur: (e) => {
          this.setValidate('emailInput', 'email', e);
        }
      }
    }),

    loginInput: new Input({
      label: "Логин",
      wrapperClassName: "auth-page__input-wrapper",
      labelClassName: "auth-page__label",
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

    firstNameInput: new Input({
      label: "Имя",
      wrapperClassName: "auth-page__input-wrapper",
      labelClassName: "auth-page__label",
      className: "auth-page__input",
      name: "first_name",
      id: "first_name",
      inputType: "text",
      events: {
        blur: (e) => {
          this.setValidate('firstNameInput', 'first_name', e);
        }
      }
    }),

    secondNameInput: new Input({
      label: "Фамилия",
      wrapperClassName: "auth-page__input-wrapper",
      labelClassName: "auth-page__label",
      className: "auth-page__input",
      name: "second_name",
      id: "second_name",
      inputType: "text",
      events: {
        blur: (e) => {
          this.setValidate('secondNameInput', 'second_name', e);
        }
      }
    }),

    phoneInput: new Input({
      label: "Телефон",
      wrapperClassName: "auth-page__input-wrapper",
      labelClassName: "auth-page__label",
      className: "auth-page__input",
      name: "phone",
      id: "phone",
      inputType: "text",
      events: {
        blur: (e) => {
          this.setValidate('phoneInput', 'phone', e);
        }
      }
    }),

    passwordInput: new Input({
      label: "Новый пароль",
      wrapperClassName: "auth-page__input-wrapper",
      labelClassName: "auth-page__label",
      className: "auth-page__input",
      name: "newPassword",
      id: "newPassword",
      inputType: "password",
      events: {
        blur: (e) => {
          this.setValidate('passwordInput', 'password', e);
        }
      }
    }),

    reTypePasswordInput: new Input({
      label: "Повторите новый пароль",
      wrapperClassName: "auth-page__input-wrapper",
      labelClassName: "auth-page__label",
      className: "auth-page__input",
      name: "reTypePassword",
      id: "reTypePassword",
      inputType: "password",
      events: {
        blur: (e) => {
          this.setValidate('reTypePasswordInput', 'password', e);
        }
      }
    })
  };

  constructor() {
    super(template.toString(), { title: "Регистрация" });
    super.initComponents(this.pageComponents);
  };

  getFormData() {
    const form = document.getElementById('register-form') as HTMLFormElement;
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