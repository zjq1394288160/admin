
import { fetch } from 'common/util/fetch';

export function fetchUserList (params) {
    return fetch({
        url: '/user/list',
        method: 'POST',
        data: params
    });
}
export function fetchUserOrderList(params){
    return fetch({
       
    })
}
//详情
export function fetchUserInfo (id) {
    return fetch({
        url: '/user/info?id=' + id,
        method: 'GET',
       
    });
}
//// 更新用户信息
export function updateUserInfo (params) {
    return fetch({
        url: '/user/update',
        method: 'POST',
        data: params
    });
}


// 创建新的用户信息   （提交的新的/提交编辑的）
export function postNewUser (params) {
    return fetch({
        url: '/user/create',
        method: 'POST',
        data: params
    });
}


// 删除顺出用户
export function removeUserInfo (ids) {
    if (typeof ids === 'number') {
        ids = [parseInt(ids)];
    }
    return fetch({
        url: '/user/remove',
        method: 'POST',
        data: { 'id': ids }
    });
}


