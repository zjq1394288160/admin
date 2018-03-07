import { fetch } from 'common/util/fetch';

export function fetchVideoList (params) {
    return fetch({
        url: '/video/list',
        method: 'POST',
        data: params
    });
}
// 创建新的  （提交的新的/提交编辑的）
export function postNewVideo (params) {
    return fetch({
        url: '/video/create',
        method: 'POST',
        data: params
    });
}

// 获取信息   （新增编辑）
export function fetchVideoInfo (id) {
    return fetch({
        url: '/video/info?id=' + id,
        method: 'GET'
    });
}

//更新
export function updateVideoInfo(params){
    return fetch({
        url:'/video/update',
        method:"POST",
        data:params
    })
}
// 创建新的 
export function createVideoInfo (params) {
    return fetch({
        url: '/video/create',
        method: 'POST',
        data: params
    });
}

// 删除错误信息
export function removeVideoInfo (ids) {
    if (typeof ids === 'number') {
        ids = [parseInt(ids)];
    }
    return fetch({
        url: '/video/remove',
        method: 'POST',
        data: { 'id': ids }
    });
}