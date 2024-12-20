import { useEffect, useState, useRef } from 'react';

const useCourseAnalytics = (courseId, activeLesson, completedLessons, userProgress) => {
  const startTimeRef = useRef(Date.now());
  const lastActivityRef = useRef(Date.now());
  const timePerLessonRef = useRef({});
  const clickCountRef = useRef(0);
  const [isActive, setIsActive] = useState(true);

  // Track user activity and clicks
  useEffect(() => {
    const trackActivity = () => {
      lastActivityRef.current = Date.now();
      setIsActive(true);
    };

    const trackClick = () => {
      clickCountRef.current += 1;
      trackActivity();
    };

    // Track various user interactions
    window.addEventListener('mousemove', trackActivity);
    window.addEventListener('keypress', trackActivity);
    window.addEventListener('click', trackClick); // Changed to trackClick
    window.addEventListener('scroll', trackActivity);

    // Check for inactivity every minute
    const inactivityCheck = setInterval(() => {
      if (Date.now() - lastActivityRef.current > 5 * 60 * 1000) { // 5 minutes
        setIsActive(false);
      }
    }, 60000);

    return () => {
      window.removeEventListener('mousemove', trackActivity);
      window.removeEventListener('keypress', trackActivity);
      window.removeEventListener('click', trackClick);
      window.removeEventListener('scroll', trackActivity);
      clearInterval(inactivityCheck);
    };
  }, []);

  // Track time per lesson
  useEffect(() => {
    if (activeLesson) {
      const lessonStartTime = Date.now();

      return () => {
        const timeSpent = Date.now() - lessonStartTime;
        timePerLessonRef.current[activeLesson] = 
          (timePerLessonRef.current[activeLesson] || 0) + timeSpent;
      };
    }
  }, [activeLesson]);

  // Send analytics data when user leaves
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (!userProgress?.course?.sections) return;

      const endTime = Date.now();
      const totalTimeSpent = endTime - startTimeRef.current;
      
      // Calculate total lessons from course sections
      const totalLessons = userProgress.course.sections.reduce(
        (total, section) => total + (section.lessons?.length || 0),
        0
      );

      // Only send analytics if we have valid data
      if (totalLessons > 0) {
        const analyticsData = {
          courseId,
          totalTimeSpent,
          timePerLesson: timePerLessonRef.current,
          completedLessons: completedLessons.length,
          lastLesson: activeLesson,
          completionPercentage: (completedLessons.length / totalLessons) * 100,
          isCompleted: completedLessons.length === totalLessons,
          clicks: clickCountRef.current // Added click count
        };

        try {
          const token = localStorage.getItem('token');
          // Use navigator.sendBeacon for more reliable data sending on page unload
          const blob = new Blob([JSON.stringify(analyticsData)], {
            type: 'application/json',
          });
          navigator.sendBeacon(
            'http://localhost:5000/api/analytics/course-progress',
            blob
          );
          console.log('Analytics data sent successfully:', analyticsData);
        } catch (error) {
          console.error('Error sending analytics:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload(); // Send analytics when component unmounts
    };
  }, [courseId, activeLesson, completedLessons, userProgress]);

  // Periodic analytics updates
  useEffect(() => {
    const sendPeriodicUpdate = async () => {
      if (!isActive) return;

      const currentTime = Date.now();
      const sessionDuration = currentTime - startTimeRef.current;

      const analyticsData = {
        courseId,
        sessionDuration,
        currentLesson: activeLesson,
        completedLessons,
        timePerLesson: timePerLessonRef.current,
        lastActive: lastActivityRef.current,
        clicks: clickCountRef.current, // Added click count
        totalTimeSpent: sessionDuration // Added total time spent
      };

      try {
        const token = localStorage.getItem('token');
        await fetch('http://localhost:5000/api/analytics/session-update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(analyticsData)
        });
      } catch (error) {
        console.error('Error sending periodic update:', error);
      }
    };

    // Send initial update
    sendPeriodicUpdate();

    const updateInterval = setInterval(sendPeriodicUpdate, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(updateInterval);
  }, [courseId, activeLesson, completedLessons, isActive]);

  // Debug logging (remove in production)
  useEffect(() => {
    const logInterval = setInterval(() => {
      console.log('Current Analytics State:', {
        clicks: clickCountRef.current,
        timeSpent: Date.now() - startTimeRef.current,
        isActive,
        lastActivity: new Date(lastActivityRef.current).toISOString()
      });
    }, 10000);

    return () => clearInterval(logInterval);
  }, [isActive]);

  return null;
};

export default useCourseAnalytics;