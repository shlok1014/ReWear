import express from 'express';
import User from '../models/User.js';
import Item from '../models/Item.js';
import { auth, requireAdmin } from '../utils/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's uploaded items
router.get('/my-items', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { uploader: req.user.userId };
    if (status) query.status = status;

    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Item.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get my items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get swap requests sent by user
router.get('/swap-requests', auth, async (req, res) => {
  try {
    const items = await Item.find({
      'swapRequests.requester': req.user.userId
    })
    .populate('uploader', 'name avatar')
    .sort({ 'swapRequests.createdAt': -1 });

    const requests = items.flatMap(item => 
      item.swapRequests
        .filter(request => request.requester.toString() === req.user.userId)
        .map(request => ({
          ...request.toObject(),
          item: {
            _id: item._id,
            title: item.title,
            images: item.images,
            uploader: item.uploader
          }
        }))
    );

    res.json({ requests });
  } catch (error) {
    console.error('Get swap requests error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get swap requests received by user
router.get('/received-requests', auth, async (req, res) => {
  try {
    const items = await Item.find({
      uploader: req.user.userId,
      'swapRequests.0': { $exists: true }
    })
    .populate('swapRequests.requester', 'name avatar')
    .sort({ 'swapRequests.createdAt': -1 });

    const requests = items.flatMap(item => 
      item.swapRequests.map(request => ({
        ...request.toObject(),
        item: {
          _id: item._id,
          title: item.title,
          images: item.images
        }
      }))
    );

    res.json({ requests });
  } catch (error) {
    console.error('Get received requests error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Respond to swap request
router.put('/swap-request/:itemId/:requestId', auth, async (req, res) => {
  try {
    const { status, message } = req.body;
    const { itemId, requestId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.uploader.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const request = item.swapRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Swap request not found' });
    }

    request.status = status;
    if (message) {
      request.responseMessage = message;
    }

    await item.save();

    // Emit socket event for real-time notification
    const io = req.app.get('io');
    if (io) {
      const uploader = await User.findById(req.user.userId);
      io.to(`user-${request.requester}`).emit('notification', {
        type: 'swap-response',
        title: `Swap Request ${status}`,
        message: `${uploader.name} has ${status} your swap request for "${item.title}"`,
        itemId: item._id
      });
    }

    res.json({ message: `Swap request ${status} successfully` });
  } catch (error) {
    console.error('Respond to swap request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get additional stats from items
    const [totalItems, approvedItems, pendingItems, totalLikes] = await Promise.all([
      Item.countDocuments({ uploader: req.user.userId }),
      Item.countDocuments({ uploader: req.user.userId, status: 'approved' }),
      Item.countDocuments({ uploader: req.user.userId, status: 'pending' }),
      Item.aggregate([
        { $match: { uploader: user._id } },
        { $group: { _id: null, totalLikes: { $sum: { $size: '$likes' } } } }
      ])
    ]);

    const stats = {
      ...user.stats,
      totalItems,
      approvedItems,
      pendingItems,
      totalLikes: totalLikes[0]?.totalLikes || 0
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin routes
router.get('/admin/all', auth, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/admin/:userId', auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's items
    const items = await Item.find({ uploader: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ user, items });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/admin/:userId/role', auth, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/admin/:userId/ban', auth, requireAdmin, async (req, res) => {
  try {
    const { isBanned, reason } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isBanned, banReason: reason || '' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/admin/dashboard', auth, requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalItems,
      pendingItems,
      approvedItems,
      recentUsers,
      recentItems
    ] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Item.countDocuments({ status: 'pending' }),
      Item.countDocuments({ status: 'approved' }),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
      Item.find().sort({ createdAt: -1 }).limit(5).populate('uploader', 'name')
    ]);

    const stats = {
      totalUsers,
      totalItems,
      pendingItems,
      approvedItems,
      recentUsers,
      recentItems
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 