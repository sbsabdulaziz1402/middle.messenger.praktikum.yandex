import Page from "../../utils/Page";
import template from "./404.hbs";

export default class Error404Page extends Page {
  constructor() {
    super(template.toString(), {title: "ошибка"});
  };
};