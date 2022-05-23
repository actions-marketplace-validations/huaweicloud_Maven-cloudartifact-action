"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProfilesXml = exports.generateMirrorsXml = exports.generateServersXml = exports.generateSettingXml = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const xmldom_1 = require("@xmldom/xmldom");
const xml_formatter_1 = __importDefault(require("xml-formatter"));
const core = __importStar(require("@actions/core"));
const TEMPLATES_PATH = '../templates';
function getTemplate(filePath, fileName) {
    const templatePath = path.join(__dirname, filePath, fileName);
    const template = fs.readFileSync(templatePath).toString();
    return new xmldom_1.DOMParser().parseFromString(template, 'text/xml');
}
function generateSettingXml(inputs) {
    const settingsXml = getTemplate(TEMPLATES_PATH, 'settings.xml');
    generateServersXml(settingsXml, inputs.servers);
    generateMirrorsXml(settingsXml, inputs.mirrors);
    generateProfilesXml(settingsXml, inputs.repositories, inputs.pluginRepositories);
    const settingStr = new xmldom_1.XMLSerializer().serializeToString(settingsXml);
    writeMavenSetting(getMavenSettingPath(), settingStr);
}
exports.generateSettingXml = generateSettingXml;
function generateServersXml(settingsXml, servers) {
    const serversXml = settingsXml.getElementsByTagName('servers')[0];
    if (!servers) {
        settingsXml.documentElement.removeChild(serversXml);
        return;
    }
    JSON.parse(servers).forEach((server) => {
        if (!server.id || !server.username || !server.password) {
            core.setFailed('servers must contain id, and username and password');
            return;
        }
        const serverXml = getTemplate(TEMPLATES_PATH, 'servers.xml');
        serverXml.getElementsByTagName('id')[0].textContent = server.id;
        serverXml.getElementsByTagName('username')[0].textContent =
            server.username;
        serverXml.getElementsByTagName('password')[0].textContent =
            server.password;
        serversXml.appendChild(serverXml);
    });
}
exports.generateServersXml = generateServersXml;
function generateMirrorsXml(settingsXml, mirrors) {
    const mirrorsXml = settingsXml.getElementsByTagName('mirrors')[0];
    if (!mirrors) {
        settingsXml.documentElement.removeChild(mirrorsXml);
        return;
    }
    JSON.parse(mirrors).forEach((mirror) => {
        if (!mirror.id || !mirror.mirrorOf || !mirror.url) {
            core.setFailed('mirrors must contain id, and mirrorOf and url');
            return;
        }
        const mirrorXml = getTemplate(TEMPLATES_PATH, 'mirrors.xml');
        mirrorXml.getElementsByTagName('id')[0].textContent = mirror.id;
        mirrorXml.getElementsByTagName('mirrorOf')[0].textContent =
            mirror.mirrorOf;
        mirrorXml.getElementsByTagName('url')[0].textContent =
            mirror.url;
        mirrorsXml.appendChild(mirrorXml);
    });
}
exports.generateMirrorsXml = generateMirrorsXml;
function generateProfilesXml(settingsXml, repositories, pluginRepositories) {
    if (!repositories && !pluginRepositories) {
        generateDefaultProfilesXml(settingsXml);
        return;
    }
    const profilesXml = settingsXml.getElementsByTagName('profiles')[0];
    generateDependencyOrPluginRepositoriesXml(profilesXml, repositories, 'repositories', 'repositories.xml');
    generateDependencyOrPluginRepositoriesXml(profilesXml, pluginRepositories, 'pluginRepositories', 'plugin-repositories.xml');
}
exports.generateProfilesXml = generateProfilesXml;
function generateDefaultProfilesXml(settingsXml) {
    const profilesXml = settingsXml.getElementsByTagName('profiles')[0];
    const dependencyRepositoriesXml = profilesXml.getElementsByTagName('repositories')[0];
    const defaultRepositoriesXml = getTemplate(TEMPLATES_PATH, 'default-repositories.xml');
    dependencyRepositoriesXml.appendChild(defaultRepositoriesXml);
    const pluginRepositoriesXml = profilesXml.getElementsByTagName('pluginRepositories')[0];
    const defaultPluginRepositoriesXml = getTemplate(TEMPLATES_PATH, 'default-plugin-repositories.xml');
    pluginRepositoriesXml.appendChild(defaultPluginRepositoriesXml);
}
function generateDependencyOrPluginRepositoriesXml(profilesXml, dependencyOrPluginRepositories, tagName, templateName) {
    const dependencyOrPluginRepositoriesXml = profilesXml.getElementsByTagName(tagName)[0];
    if (!dependencyOrPluginRepositories) {
        profilesXml.removeChild(dependencyOrPluginRepositoriesXml);
        return;
    }
    JSON.parse(dependencyOrPluginRepositories).forEach((dependencyOrPluginRepository) => {
        if (!dependencyOrPluginRepository.id || !dependencyOrPluginRepository.url) {
            core.setFailed(tagName + ' must contain id and url');
            profilesXml.removeChild(dependencyOrPluginRepositoriesXml);
            return;
        }
        const dependencyOrPluginRepositoryXml = getTemplate(TEMPLATES_PATH, templateName);
        dependencyOrPluginRepositoryXml.getElementsByTagName('id')[0].textContent = dependencyOrPluginRepository.id;
        dependencyOrPluginRepositoryXml.getElementsByTagName('url')[0].textContent = dependencyOrPluginRepository.url;
        const releasesXml = dependencyOrPluginRepositoryXml.getElementsByTagName('releases')[0];
        if (dependencyOrPluginRepository.releases !== null && dependencyOrPluginRepository.releases !== undefined) {
            const releases = dependencyOrPluginRepository.releases;
            if (Object.prototype.hasOwnProperty.call(releases, 'enabled')) {
                releasesXml.getElementsByTagName('enabled')[0].textContent = releases['enabled'];
            }
        }
        else {
            dependencyOrPluginRepositoryXml.documentElement.removeChild(releasesXml);
        }
        const snapshotsXml = dependencyOrPluginRepositoryXml.getElementsByTagName('snapshots')[0];
        if (dependencyOrPluginRepository.snapshots !== null && dependencyOrPluginRepository.snapshots !== undefined) {
            const snapshots = dependencyOrPluginRepository.snapshots;
            snapshotsXml.getElementsByTagName('enabled')[0].textContent = snapshots['enabled'];
        }
        else {
            dependencyOrPluginRepositoryXml.documentElement.removeChild(snapshotsXml);
        }
        dependencyOrPluginRepositoriesXml.appendChild(dependencyOrPluginRepositoryXml);
    });
}
function getMavenSettingPath() {
    return path.join(os.homedir(), '.m2', 'settings.xml');
}
function writeMavenSetting(mavenSettingPath, mavenSettingContent) {
    // 不存在.m2目录即创建
    if (!fs.existsSync(path.dirname(mavenSettingPath))) {
        core.info('Maven Setting Path does not exist.');
        fs.mkdirSync(path.dirname(mavenSettingPath));
    }
    fs.writeFileSync(mavenSettingPath, (0, xml_formatter_1.default)(mavenSettingContent));
}
