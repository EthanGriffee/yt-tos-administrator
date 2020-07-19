import Vue from 'vue'
import App from './App.vue'
import Game from './components/Game.vue'
import GameList from './components/GameList.vue'
import Upload from './components/Upload.vue'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import "bootstrap";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPoo, faTrophy, faAward, faTimes} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


library.add(faPoo, faTrophy, faAward, faTimes)


Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(BootstrapVue)
Vue.use(VueRouter);
Vue.config.productionTip = false


const router = new VueRouter({
  mode: 'history',
  routes: [
    { 
      path:"*", 
      redirect: { name: 'upload' }
    },
    {
      path:"/games/:id",
      component: Game,
      name: "gameItem",
      meta: {
        title: () => {return 'Game - GeneralPeanut'}
      }
    },
    {
      path:"/games",
      component: GameList,
      meta: {
        title: () => {return 'Games - GeneralPeanut'}
      }
    },
    {
      path:"/upload",
      name:'upload',
      component: Upload,
      meta: {
        title: () => {return 'Upload - GeneralPeanut'}
      }
    }
  ]
})

router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title(to)
  })
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
