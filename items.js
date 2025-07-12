import express from 'express';
import Item from '../models/Item.js';
import User from '../models/User.js';
import { auth, requireAdmin } from '../utils/auth.js';

const router = express.Router();

// Get all items with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      size,
      condition,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { status: 'approved', isAvailable: true };

    // Apply filters
    if (category) query.category = category;
    if (size) query.size = size;
    if (condition) query.condition = condition;
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const items = await Item.find(query)
      .populate('uploader', 'name avatar')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Item.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get featured items
router.get('/featured', async (req, res) => {
  try {
    const items = await Item.find({
      isFeatured: true,
      status: 'approved',
      isAvailable: true,
      $or: [
        { featuredUntil: { $gt: new Date() } },
        { featuredUntil: { $exists: false } }
      ]
    })
    .populate('uploader', 'name avatar')
    .limit(6)
    .sort({ createdAt: -1 });

    res.json({ items });
  } catch (error) {
    console.error('Get featured items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('uploader', 'name avatar bio')
      .populate('likes', 'name avatar')
      .populate('swapRequests.requester', 'name avatar');

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ item });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new item
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      size,
      condition,
      brand,
      color,
      material,
      images,
      tags,
      location,
      estimatedValue
    } = req.body;

    const item = new Item({
      title,
      description,
      category,
      size,
      condition,
      brand,
      color,
      material,
      images,
      tags,
      location,
      estimatedValue,
      uploader: req.user.userId
    });

    await item.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { 'stats.itemsUploaded': 1 }
    });

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to('admin-room').emit('admin-notification', {
        title: 'New Item Pending',
        message: `New item "${title}" is waiting for approval`
      });
    }

    res.status(201).json({ item });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check if user owns the item or is admin
    if (item.uploader.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('uploader', 'name avatar');

    res.json({ item: updatedItem });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check if user owns the item or is admin
    if (item.uploader.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle like on item
router.post('/:id/like', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const likeIndex = item.likes.indexOf(req.user.userId);
    
    if (likeIndex > -1) {
      item.likes.splice(likeIndex, 1);
    } else {
      item.likes.push(req.user.userId);
    }

    await item.save();

    res.json({ 
      item: item.toJSON(),
      isLiked: likeIndex === -1
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Request swap for item
router.post('/:id/swap-request', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.uploader.toString() === req.user.userId) {
      return res.status(400).json({ error: 'Cannot request swap for your own item' });
    }

    // Check if user already has a pending request
    const existingRequest = item.swapRequests.find(
      request => request.requester.toString() === req.user.userId && request.status === 'pending'
    );

    if (existingRequest) {
      return res.status(400).json({ error: 'You already have a pending swap request for this item' });
    }

    item.swapRequests.push({
      requester: req.user.userId,
      message
    });

    await item.save();

    // Emit socket event for real-time notification
    const io = req.app.get('io');
    if (io) {
      const requester = await User.findById(req.user.userId);
      io.to(`user-${item.uploader}`).emit('swap-request', {
        itemId: item._id,
        itemTitle: item.title,
        userName: requester.name,
        message
      });
    }

    res.json({ message: 'Swap request sent successfully' });
  } catch (error) {
    console.error('Swap request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin routes
router.get('/admin/pending', auth, requireAdmin, async (req, res) => {
  try {
    const items = await Item.find({ status: 'pending' })
      .populate('uploader', 'name email')
      .sort({ createdAt: -1 });

    res.json({ items });
  } catch (error) {
    console.error('Get pending items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/admin/:id/status', auth, requireAdmin, async (req, res) => {
  try {
    const { status, reason } = req.body;
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    item.status = status;
    if (status === 'rejected') {
      item.rejectionReason = reason;
    }

    await item.save();

    // Emit socket event for real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${item.uploader}`).emit('notification', {
        type: 'item-status',
        title: `Item ${status}`,
        message: status === 'approved' 
          ? `Your item "${item.title}" has been approved!`
          : `Your item "${item.title}" was rejected: ${reason}`,
        itemId: item._id
      });
    }

    res.json({ item });
  } catch (error) {
    console.error('Update item status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/admin/:id/feature', auth, requireAdmin, async (req, res) => {
  try {
    const { isFeatured, featuredUntil } = req.body;
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    item.isFeatured = isFeatured;
    if (featuredUntil) {
      item.featuredUntil = new Date(featuredUntil);
    }

    await item.save();

    res.json({ item });
  } catch (error) {
    console.error('Toggle feature error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 