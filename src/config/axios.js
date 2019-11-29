import {testUrl} from './env'
import axios from 'axios'
import store from '@/store/'

export default async (url = '',data={},type = '') => {
    url = testUrl + url;

    //POST
    if(type==='post'){
        let json=null;
        await axios
            .post(url,data)
            .then(function (response){
                // console.log(response)
                json=response.data;
            })
            .catch(error => {
                console.log(typeof error);
                console.log(error);
                // store.dispatch('logout','网络异常登出')
            });
        return json;
    }

    //POST2  getAllTree
    if(type==='post2'){
        let json=null;

        url=url+'?pid=-1';
        await axios
            .post(url,data)
            .then(function (response){
                // console.log(response)
                json=response.data;
            })
            .catch(error => {
                console.log(typeof error);
                console.log(error);
                // store.dispatch('logout','网络异常登出')
            });
        return json;
    }




    //GET
    if (data!=={}) {
        let dataStr = ''; //数据拼接字符串
        Object.keys(data).forEach(key => {
            dataStr += data[key]+'/';
        })

        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('/'));
            url = url + '/' + dataStr;
        }
    }
    // axios.defaults.withCredentials = true

    var json=null;
    await axios
        .get(url)
        .then(function (response){
            json=response.data;
        })
        .catch(error => {
            console.log(typeof error);
            console.log(error);
            // store.dispatch('logout','网络异常登出')
        });

   // console.log(json);
    return json;



}
