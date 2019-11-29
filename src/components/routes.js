const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const addShop = r => require.ensure([], () => r(require('@/page/addShop')), 'addShop');
const addGoods = r => require.ensure([], () => r(require('@/page/addGoods')), 'addGoods');
const test = r => require.ensure([], () => r(require('@/page/test')), 'test');
const EmpBasic = r => require.ensure([], () => r(require('@/page/EmpBasic')), 'EmpBasic');
const singleStatus = r => require.ensure([], () =>r(require('@/page/singleStatus')), 'singleStatus');
const HomeMap = r => require.ensure([], () =>r(require('@/components/HomeMap')), 'HomeMap');
const lineMap = r => require.ensure([], () =>r(require('@/components/lineMap')), 'lineMap');
const tableList = r => require.ensure([], () =>r(require('@/components/tableList')), 'tableList');
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
const tt = r => require.ensure([], () =>r(require('@/components/powerControl')), 'powerControl');
const areaControl = r => require.ensure([], () =>r(require('@/page/areaControl')), 'areaControl');
const userInfo = r => require.ensure([], () =>r(require('@/page/userInfo')), 'userInfo');


function deepClone(obj){
    let objClone = Array.isArray(obj)?[]:{};
    if(obj && typeof obj==="object"){
        for(let key in obj){
            if(obj.hasOwnProperty(key)){
                //判断ojb子元素是否为对象，如果是，递归复制
                if(obj[key]&&typeof obj[key] ==="object"){
                    objClone[key] = deepClone(obj[key]);
                }else{
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}
function addLimit(array,Temp){

    let Base = deepClone(array);
    Base[1].children = Base[1].children.concat(Temp);
    return Base;
}

//'未登录'
const visitorR = [
    {
        path: '/',
        component: Signin,
        meta: ['', ''],
    },
];

//ROLE_browser
const browserR = [
    {
        path: '/',
        component: Signin,
        meta: ['', ''],
    },
    {
        // path: '/manage',
        path: '/manage',
        component: manage,
        name: '',
        children: [{
            path: '',
            component: HomeMap,
            meta: [],
        },{	path: '/test',
            component: test,
            meta: ['设备状态', '所有设备状态'],
        },{
            path: '/HomeMap',
            component: HomeMap,
            meta: [],
        },{
            path: '/singleStatus',
            component: singleStatus,
            meta: ['单设备状态'],
        },{
            path: '/tempearatureHumidity',
            component: tempearatureHumidity,
            meta: ['环境数据'],
        },{
            path: '/temperatureSingle',
            component: temperatureSingle,
            meta: ['环境数据', '单设备环境数据'],
        },{
            path: '/reclose',
            component: reclose,
            meta: ['电源数据']
        },{
            path: '/recloseSingle',
            component: recloseSingle,
            meta: ['电源数据','单设备电源数据']
        },{
            path: '/pm25Luminance',
            component: pm25Luminance,
            meta: ['气象数据']
        },{
            path: '/pm25LuminanceSingle',
            component: pm25LuminanceSingle,
            meta: ['气象数据','单设备气象数据']
        },{
            path:'/userInfo',
            component: userInfo,
            meta:['个人中心']
        }


        ]
    }
];

//ROLE_controller
const controllerTemp=[
    {
    path: '/deviceControl',
    component: deviceControl,
    meta: ['设备批量控制']
    },
];
const controllerR = addLimit(browserR,controllerTemp);

//ROLE_admin
const adminTemp=[
    {
        path: '/devices',
        component: devices,
        meta: ['设备管理', '设备添加'],
    },{
        path: '/user',
        component: user,
        meta: ['系统管理', '用户管理'],
    },{
        path: '/areaControl',
        component: areaControl,
        meta: ['系统管理', '区域管理'],
    },
];
const adminR = addLimit(controllerR,adminTemp);





export {
    visitorR,
    browserR,
    controllerR,
    adminR
}
