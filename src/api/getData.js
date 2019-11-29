import fetch from '@/config/fetch'
import axios from '@/config/axios'

export const getUserInfo = data =>(axios('/basic/getUserMsg',data));
export const changePassword = data =>(axios('/basic/changePassword',data,'post'));
export const changeDetail = data =>(axios('/basic/update',data,'post'));

/**
 * 批量控制
 */

export const getProtectorStatus = data =>(axios('/device/remoteControl/protector',data));
export const getFanStatus = data =>(axios('/device/remoteControl/fan',data));

/**
 * 设备分区树
 */
export const getAllTree = data =>(axios('/basic/getAreaTree',data,'post2'));
export const getOneTree = data =>(axios('/device/area',data));



/**
 * 获取订单
 */
export const getOrder = data =>(axios('/getOrderByDid',data));



/**
 * 登出
 */
export const logOut = data =>(axios('/logout',data));
/**
 * 数据中心接口
 */
export const postTemHumLatest = data =>(axios('/device/temperature_and_humidity/latest',data,'post'));
export const postTemHumHistory = data =>(axios('/device/temperature_and_humidity/query',data,'post'));
export const postPMLumLatest = data =>(axios('/device/air_light/latest',data,'post'));
export const postPMLumHistory = data =>(axios('/device/air_light/query',data,'post'));
export const postRecloseLatest = data =>(axios('/device/auto_reclosing_power_protector/latest',data,'post'));
export const postRecloseHistory = data =>(axios('/device/auto_reclosing_power_protector/query',data,'post'));

/**
 * 风扇控制
 */
export const fanAutoOn = data =>(axios('/device/remoteControl/fan/autoControlOn',data));
export const fanAutoOff = data =>(axios('/device/remoteControl/fan/autoControlOff',data));
export const fanSpeed = data =>(axios('/device/remoteControl/fanSpeed',data));
export const fanOpen = data =>(axios('/device/remoteControl/fanOn',data));

export const fanClose = data =>(axios('/device/remoteControl/fanOff',data));
/**
 * 获取故障信息
 */
export const getErrorInfo = data =>(axios('/device/ErrTables',data));

/**
 * 获取设备信息
 */
export const getDevAllInfo = data =>(axios('/device/sensors/detail',data));
export const getDevCount = data =>(axios('/device/totalInformation',data));
export const getDevSensors = data =>(axios('/device/sensors/map',data));
/**
 * 获取设备GPS、分区
 */
export const getGPS = data =>(axios('/device/area/location',data));
export const getGPSByArea  = data =>(axios('/device/area/location',data));
export const getArea = data =>(axios('/device/area',data));
/**
 * 获取设备重合闸
 */
export const reStartPower = data =>(axios('/device/remoteControl/protectorRestart',data));
export const powerOn = data =>(axios('/device/remoteControl/protectorOn',data));
export const powerOff = data =>(axios('/device/remoteControl/protectorOff',data));
export const getLatestPowerById = data =>(axios('/device/auto_reclosing_power_protector/latest',data));

/**
 * 获取设备光照强度
 */
export const getLatestLuminance = data =>(axios('/device/light/latest',data));

/**
 * 获取PM2.5 PM10
 */
export const getLatestPM = data =>(axios('/device/air/latest',data));

/**
 * 获取设备水浸
 */
export const getLatestWaterById = data =>(axios('/device/water/latest',data));


/**
 * 获取设备温湿度
 */
export const getLatesTemById = data =>(axios('/device/temperature_and_humidity/latest',data));
export const getLatesTemCount = data =>(axios('/device/temperature_and_humidity/latest/count',data));
export const getLatesTem = data =>(axios('/device/temperature_and_humidity/latest',data));
export const getTemHumCount = data =>(axios('/device/temperature_and_humidity/count',data));
export const getTemHum = data =>(axios('/device/temperature_and_humidity/query',data,'post'));
/**
 * 登陆
 */

export const login = data => fetch('/admin/login', data, 'POST');

/**
 * 退出
 */

export const signout = () => fetch('/admin/signout');

