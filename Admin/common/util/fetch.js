import axios from 'axios';
import { Message } from 'iview';

export function fetch (options) {
    return new Promise((resolve, reject) => {
        let request = axios.create({
            baseURL: '/api/v1', // 测试使用proxy请求
            timeout: 5000,   // 生产环境可以调大些
            headers: {
                'X-Custom-Header': 'LiveVideo',
                'Content-Type': 'application/json'
            }
        });
        Message.info('请求一次');
        request(options)
            .then((response) => {
                Message.success('返回一次');
                if (response['status'] === 200 && response['data']['success'] === true) {
                    resolve(response['data']['data']);
                } else {
                    let error = response['data']['error'];
                    Message.warning(error['msg']);
                }
            })
            .catch(error => {
                console.trace(error);
                Message.warning('请求失败!');
            });
    });
}
