import Page from "../../utils/Page";
import Button from "../../components/Button/button";
import template from "./navigator.hbs";
import "./navigator.scss";
import Block from "../../utils/Block";

type PageLink = {
  name: string;
  path: string;
};

const pages: PageLink[] = [
  { name: "Авторизация", path: "/login" },
  { name: "Регистрация", path: "/register" },
  { name: "Главная", path: "/mainPage" },
  { name: "Профиль", path: "/profile" },
  { name: "Изменить данные", path: "/editProfile" },
  { name: "Ошибка 404", path: "/404" },
  { name: "Ошибка 500", path: "/500" },
];

export default class NavigatorPage extends Page {
  private pageComponents: Record<string, Block> = {
    loginLink: new Button({
      label: "Авторизация",
      className: "navigation-link",
      events: {
        click: ()=> {
          this.nextLink('/login')
        }
      },
    }),
    registerLink: new Button({
      label: "Регистрация",
      className: "navigation-link",
      events: {
        click: ()=> {
          this.nextLink('/register')
        }
      },
    }),
    messengerLink: new Button({
      label: "Главная",
      className: "navigation-link",
      events: {
        click: ()=> {
          this.nextLink('/mainPage')
        }
      },
    }),
    notFoundLink: new Button({
      label: "Открыть страницу 404",
      className: "navigation-link",
      events: {
        click: ()=> {
          this.nextLink('/404')
        }
      },
    }),
    errorLink: new Button({
      label: "Открыть страницу 500",
      className: "navigation-link",
      events: {
        click: ()=> {
          this.nextLink('/500')
        }
      },
    }),
  };

  constructor() {
    super(template.toString(), { title: "", template: template.toString() });
    super.initComponents(this.pageComponents);
  }
}
