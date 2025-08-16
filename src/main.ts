// import './style.css';
// import './styles/main.scss';
// import { render } from './App';
// import loginTemplate from './pages/loginPage/login.hbs';
// import registerTemplate from './pages/registerPage/register.hbs';
// import mainPageTemplate from './pages/mainPage/main-page.hbs'
// import { messengerContext } from './pages/mainPage/mainPage'
// import profileTemplate from './pages/profile/profilePage.hbs'
// import editTemplate from './pages/editProfile/editProfile.hbs'
// import page_404 from './pages/page_404/404.hbs'
// import page_500 from './pages/page_500/500.hbs'

// type RouteKey = keyof typeof routes;

// const routes = {
//   login: {
//     template: loginTemplate,
//     context: { login_title: 'Вход' },
//   },
//   register: {
//     template: registerTemplate,
//     context: { register_title: 'Регистрация' },
//   },
//   mainPage: {
//     template: mainPageTemplate,
//     context: { ...messengerContext },
//   },
//   profile: {
//     template: profileTemplate,
//     context: {username: 'Иван'}
//   },
//   editProfile: {
//     template: editTemplate,
//     context: {username: 'Иван'}
//   },
//   404: {
//     template: page_404,
//     context: {code: '404'}
//   },
//   500: {
//     template: page_500,
//     context: {code: '500'}
//   }
// };

// document.addEventListener('DOMContentLoaded', () => {
//   // Определи страницу по URL
//   let page = window.location.pathname.replace('.html', '').replace('/', '');
//   if (page === '') page = 'login'; // fallback на login

//   if( page in routes) {
//     const route = routes[page as RouteKey];
//     render(route.template.toString(), route.context);
//   } else {
//     console.error(`Страница ${page} не найдена`);
//   }
// });



import './style.css';
import './styles/main.scss';

// Импорт страниц
// import LoginPage from './pages/loginPage';
// import RegisterPage from './pages/registerPage';
// import MainPage from './pages/mainPage';
// import ProfilePage from './pages/profile';
import EditProfilePage from './pages/editProfile/index';
import Page404 from './pages/page_404/404.hbs';
import Page500 from './pages/page_500/500.hbs';

type RouteKey = keyof typeof routes;

// Словарь маршрутов -> классы страниц
const routes = {
  // login: LoginPage,
  // register: RegisterPage,
  // mainPage: MainPage,
  // profile: ProfilePage,
  editProfile: EditProfilePage,
  '404': Page404,
  '500': Page500
};

document.addEventListener('DOMContentLoaded', () => {
  let page = window.location.pathname.replace('.html', '').replace('/', '');
  if (page === '') page = 'login'; // по умолчанию

  if (page in routes) {
    const PageClass = routes[page as RouteKey];
    const pageInstance = new PageClass();
    pageInstance.mount('#app'); // <div id="app"></div> в index.html
  } else {
    console.error(`Страница ${page} не найдена`);
    const NotFoundPage = routes['404'];
    new NotFoundPage().mount('#app');
  }
});