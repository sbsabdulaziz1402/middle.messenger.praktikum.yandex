import Page from "../../utils/Page";
import template from "./500.hbs";

export default class Error500Page extends Page {
  constructor() {
    super(template.toString(), {title: "ошибка"});
  };
};
