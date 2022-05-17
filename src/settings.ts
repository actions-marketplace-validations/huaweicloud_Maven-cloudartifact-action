import * as fs from 'fs';
import * as path from 'path';
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

  //
  generateServersXml(settingsXml, inputs.servers);
  const settingStr = new XMLSerializer().serializeToString(settingsXml);
  console.log(formatter(settingStr));
}

export function generateServersXml(settingsXml: Document, servers: string) {
  if (!servers) {
    return;
  }

  const serversXml = settingsXml.getElementsByTagName('servers')[0];

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
