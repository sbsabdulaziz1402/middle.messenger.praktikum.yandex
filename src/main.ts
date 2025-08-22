import './style.css';
import './styles/main.scss';


import LoginPage from './pages/loginPage/login';
import RegisterPage from './pages/registerPage/register';
import MainPage from './pages/mainPage/mainPage';
import ProfilePage from './pages/profile/profile';
import EditProfilePage from './pages/editProfile/index';
import Error404Page from './pages/page_404/index';
import Page500 from './pages/page_500/index';
import NavigatorPage from './pages/navigator/index';

type RouteKey = keyof typeof routes;


const routes = {
  login: LoginPage,
  register: RegisterPage,
  mainPage: MainPage,
  profile: ProfilePage,
  editProfile: EditProfilePage,
  '404': Error404Page,
  '500': Page500,
  navigator: NavigatorPage
};

document.addEventListener('DOMContentLoaded', () => {
  let page = window.location.pathname.replace('.html', '').replace('/', '');
  if (page === '') page = 'navigator';

  if (page in routes) {
    const PageClass = routes[page as RouteKey];
    const pageInstance = new PageClass();
    pageInstance.mount('#app');
  } else {
    console.error(`Страница ${page} не найдена`);
  }
});