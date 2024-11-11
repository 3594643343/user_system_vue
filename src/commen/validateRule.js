export default {
    // 验证账户
    validateAccount(rule, value, callback) {
        let isAccount = /^[A-Za-z0-9]{4,12}$/
        if (!isAccount.test(value)) {
            callback('4-12位,仅能包含大小写字母和数字');
        } else {
            callback();
        }
    },
    // 验证昵称
    validateNickname(rule, value, callback) {
        if (value.length <= 0 || value.length > 10) {
            callback('请输入1-10位的新昵称');
        } else {
            callback();
        }
    },
    // 验证密码
    validatePassword(rule, value, callback) {
        let isAccount = /^[A-Za-z0-9]{6,16}$/
        if (!isAccount.test(value)) {
            callback('6-16位,仅能包含大小写字母和数字');
        } else {
            callback();
        }
    }
}

