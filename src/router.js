import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import cookies from 'js-cookie'

const routes = [
  {
    path: '/',
    beforeEnter: (to, from, next) => cookies.get('access_token') ? next() : next('login'),
  },
  { path: '/login', component: Login },
  {
    path: '/callback',
    beforeEnter: (to, from, next) => {
      const params = new URLSearchParams(window.location.hash.substring(1));
      if (!params.get('error')) {
        cookies.set('access_token', params.get('access_token'), {
          'max-age': params.get('expires_in')
        });
      }
      next('/');
    }
  }
];

export default new VueRouter({
  mode: 'history',
  routes
});
