import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Clear from '../views/Clear.vue'
import Upload from '../views/Upload.vue'
import Image from '../views/Image.vue'
import GooglePhotosAlbumList from '../views/GooglePhotosAlbumList.vue'
import GooglePhotosAlbum from '../views/GooglePhotosAlbum.vue'
import Settings from '../views/Settings.vue'
import Usage from '../views/Usage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: About,
  },
  {
    path: '/clear',
    name: 'Clear',
    component: Clear,
  },
  {
    path: '/upload',
    name: 'Upload',
    component: Upload,
  },
  {
    path: '/image',
    name: 'Image',
    component: Image,
  },
  {
    path: '/google-photos',
    name: 'GooglePhotosAlbumList',
    component: GooglePhotosAlbumList,
  },
  {
    path: '/google-photos/album',
    name: 'GooglePhotosAlbum',
    component: GooglePhotosAlbum,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/usage',
    name: 'Usage',
    component: Usage,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
