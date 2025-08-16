import Page from "../../utils/Page";
import template from "./editProfile.hbs";
import Block from "../../utils/Block";
import Button from "../../components/Button/button";
import Input from "../../components/Input/input";
export default class EditProfilePage extends Page {
  private pageComponents: Record<string, Block> = {
      saveButton: new Button({
        label: "Сохранить",
        type: "submit",
        className: "profile-content__button form__button",
        events: {
          click: (e) => {
            e.preventDefault();
            console.log("Сохранить профиль");
          },
        },
      }),
      emailInput: new Input({
        label: "Почта",
        wrapperClassName: "profile-content__row",
        labelClassName: "profile-content__label",
        className: "form__input",
        name: "email",
        id: "email",
        inputType: "email",
        value: "ivanivanov"
      }),

      loginInput: new Input({
      label: "Логин",
      wrapperClassName: "profile-content__row",
      labelClassName: "profile-content__label",
      className: "form__input",
      name: "login",
      id: "login",
      inputType: "text",
      value: "ivanivanov",
    }),

    firstNameInput: new Input({
      label: "Имя",
      wrapperClassName: "profile-content__row",
      labelClassName: "profile-content__label",
      className: "form__input",
      name: "first_name",
      id: "first_name",
      inputType: "text",
      value: "Иван",
    }),

    secondNameInput: new Input({
      label: "Фамилия",
      wrapperClassName: "profile-content__row",
      labelClassName: "profile-content__label",
      className: "form__input",
      name: "second_name",
      id: "second_name",
      inputType: "text",
      value: "Иванов",
    }),

    displayNameInput: new Input({
      label: "Имя в чате",
      wrapperClassName: "profile-content__row",
      labelClassName: "profile-content__label",
      className: "form__input",
      name: "display_name",
      id: "display_name",
      inputType: "text",
      value: "Иван",
    }),

    phoneInput: new Input({
      label: "Телефон",
      wrapperClassName: "profile-content__row",
      labelClassName: "profile-content__label",
      className: "form__input",
      name: "phone",
      id: "phone",
      inputType: "text",
      value: "+7 (909) 967 30 30",
    }),

    oldPasswordInput: new Input({
      label: "Старый пароль",
      wrapperClassName: "profile-content__row",
      labelClassName: "profile-content__label",
      className: "form__input",
      name: "oldPassword",
      id: "oldPassword",
      inputType: "password",
    }),

    newPasswordInput: new Input({
      label: "Новый пароль",
      wrapperClassName: "profile-content__row",
      labelClassName: "profile-content__label",
      className: "form__input",
      name: "newPassword",
      id: "newPassword",
      inputType: "password",
    }),

    reTypePasswordInput: new Input({
      label: "Повторите новый пароль",
      wrapperClassName: "profile-content__row",
      labelClassName: "profile-content__label",
      className: "form__input",
      name: "reTypePassword",
      id: "reTypePassword",
      inputType: "password",
    }),

    };
  constructor() {
    super(template.toString(), { title: "Редактировать профиль" });
    super.initComponents(this.pageComponents);
  }
}