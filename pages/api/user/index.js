import UserModel from '../../../models/mongoose/userModel';
import clearTokenCookie from '../../../lib/clearTokenCookie';
import dbConnect from '../../../lib/dbConnect';
import withAuth from '../../../lib/withAuth';

async function handler(req, res) {
  if (req.method === 'GET') {
    await dbConnect();
    const user = await UserModel.findOne({ email: req.email }, '-password');
  
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }
  
    res.status(200).json(user);
  } else if (req.method === 'DELETE') {
    await dbConnect();
    await UserModel.deleteOne({ email: req.email });

    res.setHeader('Set-Cookie', clearTokenCookie())
      .status(200).json({ success: true });
  } else {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }
}

export default withAuth(handler);
