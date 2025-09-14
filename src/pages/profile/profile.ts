import Page from "../../utils/Page";
import template from "./profilePage.hbs";
import Button from "../../components/Button/button";
import HTTPTransport from "../../utils/FetchAPI";
export default class ProfilePage extends Page {
  pageComponents = {
      editButton: new Button({
          label: "Изменить данные",
          className: "profile-content__link profile-content__link-edit",
          events: {
            click: () => {
              this.nextLink('/settings')
            } 
          },
      }),
      logoutButton: new Button({
          label: "Выйти",
          className: "profile-content__link profile-content__link-logout",
          events: {
              click: () => this.logOut(),
          },
      }),
      returnButton: new Button({
        icon: 'leftArrow.svg',
        className: "profile__sidebar-icon",
        events: {
            click: () => {
              this.nextLink('/messenger')
            },
        },
      }),
  };
  constructor() {
    const user = JSON.parse(window.localStorage.getItem('userData') || "{}")
    super(template.toString(), {title: "Профиль", ...user, avatar: 'https://ya-praktikum.tech/api/v2/resources'+user.avatar});
    super.initComponents(this.pageComponents);
  };

  private async logOut () {
    const $api = new HTTPTransport ();
    await $api.post("https://ya-praktikum.tech/api/v2/auth/logout");
    window.localStorage.removeItem('userData')
    this.nextLink('/')
  }
};
