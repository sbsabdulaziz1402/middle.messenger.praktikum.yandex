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
      value:"abdulaziz1401@gmail.com",
      inputType: "email",
      events: {
        blur: (e) => {
          this.setValidate('email', e);
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
      value:"abdulaziz1401",
      inputType: "text",
      events: {
        blur: (e) => {
          this.setValidate('login', e);
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
      value:"Aziz",
      inputType: "text",
      events: {
        blur: (e) => {
          this.setValidate('first_name', e);
        }
      }
    }),

    secondNameInput: new Input({
      label: "Фамилия",
      wrapperClassName: "auth-page__input-wrapper",
      labelClassName: "auth-page__label",
      className: "auth-page__input",
      name: "second_name",
      value:"Bek",
      id: "second_name",
      inputType: "text",
      events: {
        blur: (e) => {
          this.setValidate('second_name', e);
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
      value:"998900000000",
      inputType: "text",
      events: {
        blur: (e) => {
          this.setValidate('phone', e);
        }
      }
    }),

    passwordInput: new Input({
      label: "Новый пароль",
      wrapperClassName: "auth-page__input-wrapper",
      labelClassName: "auth-page__label",
      className: "auth-page__input",
      name: "password",
      value:"Abdulaziz1401",
      id: "password",
      inputType: "password",
      events: {
        blur: (e) => {
          this.setValidate('password', e);
        }
      }
    }),

    reTypePasswordInput: new Input({
      label: "Повторите новый пароль",
      wrapperClassName: "auth-page__input-wrapper",
      labelClassName: "auth-page__label",
      className: "auth-page__input",
      name: "reTypePassword",
      value:"Abdulaziz1401",
      id: "reTypePassword",
      inputType: "password",
      events: {
        blur: (e) => {
          this.setValidate('password', e);
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
    if (form) {
      const formData = new FormData(form);
      const values: Record<string, string> = {};
      const validationErrors: string[] = [];

      formData.forEach((value, key) => {
        values[key] = value.toString();
        const errors = validateField(key, value.toString());
        if (!errors.isValid) {
          validationErrors.push(errors.error);
          this.showError(errors.error);
        }
      });

      if (validationErrors.length === 0) {
        this.signUpPost(values);
        console.log("Форма прошла валидацию ✅", values);
      } else {
        console.log("Форма не прошла валидацию ❌");
      }
    }
  }

  private setValidate(inputName: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const errorData = validateField(inputName, target.value);
    if(!errorData.isValid) {
      this.showError(errorData.error);
    }
  };

  private async signUpPost(values : Record<string, string>) {
    this.$api.post<{id: number}>('https://ya-praktikum.tech/api/v2/auth/signup', {data: values}).then((res)=>{
      if(res.id != null) {
        this.nextLink('/login')
      }
    })
  }
}
