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
exports.generateServersXml = exports.generateSettingXml = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
    //
    generateServersXml(settingsXml, inputs.servers);
    const settingStr = new xmldom_1.XMLSerializer().serializeToString(settingsXml);
    console.log((0, xml_formatter_1.default)(settingStr));
}
exports.generateSettingXml = generateSettingXml;
function generateServersXml(settingsXml, servers) {
    if (!servers) {
        return;
    }
    const serversXml = settingsXml.getElementsByTagName('servers')[0];
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
