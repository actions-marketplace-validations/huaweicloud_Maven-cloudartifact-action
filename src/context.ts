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
      '[{ "id": "release_dfbdbf2e511e40fa88ba1d653358d65c_1_0", "username": "cn-north-4_dfbdbf2e511e40fa88ba1d653358d65c_66af5f8d4b84416785817649d667a396", "password": "j=6D-1Spw]" }]',
    mirrors:
      '[{ "id": "z_mirrors", "mirrorOf": "*,!release_dfbdbf2e511e40fa88ba1d653358d65c_1_0,!snapshot_dfbdbf2e511e40fa88ba1d653358d65c_2_0", "url": "https://repo.huaweicloud.com/repository/maven/" }]',
    repositories:
      '[{"id": "release_dfbdbf2e511e40fa88ba1d653358d65c_1_0", "url": "https://devrepo.devcloud.cn-north-4.huaweicloud.com/07/nexus/content/repositories/dfbdbf2e511e40fa88ba1d653358d65c_1_0/"}]',
    pluginRepositories: '{}'
  };
}
