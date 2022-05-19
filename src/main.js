import Vue from 'vue'
import App from './App.vue'
import router from './router'
import InstantSearch from 'vue-instantsearch'
import { firestorePlugin } from 'vuefire'
import { auth } from '@/firebaseConfig.js'
import './registerServiceWorker'
import Vuesax from 'vuesax'
// import vuePlugin from "@highlightjs/vue-plugin";

import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/androidstudio.css' // or other highlight.js theme

// import VueElementLoading from 'vue-element-loading'

// Vue.component('VueElementLoading', ElementLoading)

// Tell Vue.js to use vue-highlightjs
Vue.use(VueHighlightJS)

Vue.config.productionTip = false

// Vue.use(vuePlugin);
Vue.use(Vuesax)
Vue.use(firestorePlugin)
Vue.use(InstantSearch)

let app
auth.onAuthStateChanged(()=>{
    if (!app) {
        new Vue({
            router,
            render: h => h(App)
        }).$mount('#app')
    }  
});