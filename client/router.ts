import Vue from 'vue';
import VueRouter from 'vue-router';
import PostsPage from './components/Post/PostsPage.vue';
import CreatePostPage from './components/Post/CreatePostPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import ProfilePage from './components/Profile/ProfilePage.vue';
import RecommendationsPage from './components/Recommendations/recommendationsPage.vue';
import CreateRemixPage from './components/Remix/CreateRemixPage.vue';
import RemixesPage from './components/Remix/RemixesPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: PostsPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/create', name: 'Create Post', component: CreatePostPage},
  {path: '/profile', name: 'Profile', component: ProfilePage},
  {path: '/recommendations', name: 'Recommendations', component: RecommendationsPage},
  {path: '/make-remix/:postId', name:'Create Remix', component: CreateRemixPage},
  {path: '/remixes', name:'Remixes', component: RemixesPage},
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