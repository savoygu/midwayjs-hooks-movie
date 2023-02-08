import { createConfiguration, hooks } from '@midwayjs/hooks';
import * as Koa from '@midwayjs/koa';
import { logger } from '../middleware/logger';

/**
 * setup midway server
 */
export default createConfiguration({
  imports: [
    Koa,
    hooks({
      middleware: [logger],
    }),
  ],
  importConfigs: [{ default: { keys: 'session_keys' } }],
});
