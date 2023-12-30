import { describe, expect, it } from '@jest/globals';
import { getEnv } from '../../../src/utils/env';

describe('env test', () => {
  it('Should get environment variable', () => {
    process.env.test_env = '1';
    expect(getEnv('test_env')).toEqual('1');
  });

  it('Should throw if environment variable not set', async () => {
    expect(() => {
      getEnv('non_existing_env');
    }).toThrow();
  });
});
