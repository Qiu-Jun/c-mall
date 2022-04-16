/*
 * :Author: June
 * :Date: 2022-03-07 02:12:16
 * :LastEditTime: 2022-03-30 15:32:16
 * :Description:
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

export const constantRoutes = [
    {
        path: '/redirect/:path(.*)',
        hidden: true,
        component: () => import('@/pages/redirect/index.vue'),
        meta: {
            noCache: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/login/index.vue')
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/pages/dashboard/index.vue'),
                meta: {
                    title: '控制面板',
                    affix: true,
                    icon: 'home'
                }
            }
        ]
    },
    {
        path: '/order',
        component: Layout,
        redirect: '/order/index',
        name: 'order',
        meta: {
            title: '订单面板',
            icon: 'order'
        },
        children: [
            {
                path: 'goodsManage',
                component: () => import('@/pages/order/index.vue'),
                name: 'orders',
                meta: { title: '订单', icon: 'order' }
            }
        ]
    },
    {
        path: '/order/detail',
        hidden: true,
        redirect: '/order/detail/index',
        meta: { noCache: true },
        component: Layout,
        children: [
            {
                path: 'index',
                component: () => import('@/pages/order/detail.vue'),
                name: 'orderDetail',
                meta: { title: '订单详情' }
            }
        ]
    },
    {
        path: '/goods',
        component: Layout,
        redirect: '/goods/goodsManage',
        name: 'goods',
        meta: {
            title: '商品',
            icon: 'goods'
        },
        children: [
            {
                path: 'goodsManage',
                component: () => import('@/pages/goods/goods/index.vue'),
                name: 'goodsManage',
                meta: { title: '商品管理' }
            },
            {
                path: 'cateManage',
                component: () => import('@/pages/goods/cate/index.vue'),
                name: 'cateManage',
                meta: { title: '类目管理' }
            }
        ]
    },
    {
        path: '/goods/view',
        hidden: true,
        redirect: '/goods/view/index',
        meta: { noCache: true },
        component: Layout,
        children: [
            {
                path: 'index',
                component: () => import('@/pages/goods/goods/view.vue'),
                name: 'goodsView',
                meta: { title: '商品详情' }
            }
        ]
    },
    {
        path: '/goods/edit',
        hidden: true,
        redirect: '/goods/edit/index',
        meta: { noCache: true },
        component: Layout,
        children: [
            {
                path: 'index',
                component: () => import('@/pages/goods/goods/edit.vue'),
                name: 'goodsEdit',
                meta: { title: '编辑商品', noCache: true }
            }
        ]
    },
    {
        path: '/goods/add',
        hidden: true,
        redirect: '/goods/add/index',
        meta: { noCache: true },
        component: Layout,
        children: [
            {
                path: 'index',
                component: () => import('@/pages/goods/goods/add.vue'),
                name: 'goodsAdd',
                meta: { title: '新增商品', noCache: true }
            }
        ]
    },
    {
        path: '/logistics',
        component: Layout,
        redirect: '/logistics/logisticsCase',
        name: 'Logistics',
        meta: {
            title: '物流',
            icon: 'logistics'
        },
        children: [
            {
                path: 'logisticsCase',
                component: () => import('@/pages/logistics/case.vue'),
                name: 'case',
                meta: { title: '运费方案' }
            },
            {
                path: 'logisticsTime',
                component: () => import('@/pages/logistics/time.vue'),
                name: 'time',
                meta: { title: '送货时间' }
            }
        ]
    },
    {
        path: '/notice',
        component: Layout,
        redirect: '/notice/index',
        name: 'Notice',
        meta: {
            title: '消息面板',
            icon: 'notice'
        },
        children: [
            {
                path: 'index',
                component: () => import('@/pages/notice/index.vue'),
                meta: { title: '消息' }
            }
        ]
    }
]

export const asyncRoutes = [
    {
        path: '/merchant',
        component: Layout,
        redirect: '/merchant/list',
        name: 'merchant',
        meta: {
            title: '商家管理',
            icon: 'goods'
        },
        children: [
            {
                path: 'list',
                component: () => import('@/pages/merchant/list.vue'),
                name: 'merchantList',
                meta: { title: '商家列表', roles: ['admin'] }
            },
            {
                path: 'merchantAdd',
                component: () => import('@/pages/merchant/add.vue'),
                name: 'merchantAdd',
                meta: { title: '添加商家', noCache: true, roles: ['admin'] }
            },
            {
                path: 'merchantEdit',
                component: () => import('@/pages/merchant/edit.vue'),
                name: 'merchantEdit',
                hidden: true,
                meta: {
                    title: '编辑商家',
                    noCache: true,
                    roles: ['merchant', 'admin']
                }
            },
            {
                path: 'merchantView',
                component: () => import('@/pages/merchant/view.vue'),
                name: 'merchantView',
                meta: { title: '商家信息', noCache: true, roles: ['merchant'] }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: [...constantRoutes, ...asyncRoutes]
})

export default router
