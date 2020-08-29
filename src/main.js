// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/index'


import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

// const options = {
  // You can set your default options here
// };

Vue.config.productionTip = false
// Vue.use(Toast,options);

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
