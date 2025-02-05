import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faUsers, faDollarSign, faShoppingCart, faChartLine } from '@fortawesome/free-solid-svg-icons';
import ReactApexChart from 'react-apexcharts';
import AdminLayout from '../../Layout/AdminLayout';
import axios from 'axios';

const StatsCard = ({ title, value, increase, icon, color }) => (
  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
        <div className="text-2xl font-bold text-gray-900 mb-2">{value}</div>
        <div className={`text-sm ${increase >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {increase >= 0 ? 'Increased' : 'Decreased'} By {Math.abs(increase)}%
        </div>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <FontAwesomeIcon icon={icon} className="text-white text-xl" />
      </div>
    </div>
  </div>
);

const SalesChart = ({ salesData }) => {
  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      categories: salesData.map((data) => data._id),
    },
    colors: ['#4F46E5'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
      },
    },
  };

  const series = [
    {
      name: 'Sales',
      data: salesData.map((data) => data.count),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
        <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Year</option>
        </select>
      </div>
      <ReactApexChart options={chartOptions} series={series} type="area" height={350} />
    </div>
  );
};

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 'Ksh 0',
    totalCourses: 0,
    totalPremiumUsers: 0,
    salesData: [],
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statsData = [
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      increase: 2.56,
      icon: faCode,
      color: 'bg-blue-600',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      increase: 0.34,
      icon: faUsers,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      increase: 7.66,
      icon: faDollarSign,
      color: 'bg-pink-500',
    },
    {
      title: 'Premium Users',
      value: stats.totalPremiumUsers,
      increase: -0.74,
      icon: faShoppingCart,
      color: 'bg-orange-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
            <p className="text-gray-500">Monitor your business metrics</p>
          </div>
          <div className="flex space-x-4">
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              defaultValue="2024-05-01"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Share
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <SalesChart salesData={stats.salesData} />
      </div>
    </AdminLayout>
  );
};

export default AdminHome;