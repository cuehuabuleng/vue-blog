import Vue from 'vue';
import Router from 'vue-router';
import home from '../pages/home/home.vue'
import detail from '../pages/detail/detail.vue'
import login from '../pages/login/login.vue'
import register from '../pages/register/register.vue'
import tags from '../pages/tags/tags.vue'
import postarticle from '../pages/postarticle/postarticle'
import about from '../pages/aboutus/about.vue'
import articlemanagement from '../pages/articlesmanagement/management.vue' 
import edit from '../pages/edit/edit.vue'
import tagsdetail from '../pages/tagsdetail/tagsdetail'
import search from '../pages/search/search'
import resetpassword from '../pages/resetpassword/resetpw'
import setpassword from '../pages/resetpassword/setpassword'
import finishpassword from '../pages/resetpassword/finishpassword'
import NotFound from '../pages/nomatch/nomatch'
import ncov from '../pages/ncov/ncov'
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/home',
            name: 'home',
            component: home
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path:'/resetpassword',
            name:'resetpassword',
            component:resetpassword
        },
        {
            path:'/resetpassword/setpassword',
            name:'setpassword',
            component:setpassword
        },
        {
            path:'/resetpassword/finish',
            name:'finishpassword',
            component:finishpassword
        },
        {
            path: '/register',
            name: 'register',
            component: register
        },
        {
            path: '/detail/:id',
            name: 'detail',
            component: detail
        },
        {
            path: '/tags',
            name: 'tags',
            component: tags
        },
        {
            path:'/write',
            name:'postarticle',
            component:postarticle
        },
        {
            path:'/about',
            name:'about',
            component:about
        },
        {
            path:'/articlemanagement',
            name:'articlemanagement',
            component:articlemanagement
        },
        {
            path:'/edit',
            name:'edit',
            component:edit
        },
        {
            path: '/tags/:item',
            name: 'tagsdetail',
            component: tagsdetail
        },
        {
            path:'/search',
            name:'search',
            component:search
        },
        {
            path:'/ncov',
            name:'ncov',
            component:ncov
        },
        {
            path:'/nomatch',
            name:'nomatch',
            component:NotFound
        }
    ],
    //跳转路由的时候，返回到页面的最顶部最左部
    scrollBehavior() {
        return { x: 0, y: 0 }
    }
})