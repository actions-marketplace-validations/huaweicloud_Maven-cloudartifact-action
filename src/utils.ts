import * as context from './context';

/**
 * 检查每个inputs 属性value是否合法
 * @param inputs
 * @returns
 */
export function checkInputs(inputs: context.Inputs): boolean {
  for (const key in inputs) {
    if (!isJsonString((inputs as any)[key])) {
      return false;
    }
  }
  return true;
}

/**
 * 查看字符是否可以转化为json对象
 * @param str
 * @returns
 */
export function isJsonString(str: string): boolean {
  try {
    const obj = JSON.parse(str);
    if (typeof obj == 'object' && obj) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}
