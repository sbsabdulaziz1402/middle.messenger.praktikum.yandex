import './style.css';
import './styles/main.scss';
import { render } from './App.js';
import loginTemplate from './pages/loginPage/login.hbs';
import registerTemplate from './pages/registerPage/register.hbs';
import mainPageTemplate from './pages/mainPage/main-page.hbs'
import { messengerContext } from './pages/mainPage/mainPage.js'
import profileTemplate from './pages/profile/profilePage.hbs'
import editTemplate from './pages/editProfile/editProfile.hbs'
import page_404 from './pages/page_404/404.hbs'
import page_500 from './pages/page_500/500.hbs'
import { log, template } from 'handlebars';



const routes = {
  login: {
    template: loginTemplate,
    context: { login_title: 'Вход' },
  },
  register: {
    template: registerTemplate,
    context: { register_title: 'Регистрация' },
  },
  mainPage: {
    template: mainPageTemplate,
    context: { ...messengerContext },
  },
  profile: {
    template: profileTemplate,
    context: {username: 'Иван'}
  },
  editProfile: {
    template: editTemplate,
    context: {username: 'Иван'}
  },
  404: {
    template: page_404,
    context: {code: '404'}
  },
  500: {
    template: page_500,
    context: {code: '500'}
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Определи страницу по URL
  let page = window.location.pathname.replace('.html', '').replace('/', '');
  if (page === '') page = 'login'; // fallback на login

  const route = routes[page];
  if (route) {
    render(route.template, route.context);
  } else {
    console.error(`Страница ${page} не найдена`);
  }
});
