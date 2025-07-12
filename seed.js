import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Item from './models/Item.js';
import { generateSampleItems } from './utils/unsplash.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rewear';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = new User({
      name: 'Admin User',
      email: '23ce001@charusat.edu.in',
      password: adminPassword,
      role: 'admin',
      bio: 'Platform administrator',
      location: 'Charusat University',
      isVerified: true,
      badges: ['community_leader']
    });
    await adminUser.save();
    console.log('👤 Created admin user');

    // Create sample customer users
    const customerUsers = [];
    const customerData = [
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        bio: 'Fashion enthusiast and sustainability advocate',
        location: 'New York, NY',
        badges: ['eco_warrior', 'fashion_forward']
      },
      {
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        bio: 'Minimalist lifestyle, quality over quantity',
        location: 'San Francisco, CA',
        badges: ['first_swap', 'helpful_member']
      },
      {
        name: 'Emma Davis',
        email: 'emma.davis@example.com',
        bio: 'Thrift store lover and DIY fashion creator',
        location: 'Austin, TX',
        badges: ['eco_warrior']
      },
      {
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@example.com',
        bio: 'Student with a passion for sustainable fashion',
        location: 'Miami, FL',
        badges: ['first_swap']
      }
    ];

    for (const data of customerData) {
      const password = await bcrypt.hash('password123', 12);
      const user = new User({
        ...data,
        password,
        role: 'customer',
        isVerified: true
      });
      await user.save();
      customerUsers.push(user);
    }
    console.log('👥 Created customer users');

    // Generate sample items
    const sampleItems = generateSampleItems();
    
    // Create items for each user
    for (let i = 0; i < sampleItems.length; i++) {
      const itemData = sampleItems[i];
      const user = customerUsers[i % customerUsers.length];
      
      const item = new Item({
        ...itemData,
        uploader: user._id,
        status: 'approved'
      });
      
      await item.save();
      
      // Update user stats
      await User.findByIdAndUpdate(user._id, {
        $inc: { 'stats.itemsUploaded': 1 }
      });
    }
    console.log('👕 Created sample items');

    // Create some pending items for admin moderation
    const pendingItems = generateSampleItems().slice(0, 3);
    for (const itemData of pendingItems) {
      const user = customerUsers[Math.floor(Math.random() * customerUsers.length)];
      
      const item = new Item({
        ...itemData,
        uploader: user._id,
        status: 'pending'
      });
      
      await item.save();
    }
    console.log('⏳ Created pending items for moderation');

    // Create some featured items
    const featuredItems = generateSampleItems().slice(0, 2);
    for (const itemData of featuredItems) {
      const user = customerUsers[Math.floor(Math.random() * customerUsers.length)];
      
      const item = new Item({
        ...itemData,
        uploader: user._id,
        status: 'approved',
        isFeatured: true,
        featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      });
      
      await item.save();
    }
    console.log('⭐ Created featured items');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Sample Data:');
    console.log(`- Admin User: 23ce001@charusat.edu.in / admin123`);
    console.log(`- Customer Users: sarah.johnson@example.com / password123`);
    console.log(`- Total Users: ${await User.countDocuments()}`);
    console.log(`- Total Items: ${await Item.countDocuments()}`);
    console.log(`- Approved Items: ${await Item.countDocuments({ status: 'approved' })}`);
    console.log(`- Pending Items: ${await Item.countDocuments({ status: 'pending' })}`);
    console.log(`- Featured Items: ${await Item.countDocuments({ isFeatured: true })}`);

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the seed function
seedDatabase(); 