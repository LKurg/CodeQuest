const CodeChallenge = ({ lesson, onSuccess }) => {
    const [code, setCode] = useState(lesson?.challenge?.starterCode || '');
    const [output, setOutput] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const [showHints, setShowHints] = useState(false);
    const editorRef = useRef(null);
  
  
  
  
  
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <FontAwesomeIcon icon={faCode} className="mr-2 text-teal-600" />
          Coding Challenge
        </h3>
        <p className="mb-4 text-gray-600">{lesson.challenge?.prompt || 'No challenge prompt available'}</p>
        
   
        
     
  
        {isCorrect !== null && (
          <div className={`mt-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect 
              ? 'Congratulations! All tests passed!' 
              : 'Oops, some tests failed. Keep trying!'}
          </div>
        )}
      </div>
    );
  };
  export default CodeChallenge;
  