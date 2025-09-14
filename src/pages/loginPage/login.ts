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
          this.setValidate('login', e);
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
          this.setValidate('password', e);
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
        this.signIn(values);
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

  private async signIn(values : Record<string, string>) {
    try {
      const response : {reason?:string} = await this.$api.post('https://ya-praktikum.tech/api/v2/auth/signin', {data: values})
      
      if(response.reason == 'User already in system') {
        await this.setUserData()
        this.nextLink('/mainPage')
        await this.setUserData()
      } else if(response.reason) {
        throw new Error(response.reason);
      }
      await this.setUserData()
      this.getUserData()
      this.nextLink('/mainPage')
    } catch {
      this.showError('Login or password is incorrect')
    } 
  }

  private async setUserData() {
    const data = await this.$api.get('https://ya-praktikum.tech/api/v2/auth/user')
    window.localStorage.setItem('userData', JSON.stringify(data))
  }
}
