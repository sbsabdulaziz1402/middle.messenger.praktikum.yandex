import Page from "../../utils/Page";
import Button from "../../components/Button/button";
import template from "./navigator.hbs";
import "./navigator.scss";
import Block from "../../utils/Block";


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
