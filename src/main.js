import Vue from 'vue'
import VueMoment from 'vue-moment'
import VueRouter from 'vue-router'
import VueYoutube from 'vue-youtube'
import App from './App.vue'
import cookies from 'js-cookie'
import router from './router'

Vue.use(VueMoment)
Vue.use(VueRouter)
Vue.use(VueYoutube)

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    fetch(input, init) {
      const authorization = `Bearer ${cookies.get('access_token')}`;
      return fetch(input, Object.assign({ headers: { authorization }}, init));
    },
    logout() {
      cookies.remove('access_token');
    },
  }
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
