import * as core from '@actions/core';

export interface Inputs {
  servers: string;
  mirrors: string;
  repositories: string;
  pluginRepositories: string;
}

export function getInputs(): Inputs {
  //   return {
  //     servers: core.getInput('servers', {required: false}),
  //     mirrors: core.getInput('mirrors', {required: false}),
  //     repositories: core.getInput('repositories', {required: false}),
  //     pluginRepositories: core.getInput('plugin_repositories', {required: false}),
  //   };
  return {
    servers:
      '[{ "id": "release_cn-north-7_0746e5354900d4c60f81c00e1498ef20_maven_1_0", "username": "cn-north-7_0746e5354900d4c60f81c00e1498ef20_0746e535fc00d56f1f51c00efe905572", "password": "7tT_4N=h_j" }]',
    mirrors:
      '[{ "id": "z_mirrors", "mirrorOf": "*,!release_dfbdbf2e511e40fa88ba1d653358d65c_1_0,!snapshot_dfbdbf2e511e40fa88ba1d653358d65c_2_0", "url": "https://repo.huaweicloud.com/repository/maven/" }]',
    repositories:
      '[{"id": "release_dfbdbf2e511e40fa88ba1d653358d65c_1_0", "url": "https://devrepo.devcloud.cn-north-4.huaweicloud.com/07/nexus/content/repositories/dfbdbf2e511e40fa88ba1d653358d65c_1_0/"}]',
    pluginRepositories: '[{}]'
  };
}
