class OneTimePassword {
    static otp = {};

    constructor(phone, ot) {
        OneTimePassword.otp[phone] = ot;
    }

    static setOTP(phone, ot) {
        OneTimePassword.otp[phone] = ot;
    }

    static getOTP(phone) {
        return OneTimePassword.otp[phone];
    }

    static deleteOTP(phone) {
        OneTimePassword[phone] = -1;
        setTimeout(() => { delete OneTimePassword.otp[phone] }, 60000);
    }
}

class NewUser {
    static users = {};

    constructor(phone, newUser) {
        NewUser.users[phone] = newUser;
    }

    static saveUser(phone) {
        return NewUser.users[phone].save();
    }

    static deleteUser(phone) {
        delete NewUser.users[phone];
    }
}

const user_role = {
    branchManager: 0,
    teacher: 1,
    councillor: 2,
    student: 3,
    institute: 4
  };

const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] == value);
  }

module.exports = {OneTimePassword, NewUser, user_role, getKeyByValue};