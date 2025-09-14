import Page from "../../utils/Page";
import template from "./editProfile.hbs";
import Block from "../../utils/Block";
import Button from "../../components/Button/button";
import Input from "../../components/Input/input";
import { validateField } from "../../utils/validation";
import { updateProfile, updatePassword, updateAvatar } from "./api";

export default class EditProfilePage extends Page {
  private pageComponents: Record<string, Block> = {
    saveButton: new Button({
      label: "Сохранить",
      type: "submit",
      className: "profile-content__button form__button",
      events: {
        click: (e) => {
          e.preventDefault();
          this.getFormData();
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
      value: this.user?.email,
      events: {
        blur: (e) => {
          this.setValidate('email', e);
        }
      }
    }),

    loginInput: new Input({
      label: "Логин",
      wrapperClassName: "profile-content__row",
      labelClassName: "profile-content__label",
      className: "form__input",
      name: "login",
      id: "login",
      inputType: "text",
      value: this.user?.login,
      events: {
        blur: (e) => {
          this.setValidate('login', e);
        }
      }
    }),

    firstNameInput: new Input({
      label: "Имя",
      wrapperClassName: "profile-content__row",
      labelClassName: "profile-content__label",
      className: "form__input",
      name: "first_name",
      id: "first_name",
      inputType: "text",
      value: this.user?.first_name,
      events: {
        blur: (e) => {
          this.setValidate('first_name', e);
        }
      }
    }),

    secondNameInput: new Input({
      label: "Фамилия",
      wrapperClassName: "profile-content__row",
      labelClassName: "profile-content__label",
      className: "form__input",
      name: "second_name",
      id: "second_name",
      inputType: "text",
      value: this.user?.second_name,
      events: {
        blur: (e) => {
          this.setValidate('second_name', e);
        }
      }
    }),

    displayNameInput: new Input({
      label: "Имя в чате",
      wrapperClassName: "profile-content__row",
      labelClassName: "profile-content__label",
      className: "form__input",
      name: "display_name",
      id: "display_name",
      inputType: "text",
      value: this.user?.display_name,
    }),

    phoneInput: new Input({
      label: "Телефон",
      wrapperClassName: "profile-content__row",
      labelClassName: "profile-content__label",
      className: "form__input",
      name: "phone",
      id: "phone",
      inputType: "text",
      value: this.user?.phone,
      events: {
        blur: (e) => {
          this.setValidate('phone', e);
        }
      }
    }),

    oldPasswordInput: new Input({
      label: "Старый пароль",
      wrapperClassName: "profile-content__row",
      labelClassName: "profile-content__label",
      className: "form__input",
      name: "oldPassword",
      id: "oldPassword",
      inputType: "password",
      events: {
        blur: (e) => {
          this.setValidate('password', e);
        }
      }
    }),

    newPasswordInput: new Input({
      label: "Новый пароль",
      wrapperClassName: "profile-content__row",
      labelClassName: "profile-content__label",
      className: "form__input",
      name: "newPassword",
      id: "newPassword",
      inputType: "password",
      events: {
        blur: (e) => {
          this.setValidate('password', e);
        }
      }
    }),

    avatarInput: new Input({
      name: "Avatar",
      id: "avatar",
      accept:".png, .jpeg, .jpg",
      inputType: "file",
      value: this.user?.avatar,
      events: {
        change: async () => {
          const avatarInput = document.getElementById("avatar") as HTMLInputElement;
          if (avatarInput?.files?.[0]) {
            const avatarFormData = new FormData();
            avatarFormData.append("avatar", avatarInput.files[0]);
            const new_avatar = await updateAvatar(avatarFormData);
            window.localStorage.setItem('userData', JSON.stringify(new_avatar))
          }
        }
      }
    }),

    returnButton: new Button({
      icon: 'leftArrow.svg',
      className: "profile__sidebar-icon",
      events: {
          click: () => {
            this.nextLink('/profile')
          },
      },
    }),

  };
  constructor() {
    const user = JSON.parse(window.localStorage.getItem('userData') || "{}")
    super(template.toString(), { title: "Редактировать профиль", ...user, avatar: 'https://ya-praktikum.tech/api/v2/resources'+user.avatar});
    super.initComponents(this.pageComponents);
  }
  getFormData() {
    const form = document.getElementById('edit-profile-form') as HTMLFormElement;
    if(form) {
      const formData = new FormData(form)
      const values: Record<string, string> = {}
      const errorsList = []
      formData.forEach((value, key) => {
        values[key] = value.toString()
        if(key === 'oldPassword'&&values[key].length==0 || key === 'newPassword'&&values[key].length==0) {
          return
        }
        const errors = validateField(key, value.toString())
        if (!errors.isValid) {
            this.showError(errors.error)
            errorsList.push(errors.error)
        }
      });

      if(!errorsList.length) {
        this.saveChages(values)
      }
    }
  };

  private setValidate(inputName: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const errorData = validateField(inputName, target.value);
    if(!errorData.isValid) {
      this.showError(errorData.error);
    }
  }

  private async saveChages(values : Record<string, string>) {
    try {
      await updateProfile({
        email: values.email,
        login: values.login,
        first_name: values.first_name,
        second_name: values.second_name,
        display_name: values.display_name,
        phone: values.phone,
      });

      if (values.oldPassword && values.newPassword) {
        await updatePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        });
      }

    } catch (e) {
      console.error("Ошибка при обновлении профиля:", e);
    }
  }

}
