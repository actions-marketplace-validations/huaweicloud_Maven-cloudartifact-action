import * as core from '@actions/core';

import * as context from './context';
import * as utils from './utils';
import * as settings from './settings';

export async function run() {
  core.info('Generate settings.xml for Maven Builds');
  const inputs: context.Inputs = context.getInputs();

  // 检查参数是否合法
  if (!utils.checkInputs(inputs)) {
    core.setFailed('parameter is not correct.');
    return;
  }

  settings.generateSettingXml(inputs);
}

run().catch(core.setFailed);
