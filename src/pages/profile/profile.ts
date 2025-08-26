import Page from "../../utils/Page";
import template from "./profilePage.hbs";

export default class ProfilePage extends Page {
  constructor() {
    super(template.toString(), {title: "Профиль"});
  };
};
