import Vue from 'vue'
import VueRouter from 'vue-router'
import TodosView from '../views/TodosView.vue'
import NotFoundView from '../views/NotFoundView.vue'
// import OneWordView from '../views/OneWordView.vue'
import WelcomeView from '../views/WelcomeView.vue'
import DoneView from '../views/DoneView.vue'
import CatTodoView from '../views/CatTodoView.vue'
import CatDoneView from '../views/CatDoneView.vue'
import SearchView from '../views/SearchView.vue'
import {auth} from "@/firebaseConfig.js"


Vue.use(VueRouter)

const routes = [
  {
    path: '/todos',
    name: 'todos',
    component: TodosView
  },
  {
    path: '/done',
    name: 'done',
    component: DoneView
  },
  {
    path: '/todos/:category',
    name: 'catTodos',
    component: CatTodoView,
    props:true
  },
  {
    path: '/done/:category',
    name: 'catDone',
    component: CatDoneView,
    props:true
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/',
    name: 'login',
    component: WelcomeView
  },

  {
    path: '/search',
    name: 'search',
    component: SearchView,
    meta: { title: 'Snippets'} 
  },
  {
    path: '*',
    name: '404',
    component: NotFoundView
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // jump to login page if not logged in
  if (to.name !== 'login' && !auth.currentUser) {
    next('/')
  }else if (to.name == 'login'&& auth.currentUser) {
     next('/search')
  }
  next()
})

export default router
