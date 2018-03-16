import { expect } from 'chai';

import { addPlugin, checkMetadata } from '../plugins/utils';

describe('addPlugin', () => {
  let modules;
  beforeEach(() => {
    modules = [
      {
        metadata: {
          name: 'plugin1',
          version: '0.0.1'
        }
      },
      {
        metadata: {
          name: 'plugin2',
          version: '0.1.1'
        }
      },
      {
        metadata: {
          name: 'plugin3',
          version: '0.0.1'
        }
      }
    ];
  });

  it('should push a new plugin to the end of the array', () => {
    const plugin = {
      metadata: {
        name: 'plugin4',
        version: '0.0.1'
      }
    };
    const updatedModules = addPlugin(modules, plugin);
    expect(updatedModules[updatedModules.length - 1]).to.deep.equal(plugin);
  });

  it('should replace plugin of the same name if the version is smaller/older', () => {
    const plugin = { metadata: Object.assign({}, modules[1].metadata) };
    const newVersion = '0.10.1';
    plugin.metadata.version = newVersion;
    const updatedModules = addPlugin(modules, plugin);

    expect(updatedModules.length).to.equal(modules.length);
    expect(updatedModules[1].metadata.version).to.equal(newVersion);
  });

  it('should not add a plugin that already exists and has lesser version', () => {
    const plugin = { metadata: Object.assign({}, modules[1].metadata) };
    const newVersion = '0.0.5';
    plugin.metadata.version = newVersion;
    const updatedModules = addPlugin(modules, plugin);

    expect(updatedModules.length).to.equal(modules.length);
    expect(updatedModules[1].metadata.version).to.not.equal(newVersion);
  });
});

describe('checkMetadata', () => {
  it('should throw if there is no plugin name', () => {
    const test = {
      pathName: 'path',
      displayName: 'display',
      version: '0.0.1'
    };
    expect(() => checkMetadata(test)).to.throw();
  });

  it('should throw for file names that are not compatible with npm', () => {
    // examples from npm tests
    // https://github.com/npm/validate-npm-package-name/blob/master/test/index.js
    const invalid = [
      {
        name: ''
      },
      {
        name: ' leading'
      },
      {
        name: 'Capital'
      },
      {
        name: 'weird:character'
      },
      {
        name: '.start-period'
      },
      {
        name: ' _start-underscore'
      },
      {
        name: ' leading'
      },
      {
        name: 's/l/a/s/h/e/s'
      },
      {
        name: 'node_modules'
      },
      {
        name: 'favicon.ico'
      },
      {
        name: 'http'
      },
      {
        name:
          'ifyouwanttogetthesumoftwonumberswherethosetwonumbersarechosenbyfindingthelargestoftwooutofthreenumbersandsquaringthemwhichismultiplyingthembyitselfthenyoushouldinputthreenumbersintothisfunctionanditwilldothatforyou-'
      }
    ];

    invalid.forEach(meta => expect(() => checkMetadata(meta)).to.throw());
  });

  it("should set displayName from name if it doesn't exist", () => {
    const testName = 'test-name';
    const expected = {
      name: testName,
      displayName: testName
    };
    const test = checkMetadata({ name: testName });
    expect(test).to.deep.equal(expected);
  });

  it('should make sure pathName is encoded for URI if set', () => {
    const testPath = 'my path';
    const expectedPath = encodeURI(testPath);
    const test = checkMetadata({ name: 'test', pathName: testPath });
    expect(test.pathName).to.equal(expectedPath);
  });
});
