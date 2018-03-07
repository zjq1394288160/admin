
import { fetch } from 'common/util/fetch';

export function fetchHttpProxy (url) {
    return fetch({
        url: '/tool/proxy/get?url=' + url,
        method: 'get'
    });
}
// 获取前端数据模型
export function fetchModel (table) {
    return fetch({
        url: '/tool/model/info?table=' + table,
        method: 'get'
    });
}

// 搜索错误列表
export function fetchErrorList (params) {
    return fetch({
        url: '/tool/error/list',
        method: 'POST',
        data: params
    });
}

// 创建新的错误类型   （提交的新的/提交编辑的）
export function postNewError (params) {
    return fetch({
        url: '/tool/error/create',
        method: 'POST',
        data: params
    });
}

// 获取错误信息   （新增编辑）
export function fetchErrorInfo (id) {
    return fetch({
        url: '/tool/error/info?id=' + id,
        method: 'GET'
    });
}

// 更新错误信息
export function updateErrorInfo (params) {
    return fetch({
        url: '/tool/error/update',
        method: 'POST',
        data: params
    });
}

// 删除错误信息
export function removeErrorInfo (ids) {
    if (typeof ids === 'number') {
        ids = [parseInt(ids)];
    }
    return fetch({
        url: '/tool/error/remove',
        method: 'POST',
        data: { 'id': ids }
    });
}
/**
 * group.vue 
 */
//
//删除节点
export function removeInfo(hash){
    return fetch({
        url:'/tool/group/remove?hash='+hash,
        method:"GET",
    })

}
//节点的添加（一级节点的创建）
export function createNodeInfo(params){
    return fetch({
        url:'/tool/group/create',
        method:"POST",
        data:params
    })
}
//编辑移动节点
export function updateMove(params){
    return fetch({
        url:'/tool/group/update',
        method:"POST",
        data:params

    })
}
//树形图左侧列表
export function fetchgroupList(){
    return fetch({
        url:'/tool/group/list',
        method:'GET'
    })
}
//渲染root
export function fetchgroupInfo(hash){
    return fetch({
        url:"/tool/group/tree?root="+hash,
        method: 'GET',
    })
}
/**
 * purview.vue
 */
export function fetchpurviewList(params){
    return fetch({
        url: '/tool/purview/list',
        method: 'POST',
        data: params
    })
}
// 获取信息   （新增编辑）
export function fetchpurviewInfo (id) {
    return fetch({
        url: '/tool/purview/info?id=' + id,
        method: 'GET'
    });
}
// 更新信息
export function updatepurviewInfo (params) {
    return fetch({
        url: '/tool/purview/update',
        method: 'POST',
        data: params
    });
}
// 创建新的类型   （提交的新的/提交编辑的）
export function createpurview (params) {
    return fetch({
        url: '/tool/purview/create',
        method: 'POST',
        data: params
    });
}
// 删除信息
export function removepurviewInfo (ids) {
    if (typeof ids === 'number') {
        ids = [parseInt(ids)];
    }
    return fetch({
        url: '/tool/purview/remove',
        method: 'POST',
        data: { 'id': ids }
    });
}