const { User } = require('../models/User');
const Course = require('../models/Course');
const PaymentDetails = require('../models/PaymentDetails');
const jwt = require('jsonwebtoken');

const getDashboardStats = async (req, res) => {
  try {
    // Verify the token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });

    // Total Users
    const totalUsers = await User.countDocuments();

    // Total Revenue
    const totalRevenue = await PaymentDetails.aggregate([
      { $match: { status: 'SUCCESS' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]);

    const revenue = totalRevenue.length ? totalRevenue[0].totalRevenue : 0;

    // Total Courses Created
    const totalCourses = await Course.countDocuments();

    // Premium Users and Sales Rate
    const premiumUsers = await User.aggregate([
      { $match: { 'subscription.type': 'premium' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$subscription.startedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Total premium users count
    const totalPremiumUsers = await User.countDocuments({ 'subscription.type': 'premium' });
console.log('Admin stats fetched successfully.',res.json);
    res.json({
      totalUsers,
      totalRevenue: `Ksh ${revenue}`,
      totalCourses,
      totalPremiumUsers,
      salesData: premiumUsers,
    });
    console.log('Admin stats fetched successfully.',res.json);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin statistics.' });
  }
};

module.exports = {
    getDashboardStats,
};
