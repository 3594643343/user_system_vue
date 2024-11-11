import request from '@/utils/request'

export function login(account, password) {
    const data = {
        account,
        password
    }
    return request({
        url: '/admin/login',
        method: 'post',
        data: data,
        headers: {
            isToken: false
        }
    })
}

export function getInfo() {
    return request({
        url: '/admin/get/info',
        method: 'get',
    })
}

export function logOut() {
    return request({
        url: '/admin/logout',
        method: 'delete',
    })
}

export function changePassword(userId, oldPassword, newPassword) {
    const data = {
        userId,
        oldPassword,
        newPassword
    }
    return request({
        url: '/admin/update/password',
        method: 'put',
        data: data
    })
}

export function changeInfo(data) {
    return request({
        url: '/admin/update/info',
        method: 'put',
        data: data,
    })
}

export function getUsers(data) {
    return request({
        url: '/admin/query',
        method: 'get',
        params: data
    })
}