import Page from "../../utils/Page";
import template from "./navigator.hbs";
import './navigator.scss';
const pages = [
  { name: "Авторизация", path: "/login" },
  { name: "Регистрация", path: "/register" },
  { name: "Главная", path: "/mainPage" },
  { name: "Профиль", path: "/profile" },
  { name: "Изменить данные", path: "/editProfile" },
  { name: "Ошибка 404", path: "/404" },
  { name: "Ошибка 500", path: "/500" }
];

export default class NavigatorPage extends Page {
  constructor() {
    super(template.toString(), { title: "Навигатор", pages });
  }
}