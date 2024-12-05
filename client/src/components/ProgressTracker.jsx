import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faStar } from "@fortawesome/free-solid-svg-icons";

const ProgressTracker = ({ xp, completedLessons, totalLessons }) => {
    const progressPercentage = (completedLessons.length / totalLessons) * 100;
  
    return (
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-2" />
            <span className="font-bold text-lg">{xp} XP</span>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
            <span>{completedLessons.length} / {totalLessons} Lessons</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    );
  };
  export default ProgressTracker;