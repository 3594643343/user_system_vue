import request from '@/utils/request'

export function add(data) {
    return request({
        url: '/admin/add',
        method: 'post',
        data: data
    })
}

export function changeRole(data) {
    return request({
        url: '/admin/update/role',
        method: 'put',
        data: data
    })
}

export function deleteUser(data) {
    return request({
        url: '/admin/delete',
        method: 'delete',
        params: {
            ids: data
        }
    })
}