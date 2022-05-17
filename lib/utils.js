"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJsonArrayString = exports.checkInputs = void 0;
/**
 * 检查每个inputs 属性value是否合法
 * @param inputs
 * @returns
 */
function checkInputs(inputs) {
    for (const key in inputs) {
        if (!isJsonArrayString(inputs[key])) {
            return false;
        }
    }
    return true;
}
exports.checkInputs = checkInputs;
/**
 * 查看字符是否可以转化为json array对象
 * @param str
 * @returns
 */
function isJsonArrayString(str) {
    try {
        const jsonArray = JSON.parse(str);
        if (typeof jsonArray == 'object' && Array.isArray(jsonArray) && jsonArray) {
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
exports.isJsonArrayString = isJsonArrayString;
