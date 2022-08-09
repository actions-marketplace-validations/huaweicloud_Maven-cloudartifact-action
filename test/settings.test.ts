import * as settings from '../src/settings';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('generate setting xml', () => {
  const testCase = [
    {
      description: '参数全空',
      inputs: {
        servers: '',
        mirrors: '',
        repositories: '',
        pluginRepositories: ''
      },
      result: 'https://repo1.maven.org/maven2'
    },
    {
      description: '传入server',
      inputs: {
        servers:
          '[{ "id": "release_1_0", "username": "servers_username", "password": "***" }]',
        mirrors: '',
        repositories: '',
        pluginRepositories: ''
      },
      result: 'servers_username'
    },
    {
      description: '传入mirrors',
      inputs: {
        servers: '',
        mirrors:
          '[{ "id": "z_mirrors", "mirrorOf": "*,!release_1_0,!snapshot_2_0", "url": "https://<mirror url>" }]',
        repositories: '',
        pluginRepositories: ''
      },
      result: 'https://<mirror url>'
    },
    {
      description: '传入repositories',
      inputs: {
        servers: '',
        mirrors: '',
        repositories:
          '[{"id": "release_xxxx_1_0", "url": "https://<release_private_repo_url>", "releases": {"enabled": true}, "snapshots": {"enabled": false}},{"id": "snapshot_xxxxx_2_0", "url": "https://<snapshot_private_repo_url>", "releases": {"enabled": false}, "snapshots": {"enabled": true}}]',
        pluginRepositories: ''
      },
      result:
        'https://<release_private_repo_url>'
    },
    {
      description: '传入pluginRepositories',
      inputs: {
        servers: '',
        mirrors: '',
        repositories: '',
        pluginRepositories:
          '[{"id": "release_xxxx_1_0", "url": "https://<release_private_repo_url>", "releases": {"enabled": true}, "snapshots": {"enabled": false}},{"id": "snapshot_xxxxx_2_0", "url": "https://<snapshot_private_repo_url>", "releases": {"enabled": false}, "snapshots": {"enabled": true}}]'
      },
      result:
        'https://<release_private_repo_url>'
    }
  ];
  testCase.forEach(item => {
    const {description, inputs, result} = item;
    test(`${description}`, async () => {
      settings.generateSettingXml(inputs);
      const filePath = path.join(os.homedir(), '.m2', 'settings.xml');
      const data = fs.readFileSync(filePath, 'utf-8');
      expect(data).toContain(result);
      fs.unlinkSync(filePath);
    });
  });
});

describe('test whether the servers inputs is valid', () => {
  const testCase = [
    {
      description: 'servers id不存在',
      inputs: {
        servers: '[{"username": "username", "password": "password"}]',
        mirrors: '',
        repositories: '',
        pluginRepositories: ''
      }
    },
    {
      description: 'servers username不存在',
      inputs: {
        servers: '[{"id": "serverId", "password": "password"}]',
        mirrors: '',
        repositories: '',
        pluginRepositories: ''
      }
    },
    {
      description: 'servers password不存在',
      inputs: {
        servers: '[{"id": "serverId", "username": "username"}]',
        mirrors: '',
        repositories: '',
        pluginRepositories: ''
      }
    }
  ];
  testCase.forEach(item => {
    const {description, inputs} = item;
    test(`${description}`, async () => {
      const settingsXml = settings.getTemplate('../templates', 'settings.xml');
      expect(() =>
        settings.generateServersXml(settingsXml, inputs.servers)
      ).toThrow('servers must contain id, and username and password');
    });
  });
});

describe('test whether the mirrors inputs is valid', () => {
  const testCase = [
    {
      description: 'mirrors id不存在',
      inputs: {
        servers: '',
        mirrors: '[{ "mirrorOf": "mirrorOf", "url": "mirror url" }]',
        repositories: '',
        pluginRepositories: ''
      }
    },
    {
      description: 'mirrors mirrorOf不存在',
      inputs: {
        servers: '',
        mirrors: '[{ "id": "id","url": "mirror url" }]',
        repositories: '',
        pluginRepositories: ''
      }
    },
    {
      description: 'mirrors url不存在',
      inputs: {
        servers: '',
        mirrors: '[{ "id": "id", "mirrorOf": "mirrorOf"}]',
        repositories: '',
        pluginRepositories: ''
      }
    }
  ];
  testCase.forEach(item => {
    const {description, inputs} = item;
    test(`${description}`, async () => {
      const settingsXml = settings.getTemplate('../templates', 'settings.xml');
      expect(() =>
        settings.generateMirrorsXml(settingsXml, inputs.mirrors)
      ).toThrow('mirrors must contain id, and mirrorOf and url');
    });
  });
});

describe('test whether the profiles inputs is valid', () => {
  const testCase = [
    {
      description: 'profiles repositories id不存在',
      inputs: {
        servers: '',
        mirrors: '',
        repositories: '[{ "url": "url" }]',
        pluginRepositories: ''
      },
      tag: 'repositories'
    },
    {
      description: 'profiles repositories url不存在',
      inputs: {
        servers: '',
        mirrors: '',
        repositories: '[{ "id": "id"}]',
        pluginRepositories: ''
      },
      tag: 'repositories'
    },
    {
      description: 'profiles plugin_repositories id不存在',
      inputs: {
        servers: '',
        mirrors: '',
        repositories: '',
        pluginRepositories: '[{ "url": "url" }]'
      },
      tag: 'pluginRepositories'
    },
    {
      description: 'profiles plugin_repositories url不存在',
      inputs: {
        servers: '',
        mirrors: '',
        repositories: '',
        pluginRepositories: '[{ "id": "id"}]'
      },
      tag: 'pluginRepositories'
    }
  ];
  testCase.forEach(item => {
    const {description, inputs, tag} = item;
    test(`${description}`, async () => {
      const settingsXml = settings.getTemplate('../templates', 'settings.xml');

      expect(() =>
        settings.generateProfilesXml(
          settingsXml,
          inputs.repositories,
          inputs.pluginRepositories
        )
      ).toThrow(tag + ' must contain id and url');
    });
  });
});

describe('file or directory does not exist ', () => {
  const testCase = [
    {
      description: '文件夹不存在',
      filePath: '../result',
      fileName: 'settings.xml'
    },
    {
      description: '文件不存在',
      filePath: '../templates',
      fileName: 'settingas.xml'
    }
  ];
  testCase.forEach(item => {
    const {description, filePath, fileName} = item;
    test(`${description}`, async () => {
      expect(() => {
        settings.getTemplate(filePath, fileName);
      }).toThrow();
    });
  });
});

describe('file and directory exists ', () => {
  const testCase = [
    {
      description: '文件存在',
      filePath: '../templates',
      fileName: 'settings.xml'
    }
  ];
  testCase.forEach(item => {
    const {description, filePath, fileName} = item;
    test(`${description}`, async () => {
      expect(settings.getTemplate(filePath, fileName)).toHaveReturned;
    });
  });
});
