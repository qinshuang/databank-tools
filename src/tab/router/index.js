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
                    path: '/contact-analysis',
                    component: resolve => require(['../components/page/ContactAnalysis.vue'], resolve),
                    meta: { title: 'Contact Analysis' }
                },
                {
                    path: '/lrl-fast',
                    component: resolve => require(['../components/page/LRLFast.vue'], resolve),
                    meta: { title: 'LRL Fast' }
                },
                {
                    path: '/full-link-distribution',
                    component: resolve => require(['../components/page/FullLinkDistribution.vue'], resolve),
                    meta: { title: 'AIPL趋势' }
                },
                {
                    path: '/get-data-on-widget-v2',
                    component: resolve => require(['../components/page/GetDataOnWidgetV2.vue'], resolve),
                    meta: { title: '相关性分析' }
                }
            ]
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
