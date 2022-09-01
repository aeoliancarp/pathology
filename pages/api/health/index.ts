/* istanbul ignore file */

import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '../../../helpers/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { statusCode } = req.query;

  logger.info('TESTING INFO LOG');
  logger.warn('TESTING WARN LOG');
  logger.debug('TESTING DEBUG LOG');
  logger.error('TESTING ERROR LOG');
  logger.log('info', 'TESTING INFO LOG B', { testprop: 'test prop 1' });
  logger.log('warn', 'TESTING WARN LOG B', { testprop: 'test prop 2' });
  logger.log('debug', 'TESTING DEBUG LOG B', { testprop: 'test prop 3' });
  logger.log('error', 'TESTING ERROR LOG B', { testprop: 'test prop 4' });

  return res.status(parseInt(statusCode as string) || 200).json({ status: 'OK' });
}
