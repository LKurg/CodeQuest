import React, { useState, useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
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
  const [detailedProgress, setDetailedProgress] = useState({
    totalCoursesCompleted: 0,
    totalXP: 0,
    overallProgress: 0,
    skillProgress: [],
    courses: []
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
      series: [0, 0, 0],
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
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch detailed progress
        const progressResponse = await fetch('http://localhost:5000/api/users/detailed-progress', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const progressData = await progressResponse.json();
        setDetailedProgress(progressData);

        // Update course completion chart
        const completedCourses = progressData.courses.filter(course => course.progressPercentage === 100).length;
        const inProgressCourses = progressData.courses.filter(course => course.progressPercentage > 0 && course.progressPercentage < 100).length;
        const notStartedCourses = progressData.courses.filter(course => course.progressPercentage === 0).length;

        setChartData(prevData => ({
          ...prevData,
          courseCompletion: {
            ...prevData.courseCompletion,
            series: [completedCourses, inProgressCourses, notStartedCourses]
          }
        }));

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <MainLayout>
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
                  {detailedProgress.totalCoursesCompleted}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 text-3xl mr-4" />
              <div>
                <h3 className="text-gray-500 text-sm">Total XP</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {detailedProgress.totalXP}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FontAwesomeIcon icon={faChartLine} className="text-blue-500 text-3xl mr-4" />
              <div>
                <h3 className="text-gray-500 text-sm">Overall Progress</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {detailedProgress.overallProgress}%
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
        </div>
      </DashboardSidebar>
    </MainLayout>
  );
}

export default Dashboard;
