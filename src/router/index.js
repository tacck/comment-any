import Vue from 'vue'
import VueRouter from 'vue-router'
import { Auth } from 'aws-amplify'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: { isPublic: true },
  },
  {
    path: '/event/:eventId',
    name: 'EventDetail',
    component: () =>
      import(/* webpackChunkName: "event" */ '../views/EventDetail.vue'),
    props: true,
  },
  {
    path: '/',
    name: 'Event',
    component: () =>
      import(/* webpackChunkName: "event" */ '../views/Event.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach(async (to, from, next) => {
  const user = await Auth.currentUserInfo()
  store.commit('setUser', user)
  if (to.matched.some(record => !record.meta.isPublic) && user === null) {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
