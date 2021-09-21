import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css';

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  VueCropper,
  render: h => h(App)
}).$mount('#app')
