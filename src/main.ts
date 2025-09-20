import './style.scss';
import './styles/main.scss';


import LoginPage from './pages/loginPage/login';
import RegisterPage from './pages/registerPage/register';
import MainPage from './pages/mainPage/mainPage';
import ProfilePage from './pages/profile/profile';
import EditProfilePage from './pages/editProfile/index';
import Error404Page from './pages/page_404/index';
import Page500 from './pages/page_500/index';
import NavigatorPage from './pages/navigator/index';
import Router from './utils/Router';


const routerCore = new Router('#app')


routerCore
  .use('/navigation', NavigatorPage)
  .use('/', LoginPage)
  .use('/sign-up', RegisterPage)
  .use('/messenger', MainPage)
  .use('/profile', ProfilePage)
  .use('/settings', EditProfilePage)
  .use('/404', Error404Page)
  .use('/500', Page500);

routerCore.start();
