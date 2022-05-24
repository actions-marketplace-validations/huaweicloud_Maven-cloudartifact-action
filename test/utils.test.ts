import * as utils from '../src/utils';
import * as context from '../src/context';

describe('test whether the inputs is valid', () => {
    const testCase = [
        {description: '参数全空', inputs: {servers: '', mirrors: '', repositories: '', pluginRepositories: ''}, result: true},
        {description: '参数部分空', inputs: {servers: '[{}]', mirrors: '', repositories: '[{}]', pluginRepositories: ''}, result: true},
        {description: '参数部全不空', inputs: {servers: '[{}]', mirrors: '[{}]', repositories: '[{}]', pluginRepositories: '[{}]'}, result: true},
        {description: '参数部全不是json array', inputs: {servers: 'a', mirrors: 'a', repositories: 'a', pluginRepositories: 'a'}, result: false},
        {description: '参数部部分不是json array', inputs: {servers: 'a', mirrors: '[{}]', repositories: 'a', pluginRepositories: 'a'}, result: false},{description: '参数部全是json array', inputs: {servers: '[{}]', mirrors: '[{}]', repositories: '[{}]', pluginRepositories: '[{}]'}, result: true},];
    testCase.forEach(item => {
      const {description, inputs, result} = item;
      test(`${description}, 判断结果：${result}`, async () => {
        expect(utils.checkInputs(inputs)).toBe(result);
      });
    });
  });

describe('test whether the string is json array', () => {
    const testCase = [
        {str: 'sddssd', result: false},
        {str: '[]', result: false}, 
        {str: '{[]}', result: false}, 
        {str: '', result: false}, 
        {str: ' ', result: false}, 
        {str: '[1,2,3]', result: true}, 
        {str: '[{}]', result: true},
        {str: '[{"test1": "aa", "test2": "aa"}, {"test1": "sdd", "test2": "ewe"}]', result: true}, 
        {str: '[{"test1": "aa"]', result: false},];
    testCase.forEach(item => {
      const {str, result} = item;
      test(`str输入为(${str}), json array判断结果：${result}`, async () => {
        expect(utils.isJsonArrayString(str)).toBe(result);
      });
    });
  });

describe('test check parameter is null ', () => {
    const testCase = [
        {str: '', result: true},
        {str: ' ', result: true},
        {str: '  ', result: true},
        {str: 'fsefr&^%^&e', result: false}];
    testCase.forEach(item => {
      const {str, result} = item;
      test(`str输入为(${str}), 空字符判断结果：${result}`, async () => {
        expect(utils.checkParameterIsNull(str)).toBe(result);
      });
    });
  });
  