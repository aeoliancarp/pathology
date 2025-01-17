import type { NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import withAuth, { NextApiRequestWithAuth } from '../../../lib/withAuth';
import Collection from '../../../models/db/collection';
import { CollectionModel } from '../../../models/mongoose';

export default withAuth({ GET: {} }, async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
  await dbConnect();

  const collections = await CollectionModel.find<Collection>({ userId: req.userId }).sort({ name: 1 });

  return res.status(200).json(collections);
});
