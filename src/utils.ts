import * as context from './context';

/**
 * 检查每个inputs 属性value是否合法
 * @param inputs
 * @returns
 */
export function checkInputs(inputs: context.Inputs): boolean {
  for (const key in inputs) {
    if (!isJsonArrayString((inputs as any)[key])) {
      return false;
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
    if (typeof jsonArray == 'object' && Array.isArray(jsonArray) && jsonArray) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}
