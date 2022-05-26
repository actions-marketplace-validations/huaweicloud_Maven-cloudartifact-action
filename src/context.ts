import * as core from '@actions/core';

export interface Inputs {
  servers: string;
  mirrors: string;
  repositories: string;
  pluginRepositories: string;
}

export function getInputs(): Inputs {
  return {
    servers: core.getInput('servers', {required: false}),
    mirrors: core.getInput('mirrors', {required: false}),
    repositories: core.getInput('repositories', {required: false}),
    pluginRepositories: core.getInput('plugin_repositories', {required: false})
  };
}

export const TEMPLATES_PATH = '../templates';

