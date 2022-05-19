import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {DOMParser, XMLSerializer} from '@xmldom/xmldom';
import formatter from 'xml-formatter';
import * as core from '@actions/core';

import * as context from './context';

const TEMPLATES_PATH = '../templates';

function getTemplate(filePath: string, fileName: string) {
  const templatePath = path.join(__dirname, filePath, fileName);
  const template = fs.readFileSync(templatePath).toString();
  return new DOMParser().parseFromString(template, 'text/xml');
}

export function generateSettingXml(inputs: context.Inputs) {
  const settingsXml = getTemplate(TEMPLATES_PATH, 'settings.xml');

  generateServersXml(settingsXml, inputs.servers);

  generateMirrorsXml(settingsXml, inputs.mirrors);

  generateProfilesXml(settingsXml, inputs.repositories, inputs.pluginRepositories);

  const settingStr = new XMLSerializer().serializeToString(settingsXml);
  // console.log(formatter(settingStr));
  // console.log(getMavenSettingPath());
  writeMavenSetting(getMavenSettingPath(), settingStr);
}

export function generateServersXml(settingsXml: Document, servers: string) {
  const serversXml = settingsXml.getElementsByTagName('servers')[0];
  if (!servers) {
    settingsXml.documentElement.removeChild(serversXml);
    return;
  }

  JSON.parse(servers).forEach(
    (server: {
      id: string | null;
      username: string | null;
      password: string | null;
    }) => {
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
    }
  );
}

export function generateMirrorsXml(settingsXml: Document, mirrors: string) {
  const mirrorsXml = settingsXml.getElementsByTagName('mirrors')[0];
  if (!mirrors) {
    settingsXml.documentElement.removeChild(mirrorsXml);
    return;
  }

  JSON.parse(mirrors).forEach(
    (mirror: {
      id: string | null;
      mirrorOf: string | null;
      url: string | null;
    }) => {
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
    }
  );
}


export function generateProfilesXml(settingsXml: Document, repositories: string, pluginRepositories: string) {
  if (!repositories && !pluginRepositories) {
    generateDefaultProfilesXml(settingsXml);
    return;
  }

  const profilesXml = settingsXml.getElementsByTagName('profiles')[0];
  generateDependencyOrPluginRepositoriesXml(profilesXml, repositories, 'repositories', 'repositories.xml');

  generateDependencyOrPluginRepositoriesXml(profilesXml, pluginRepositories, 'pluginRepositories', 'plugin-repositories.xml');
}

function generateDefaultProfilesXml(settingsXml: Document) {
  
  let profilesXml = settingsXml.getElementsByTagName('profiles')[0];

  const dependencyRepositoriesXml = profilesXml.getElementsByTagName('repositories')[0];
  const defaultRepositoriesXml = getTemplate(TEMPLATES_PATH, 'default-repositories.xml');
  dependencyRepositoriesXml.appendChild(defaultRepositoriesXml);

  const pluginRepositoriesXml = profilesXml.getElementsByTagName('pluginRepositories')[0];
  const defaultPluginRepositoriesXml = getTemplate(TEMPLATES_PATH, 'default-plugin-repositories.xml');
  pluginRepositoriesXml.appendChild(defaultPluginRepositoriesXml);
}

function generateDependencyOrPluginRepositoriesXml(profilesXml: Element, dependencyOrPluginRepositories: string, tagName: string, templateName: string) {
  const dependencyOrPluginRepositoriesXml = profilesXml.getElementsByTagName(tagName)[0];
  if (!dependencyOrPluginRepositories) {
    profilesXml.removeChild(dependencyOrPluginRepositoriesXml);
    return;
  }
  
  JSON.parse(dependencyOrPluginRepositories).forEach(
    (dependencyOrPluginRepository: { id: string | null; url: string | null; releases: null | undefined; snapshots: null | undefined; }) => {
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
      } else {
        dependencyOrPluginRepositoryXml.documentElement.removeChild(releasesXml);
      }

      const snapshotsXml = dependencyOrPluginRepositoryXml.getElementsByTagName('snapshots')[0];
      if (dependencyOrPluginRepository.snapshots !== null && dependencyOrPluginRepository.snapshots !== undefined) {
        const snapshots = dependencyOrPluginRepository.snapshots;
        snapshotsXml.getElementsByTagName('enabled')[0].textContent = snapshots['enabled'];
      } else {
        dependencyOrPluginRepositoryXml.documentElement.removeChild(snapshotsXml);
      }

      dependencyOrPluginRepositoriesXml.appendChild(dependencyOrPluginRepositoryXml);
    }
  );
}

function getMavenSettingPath() {
  return path.join(os.homedir(), '.m2', 'settings.xml');
}

function writeMavenSetting(mavenSettingPath: string, mavenSettingContent: string) {
  // 不存在.m2目录即创建
  if (!fs.existsSync(path.dirname(mavenSettingPath))) {
    core.info('Maven Setting Path does not exist.');
    fs.mkdirSync(path.dirname(mavenSettingPath));
  }
  fs.writeFileSync(mavenSettingPath, formatter(mavenSettingContent))
}