/**
 * 获取用户信息
 */

export const getAdminInfo = () => fetch('/admin/info');

/**
 * api请求量
 */

export const apiCount = date => fetch('/statis/api/' + date + '/count');

/**
 * 所有api请求量
 */

export const apiAllCount = () => fetch('/statis/api/count');


/**
 * 所有api请求信息
 */

export const apiAllRecord = () => fetch('/statis/api/all');

/**
 * 用户注册量
 */

export const userCount = date => fetch('/statis/user/' + date + '/count');

/**
 * 某一天订单数量
 */

export const orderCount = date => fetch('/statis/order/' + date + '/count');


/**
 * 某一天管理员注册量
 */

export const adminDayCount = date => fetch('/statis/admin/' + date + '/count');

/**
 * 管理员列表
 */

export const adminList = data => fetch('/admin/all', data);

/**
 * 管理员数量
 */

export const adminCount = () => fetch('/admin/count');

/**
 * 获取定位城市
 */

export const cityGuess = () => fetch('/v1/cities', {
	type: 'guess'
});

/**
 * 添加商铺
 */

export const addShop = data => fetch('/shopping/addShop', data, 'POST');

/**
 * 获取搜索地址
 */

export const searchplace = (cityid, value) => fetch('/v1/pois', {
	type: 'search',
	city_id: cityid,
	keyword: value
});

/**
 * 获取当前店铺食品种类
 */

export const getCategory = restaurant_id => fetch('/shopping/getcategory/' + restaurant_id);

/**
 * 添加食品种类
 */

export const addCategory = data => fetch('/shopping/addcategory', data, 'POST');


/**
 * 添加食品
 */

export const addFood = data => fetch('/shopping/addfood', data, 'POST');


/**
 * category 种类列表
 */

export const foodCategory = (latitude, longitude) => fetch('/shopping/v2/restaurant/category');

/**
 * 获取餐馆列表
 */

export const getResturants = data => fetch('/shopping/restaurants', data);

/**
 * 获取餐馆详细信息
 */

export const getResturantDetail = restaurant_id => fetch('/shopping/restaurant/' + restaurant_id);

/**
 * 获取餐馆数量
 */

export const getResturantsCount = () => fetch('/shopping/restaurants/count');

/**
 * 更新餐馆信息
 */

export const updateResturant = data => fetch('/shopping/updateshop', data, 'POST');

/**
 * 删除餐馆
 */

export const deleteResturant = restaurant_id => fetch('/shopping/restaurant/' + restaurant_id, {}, 'DELETE');

/**
 * 获取食品列表
 */

export const getFoods = data => fetch('/shopping/v2/foods', data);

/**
 * 获取食品数量
 */

export const getFoodsCount = data => fetch('/shopping/v2/foods/count', data);


/**
 * 获取menu列表
 */

export const getMenu = data => fetch('/shopping/v2/menu', data);

/**
 * 获取menu详情
 */

export const getMenuById = category_id => fetch('/shopping/v2/menu/' + category_id);

/**
 * 更新食品信息
 */

export const updateFood = data => fetch('/shopping/v2/updatefood', data, 'POST');

/**
 * 删除食品
 */

export const deleteFood = food_id => fetch('/shopping/v2/food/' + food_id, {}, 'DELETE');

/**
 * 获取用户列表
 */

export const getUserList = data => fetch('/v1/users/list', data);

/**
 * 获取用户数量
 */

export const getUserCount = data => fetch('/v1/users/count', data);

/**
 * 获取订单列表
 */

export const getOrderList = data => fetch('/bos/orders', data);

/**
 * 获取订单数量
 */

export const getOrderCount = data => fetch('/bos/orders/count', data);

/**
 * 获取用户信息
 */

// export const getUserInfo = user_id => fetch('/v1/user/' + user_id);

/**
 * 获取地址信息
 */

export const getAddressById = address_id => fetch('/v1/addresse/' + address_id);

/**
 * 获取用户分布信息
 */

export const getUserCity = () => fetch('/v1/user/city/count');
