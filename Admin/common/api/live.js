
import { fetch } from 'common/util/fetch';



export function fetchLiveList (params) {
    return fetch({
        url: '/live/list',
        method: 'POST',
        data: params
    });
}
//删除错误信息
export function fetchLiveRemove(ids){
    if (typeof ids === 'number') {
        ids = [parseInt(ids)];
    }
    return fetch({
        url: '/live/remove',
        method: 'POST',
        data: { 'id': ids }
    });
}
//更新信息
export function updateLiveInfo(params){
    return fetch({
        url:'/live/update',
        method: 'POST',
        data:params
    })
}
//详情
export function fetchLiveInfo (id) {
    return fetch({
        url: '/live/info?id=' + id,
        method: 'GET',
       
    });
}
//创建
export function createLiveInfo(params){
    return fetch({
        url:'/live/create',
        method: 'POST',
        data:params
    })
}