import Vue from 'vue'
import VueRouter from 'vue-router'
import VueYoutube from 'vue-youtube'
import App from './App.vue'
import router from './router'

Vue.use(VueRouter)
Vue.use(VueYoutube)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
