import React, { useState, useEffect } from 'react';
import Navigation from '../Layout/Navigation';
import DashboardSidebar from '../Layout/DashboardSideBar';
import ApexCharts from 'react-apexcharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCode, 
  faTrophy, 

  faChartLine, 
  faClock
} from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const [learningStats, setLearningStats] = useState({
    totalCoursesCompleted: 0,
    totalXP: 0,
    currentStreak: 0,
    timeSpentLearning: 0
  });

  const [chartData, setChartData] = useState({
    progressOverTime: {
      series: [{
        name: 'XP Gained',
        data: [10, 41, 35, 51, 49, 62, 69]
      }],
      options: {
        chart: {
          type: 'line',
          height: 350,
          toolbar: { show: false }
        },
        colors: ['#14b8a6'],
        xaxis: {
          categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']
        },
        title: {
          text: 'Learning Progress',
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1f2937'
          }
        }
      }
    },
    courseCompletion: {
      series: [44, 55, 41],
      options: {
        chart: {
          type: 'pie',
          height: 350
        },
        labels: ['Completed', 'In Progress', 'Not Started'],
        colors: ['#14b8a6', '#fbbf24', '#ef4444'],
        legend: {
          position: 'bottom'
        },
        title: {
          text: 'Course Progress',
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1f2937'
          }
        }
      }
    }
  });

  useEffect(() => {
    // Fetch learning statistics from backend
    const fetchLearningStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setLearningStats(data);
      } catch (error) {
        console.error('Failed to fetch learning stats:', error);
      }
    };

    fetchLearningStats();
  }, []);

  return (
    <Navigation>
      <DashboardSidebar>
        <div className="p-8 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
          
          {/* Quick Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FontAwesomeIcon icon={faCode} className="text-teal-500 text-3xl mr-4" />
              <div>
                <h3 className="text-gray-500 text-sm">Courses Completed</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {learningStats.totalCoursesCompleted}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 text-3xl mr-4" />
              <div>
                <h3 className="text-gray-500 text-sm">Total XP</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {learningStats.totalXP}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FontAwesomeIcon icon={faClock} className="text-blue-500 text-3xl mr-4" />
              <div>
                <h3 className="text-gray-500 text-sm">Learning Streak</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {learningStats.currentStreak} Days
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FontAwesomeIcon icon={faChartLine} className="text-green-500 text-3xl mr-4" />
              <div>
                <h3 className="text-gray-500 text-sm">Hours Learned</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {learningStats.timeSpentLearning}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Learning Progress Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <ApexCharts
                options={chartData.progressOverTime.options}
                series={chartData.progressOverTime.series}
                type="line"
                height={350}
              />
            </div>

            {/* Course Completion Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <ApexCharts
                options={chartData.courseCompletion.options}
                series={chartData.courseCompletion.series}
                type="pie"
                height={350}
              />
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Learning Activity</h2>
            {/* You can add a list of recent courses, achievements, etc. */}
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-gray-700">Completed JavaScript Fundamentals Course</p>
                <span className="text-sm text-gray-500">2 days ago</span>
              </div>
              <div className="border-b pb-4">
                <p className="text-gray-700">Earned "React Beginner" Badge</p>
                <span className="text-sm text-gray-500">5 days ago</span>
              </div>
              <div>
                <p className="text-gray-700">Started Node.js Backend Development Path</p>
                <span className="text-sm text-gray-500">1 week ago</span>
              </div>
            </div>
          </div>
        </div>
      </DashboardSidebar>
    </Navigation>
  );
}

export default Dashboard;