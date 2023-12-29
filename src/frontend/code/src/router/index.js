import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Home from '@/views/webpage/Home.vue'
import ParcelInfo from '@/views/webpage/ParcelInfo.vue'
import Login from '@/views/webpage/Login.vue'
import BaseWork from '@/views/base-employee/Work.vue'
import DepoWork from '@/views/depo-employee/Work.vue'
import BaseManagerWork from '@/views/base-manager/Work.vue'
import DepoManagerWork from '@/views/depo-manager/Work.vue'
import DirectorWork from '@/views/director/Work.vue'

const routes = [
    {
        path: '/', 
        name: 'Home', 
        component: Home,
        children: [
            {
                path: '',
                name: 'home.default',
                component: ParcelInfo,
            },
            {
                path: 'service/parcel-info/:id?/',
                name: 'parcel.info',
                component: ParcelInfo,
            },
        ],
    },
    {
        path: '/login', 
        name: 'login', 
        component: Login,
    },
    {
        path: '/base-employee',
        name: 'base.employee',
        component: BaseWork,
        children: [
            {
                path: '',
                name: 'base.employee.default',
                component: ()=>import('@/views/base-employee/DeliveryHistory.vue')
            },
            {
                path: 'create-parcel',
                name: 'base.employee.create.parcel',
                component: ()=>import('@/views/base-employee/ParcelCreate.vue')
            },
            {
                path: 'pending-to-depo',
                name: 'base.employee.pending.to.depo',
                component: ()=>import('@/views/base-employee/PendingToDepo.vue')
            },
            {
                path: 'pending-from-depo',
                name: 'base.employee.pending.from.depo',
                component: ()=>import('@/views/base-employee/PendingFromDepo.vue')
            },
            {
                path: 'pending-delivery',
                name: 'base.employee.pending.delivery',
                component: ()=>import('@/views/base-employee/PendingDelivery.vue')
            },
            {
                path: 'delivery-confirmation',
                name: 'base.employee.delivery.confirmation',
                component: ()=>import('@/views/base-employee/DeliveryConfirmation.vue')
            },
            {
                path: 'delivery-history',
                name: 'base.employee.delivery.history',
                component: ()=>import('@/views/base-employee/DeliveryHistory.vue')
            },
            {
                path: 'from-sender',
                name: 'base.employee.from.sender',
                component: ()=>import('@/views/base-employee/FromSender.vue')
            },
            {
                path: 'to-receiver',
                name: 'base.employee.to.receiver',
                component: ()=>import('@/views/base-employee/ToReceiver.vue')
            }
        ]
    },
    {
        path: '/depo-employee',
        name: 'depo.employee',
        component: DepoWork,
        children: [
            {
                path: '',
                name: 'depo.employee.default',
                component: ()=>import('@/views/depo-employee/DeliveryHistory.vue')
            },
            {
                path: 'pending-from-base',
                name: 'depo.employee.pending.from.base',
                component: ()=>import('@/views/depo-employee/PendingFromBase.vue'),
            },
            {
                path: 'pending-from-depo',
                name: 'depo.employee.pending.from.depo',
                component: ()=>import('@/views/depo-employee/PendingFromDepo.vue')
            },
            {
                path: 'pending-to-base',
                name: 'depo.employee.pending.to.base',
                component: ()=>import('@/views/depo-employee/PendingToBase.vue'),
            },
            {
                path: 'pending-to-depo',
                name: 'depo.employee.pending.to.depo',
                component: ()=>import('@/views/depo-employee/PendingToDepo.vue'),
            },
            {
                path: 'delivery-history',
                name: 'depo.employee.delivery.history',
                component: ()=>import('@/views/depo-employee/DeliveryHistory.vue')
            }
        ]
    },
    {
        path: '/director',
        name: 'director',
        component: DirectorWork,
        children: [
            {
                path: 'account-manage', 
                name: 'director.account.manage', 
                component: ()=>import("@/views/director/AccountManagement.vue"),
                children: [ 
                    {
                        path: 'add-account',
                        name: 'director.add.account',
                        component: ()=>import("@/views/director/AddAccount.vue"),
                    },
                    {
                        path: 'edit-account',
                        name: 'director.edit.account',
                        component: ()=>import("@/views/director/EditAccount.vue"),
                    }
                ]
            },
            {
                path: 'parcel-stats', 
                name: 'director.parcel.stats', 
                component: ()=>import("@/views/director/ParcelStats.vue"),
            },
            {
                path: 'base-trade', 
                name: 'director.base.trade', 
                component: ()=>import("@/views/director/Base_Trade.vue"),
            },
        ]
    },
    {
        path: '/basemanager',
        name: 'base.manager',
        component: BaseManagerWork,
        children: [
            {
                path: 'base-account',
                name: 'basemanager.base.account',
                component: ()=>import('@/views/base-manager/BaseAccount.vue')
            },
            {
                path: 'base-stats',
                name: 'basemanager.base.stats',
                component: ()=>import('@/views/base-manager/BaseStats.vue')
            },
        ]
    },
    {
        path: '/depomanager',
        name: 'depo.manager',
        component: DepoManagerWork,
        children: [
            {
                path: 'depo-account',
                name: 'depomanager.trans.account',
                component: ()=>import('@/views/depo-manager/TransAccount.vue')
            },
            {
                path: 'depo-stats',
                name: 'depomanager.trans.stats',
                component: ()=>import('@/views/depo-manager/TransStats.vue')
            },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router