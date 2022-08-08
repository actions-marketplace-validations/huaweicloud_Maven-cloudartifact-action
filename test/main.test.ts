import * as main from '../src/main';
import * as utils from '../src/utils';
import * as context from '../src/context';
import * as settings from '../src/settings';

jest.mock('../src/context');
jest.mock('../src/settings');

test('mock checkInputs return true', async () => {
  jest.spyOn(utils, 'checkInputs').mockReturnValue(true);
  await main.run();

  expect(context.getInputs).toHaveBeenCalled();
  expect(context.getInputs).toHaveBeenCalledTimes(1);

  expect(utils.checkInputs).toHaveBeenCalled();
  expect(utils.checkInputs).toHaveBeenCalledTimes(1);

  expect(settings.generateSettingXml).toHaveBeenCalled();
  expect(settings.generateSettingXml).toHaveBeenCalledTimes(1);
});

test('mock checkInputs return false', async () => {
  jest.spyOn(utils, 'checkInputs').mockReturnValue(false);
  await main.run();

  expect(context.getInputs).toHaveBeenCalled();
  expect(context.getInputs).toHaveBeenCalledTimes(1);

  expect(utils.checkInputs).toHaveBeenCalled();
  expect(utils.checkInputs).toHaveBeenCalledTimes(1);

  expect(settings.generateSettingXml).not.toHaveBeenCalled();
});
