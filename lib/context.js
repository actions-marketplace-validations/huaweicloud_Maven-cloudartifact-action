"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputs = void 0;
function getInputs() {
    //   return {
    //     servers: core.getInput('servers', {required: false}),
    //     mirrors: core.getInput('mirrors', {required: false}),
    //     repositories: core.getInput('repositories', {required: false}),
    //     pluginRepositories: core.getInput('plugin_repositories', {required: false}),
    //   };
    return {
        servers: '[{ "id": "release_cn-north-7_0746e5354900d4c60f81c00e1498ef20_maven_1_0", "username": "cn-north-7_0746e5354900d4c60f81c00e1498ef20_0746e535fc00d56f1f51c00efe905572", "password": "7tT_4N=h_j" },{ "id": "snapshot_cn-north-7_0746e5354900d4c60f81c00e1498ef20_maven_2_0", "username": "cn-north-7_0746e5354900d4c60f81c00e1498ef20_0746e535fc00d56f1f51c00efe905572", "password": "7tT_4N=h_j" }]',
        mirrors: '[{ "id": "z_mirrors", "mirrorOf": "*,!release_cn-north-7_0746e5354900d4c60f81c00e1498ef20_maven_1_0,!snapshot_cn-north-7_0746e5354900d4c60f81c00e1498ef20_maven_2_0", "url": "http://mirrors.tools.huawei.com/maven/" }]',
        repositories: '[{"id": "release_cn-north-7_0746e5354900d4c60f81c00e1498ef20_maven_1_0", "url": "https://devrepo.devcloud.cn-north-7.ulanqab.huawei.com/artgalaxy/cn-north-7_0746e5354900d4c60f81c00e1498ef20_maven_1_0/", "releases": {"enabled": true}, "snapshots": {"enabled": false}},{"id": "snapshot_cn-north-7_0746e5354900d4c60f81c00e1498ef20_maven_2_0", "url": "https://devrepo.devcloud.cn-north-7.ulanqab.huawei.com/artgalaxy/cn-north-7_0746e5354900d4c60f81c00e1498ef20_maven_2_0/", "releases": {"enabled": false}, "snapshots": {"enabled": true}}]',
        pluginRepositories: '[{"id": "release_cn-north-7_0746e5354900d4c60f81c00e1498ef20_maven_1_0", "url": "https://devrepo.devcloud.cn-north-7.ulanqab.huawei.com/artgalaxy/cn-north-7_0746e5354900d4c60f81c00e1498ef20_maven_1_0/", "releases": {"enabled": true}, "snapshots": {"enabled": false}},{"id": "snapshot_cn-north-7_0746e5354900d4c60f81c00e1498ef20_maven_2_0", "url": "https://devrepo.devcloud.cn-north-7.ulanqab.huawei.com/artgalaxy/cn-north-7_0746e5354900d4c60f81c00e1498ef20_maven_2_0/", "releases": {"enabled": false}, "snapshots": {"enabled": true}}]'
    };
}
exports.getInputs = getInputs;
