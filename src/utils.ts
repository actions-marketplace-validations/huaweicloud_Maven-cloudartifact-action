import * as context from './context';

/**
 * 检查每个inputs 属性value是否合法
 * @param inputs
 * @returns
 */
export function checkInputs(inputs: context.Inputs): boolean {
  for (const key in inputs) {
    if (Object.prototype.hasOwnProperty.call(inputs, key)) {
      const value = (inputs as any)[key];
      if (checkParameterIsNull(value)) {
        continue;
      }
      if (!isJsonArrayString(value)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * 查看字符是否可以转化为json array对象
 * @param str
 * @returns
 */
export function isJsonArrayString(str: string): boolean {
  try {
    const jsonArray = JSON.parse(str);
    if (Array.isArray(jsonArray) && jsonArray.length > 0 && jsonArray) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

/**
 * 判断字符串是否为空
 * @param parameter
 * @returns
 */
export function checkParameterIsNull(parameter: string): boolean {
  return (
    parameter === undefined ||
    parameter === null ||
    parameter === '' ||
    parameter.trim().length == 0
  );
}
