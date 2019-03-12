import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/link-sales'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: 'Home' },
            children:[
                // {
                //     path: '/dashboard',
                //     component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                //     meta: { title: '系统首页' }
                // },
                {
                    path: '/link-sales',
                    component: resolve => require(['../components/page/LinkSales.vue'], resolve),
                    meta: { title: 'Link Sales' }
                },
                {
                    path: '/lrl-fast',
                    component: resolve => require(['../components/page/LRLFast.vue'], resolve),
                    meta: { title: 'LRL Fast' }
                },
            ]
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
