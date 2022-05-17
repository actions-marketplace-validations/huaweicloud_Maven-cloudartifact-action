"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJsonString = exports.checkInputs = void 0;
/**
 * 检查每个inputs 属性value是否合法
 * @param inputs
 * @returns
 */
function checkInputs(inputs) {
    for (const key in inputs) {
        if (!isJsonString([key])) {
            return false;
        }
    }
    return true;
}
exports.checkInputs = checkInputs;
/**
 * 查看字符是否可以转化为json对象
 * @param str
 * @returns
 */
function isJsonString(str) {
    try {
        const obj = JSON.parse(str);
        if (typeof obj == 'object' && obj) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (e) {
        return false;
    }
}
exports.isJsonString = isJsonString;
