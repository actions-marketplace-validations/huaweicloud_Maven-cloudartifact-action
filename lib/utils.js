"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkParameterIsNull = exports.isJsonArrayString = exports.checkInputs = void 0;
/**
 * 检查每个inputs 属性value是否合法
 * @param inputs
 * @returns
 */
function checkInputs(inputs) {
    for (const key in inputs) {
        const value = inputs[key];
        if (checkParameterIsNull(value)) {
            continue;
        }
        if (!isJsonArrayString(value)) {
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
/**
 * 判断字符串是否为空
 * @param parameter
 * @returns
 */
function checkParameterIsNull(parameter) {
    return (parameter === undefined ||
        parameter === null ||
        parameter === '' ||
        parameter.trim().length == 0);
}
exports.checkParameterIsNull = checkParameterIsNull;
