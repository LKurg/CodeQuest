import React, { useState, useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
import DashboardSidebar from '../Layout/DashboardSideBar';
import ApexCharts from 'react-apexcharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faTrophy, 
  faChartLine, 
  faCodeBranch,
  faAward,
  faFire,
  faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';

// Streak Card Component
const StreakCard = ({ streakData }) => {
  const getStreakColor = (days) => {
    if (days >= 30) return 'text-red-500';
    if (days >= 14) return 'text-orange-500';
    return 'text-yellow-500';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Learning Streak</h2>
        <FontAwesomeIcon 
          icon={faFire} 
          className={`text-2xl ${getStreakColor(streakData.currentStreak)}`} 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Current Streak</p>
          <p className={`text-3xl font-bold ${getStreakColor(streakData.currentStreak)}`}>
            {streakData.currentStreak} days
          </p>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Longest Streak</p>
          <p className="text-3xl font-bold text-indigo-500">
            {streakData.longestStreak} days
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-600 text-center">
          Last active: {new Date(streakData.lastActivity).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-2">Last 7 Days Activity:</p>
        <div className="grid grid-cols-7 gap-1">
          {[...Array(7)].map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - index));
            const isActive = streakData.activeDates?.some(
              activeDate => new Date(activeDate).toDateString() === date.toDateString()
            );
            
            return (
              <div
                key={index}
                className={`h-8 rounded-md flex items-center justify-center text-xs
                  ${isActive 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-gray-100 text-gray-400'}`}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function Progress() {
  const [progressData, setProgressData] = useState({
    courses: [],
    overallProgress: 0,
    totalCoursesCompleted: 0,
    totalXP: 0,
    achievements: [],
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActivity: new Date(),
      activeDates: []
    }
  });

  const [chartData, setChartData] = useState({
    courseProgressChart: {
      series: [],
      options: {
        chart: { type: 'bar', height: 350 },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: { categories: [] },
        yaxis: { title: { text: 'Progress (%)' } },
        fill: { opacity: 1 },
        tooltip: { y: { formatter: (val) => `${val}%` } },
        colors: ['#14b8a6']
      }
    },
    skillProgressChart: {
      series: [],
      options: {
        chart: { type: 'radialBar' },
        plotOptions: {
          radialBar: {
            hollow: { size: '70%' },
            dataLabels: {
              name: { show: false },
              value: { 
                show: true,
                formatter: (val) => `${val}%`
              }
            }
          }
        },
        labels: [],
        colors: ['#14b8a6', '#f97316', '#6366f1']
      }
    }
  });

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/detailed-progress', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setProgressData(data);

        // Prepare course progress chart data
        const courseProgressSeries = [{
          name: 'Course Progress',
          data: data.courses.map(course => course.progressPercentage)
        }];
        const courseProgressCategories = data.courses.map(course => course.title);

        // Prepare skill progress chart data
        const skillProgressSeries = data.skillProgress.map(skill => skill.percentage);
        const skillProgressLabels = data.skillProgress.map(skill => skill.name);

        setChartData(prev => ({
          ...prev,
          courseProgressChart: {
            ...prev.courseProgressChart,
            series: courseProgressSeries,
            options: {
              ...prev.courseProgressChart.options,
              xaxis: { categories: courseProgressCategories }
            }
          },
          skillProgressChart: {
            ...prev.skillProgressChart,
            series: skillProgressSeries,
            options: {
              ...prev.skillProgressChart.options,
              labels: skillProgressLabels
            }
          }
        }));
      } catch (error) {
        console.error('Failed to fetch progress data:', error);
      }
    };

    fetchProgressData();
  }, []);

  return (
    <MainLayout>
      <DashboardSidebar>
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Learning Progress</h1>
          </div>

      
     

          {/* Overall Progress Summary */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FontAwesomeIcon icon={faBook} className="text-teal-500 text-3xl mr-4" />
              <div>
                <h3 className="text-gray-500 text-sm">Overall Progress</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {progressData.overallProgress}%
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 text-3xl mr-4" />
              <div>
                <h3 className="text-gray-500 text-sm">Courses Completed</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {progressData.totalCoursesCompleted}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FontAwesomeIcon icon={faChartLine} className="text-blue-500 text-3xl mr-4" />
              <div>
                <h3 className="text-gray-500 text-sm">Total XP</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {progressData.totalXP}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FontAwesomeIcon icon={faCodeBranch} className="text-purple-500 text-3xl mr-4" />
              <div>
                <h3 className="text-gray-500 text-sm">Technologies Learned</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {progressData.skillProgress?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <StreakCard streakData={progressData.streak} />
          </div>
          {/* Detailed Progress Charts */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Course Progress
              </h2>
              <ApexCharts
                options={chartData.courseProgressChart.options}
                series={chartData.courseProgressChart.series}
                type="bar"
                height={350}
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Skill Proficiency
              </h2>
              <ApexCharts
                options={chartData.skillProgressChart.options}
                series={chartData.skillProgressChart.series}
                type="radialBar"
                height={350}
              />
            </div>
          </div>

          {/* Achievements Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                <FontAwesomeIcon icon={faAward} className="mr-3 text-orange-500" />
                Achievements
              </h2>
            </div>
            {progressData.achievements.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {progressData.achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 p-4 rounded-lg flex items-center border-l-4 border-teal-500"
                  >
                    <div className="mr-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon 
                          icon={achievement.icon || faTrophy} 
                          className="text-teal-600" 
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {achievement.description}
                      </p>
                      <span className="text-xs text-gray-500">
                        Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No achievements earned yet. Keep learning!
              </div>
            )}
          </div>
        </div>
      </DashboardSidebar>
    </MainLayout>
  );
}

export default Progress;