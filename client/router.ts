import Vue from 'vue';
import VueRouter from 'vue-router';
import PostsPage from './components/Post/PostsPage.vue';
import CreatePostPage from './components/Post/CreatePostPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import SearchPage from './components/Search/SearchPage.vue';
import ProfilePage from './components/Profile/ProfilePage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: PostsPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/browse', name: 'Browse', component: SearchPage},
  {path: '/create', name: 'Create Post', component: CreatePostPage},
  {path: '/profile', name: 'Profile', component: ProfilePage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }

    if (to.name === 'Create Post' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Create Post and are not signed in
      return;
    }
  }

  next();
});

export default router;