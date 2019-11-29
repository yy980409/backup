import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'
import {visitorR,browserR, controllerR, adminR} from '@/components/routes'
Vue.use(Router);

const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const test = r => require.ensure([], () => r(require('@/page/test')), 'test');
const singleStatus = r => require.ensure([], () =>r(require('@/page/singleStatus')), 'singleStatus');
const HomeMap = r => require.ensure([], () =>r(require('@/components/HomeMap')), 'HomeMap');
const tempearatureHumidity = r => require.ensure([], () =>r(require('@/page/tempearatureHumidity')), 'tempearatureHumidity');
const temperatureSingle = r => require.ensure([], () =>r(require('@/page/temperatureSingle')), 'temperatureSingle');
const Signin = r => require.ensure([], () =>r(require('@/page/Signin')), 'Signin');
const devices = r => require.ensure([], () =>r(require('@/page/devices')), 'devices');
const user = r => require.ensure([], () =>r(require('@/page/user')), 'user');
const reclose = r => require.ensure([], () =>r(require('@/page/reclose')), 'reclose');
const recloseSingle = r => require.ensure([], () =>r(require('@/page/recloseSingle')), ' recloseSingle');
const pm25Luminance = r => require.ensure([], () =>r(require('@/page/pm25Luminance')), 'pm25Luminance');
const pm25LuminanceSingle = r => require.ensure([], () =>r(require('@/page/pm25LuminanceSingle')), 'pm25LuminanceSingle');
const deviceControl = r => require.ensure([], () =>r(require('@/page/deviceControl')), 'deviceControl');
const userInfo = r => require.ensure([], () =>r(require('@/page/userInfo')), 'userInfo');

console.log(store.state.user.role);

const routes=[
    {
        path: '/',
        component: Signin,
        meta: ['', ''],
    },
]


const createRouter = () => new Router({
    // mode: 'history',
    routes,
    strict: process.env.NODE_ENV !== 'production',
});

const router = createRouter();
export function resetRouter () {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher
}



// const router = new Router({
//     routes,//直接写routes为缩写 同routes:routes
//     strict: process.env.NODE_ENV !== 'production',
// });


export const initMenu = (router, store )=> {
    // console.log('初始化菜单')
     var routes = [];

    if(store.state.user.role==='ROLE_admin'){
        routes = adminR;
    }else if(store.state.user.role==='ROLE_browser'){
        routes = browserR;
    }else if(store.state.user.role==='ROLE_controller'){
        routes = controllerR;
    }else{
        routes = visitorR;
    }
    // console.log(routes);
    router.addRoutes(routes);
    store.commit('initMenu',routes);

};

export default router;
