import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, 
  faSpinner, 
  faExclamationTriangle, 
  faTrophy, 
  faFire, 
  faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';

// Language versions and runtime configurations
export const LANGUAGE_VERSIONS = {
  javascript: '18.15.0',
  python: '3.10.0',
  java: '15.0.2',
  cpp: '11.0.0',
  php: '8.1.2',
  typescript: '5.0.3',
  rust: '1.68.0',
  go: '1.20.3'
};


export const LANGUAGE_CONFIGS = {
  javascript: { 
    extension: 'js', 
    runCommand: 'node' 
  },
  python: { 
    extension: 'py', 
    runCommand: 'python3' 
  },
  java: { 
    extension: 'java', 
    runCommand: 'java' 
  },
  cpp: { 
    extension: 'cpp', 
    runCommand: 'g++' 
  },
  php: { 
    extension: 'php', 
    runCommand: 'php' 
  },
  typescript: { 
    extension: 'ts', 
    runCommand: 'ts-node' 
  },
  rust: { 
    extension: 'rs', 
    runCommand: 'rustc' 
  },
  go: { 
    extension: 'go', 
    runCommand: 'go' 
  }
};

// Default code templates for each language
const DEFAULT_CODE_TEMPLATES = {
  javascript: `// JavaScript Code
console.log("Hello, World!");

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("Developer"));`,

  python: `# Python Code
def greet(name):
    return f"Hello, {name}!"

print("Hello, World!")
print(greet("Developer"))`,

  java: `// Java Code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println(greet("Developer"));
    }

    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`,

  cpp: `// C++ Code
#include <iostream>
#include <string>

std::string greet(const std::string& name) {
    return "Hello, " + name + "!";
}

int main() {
    std::cout << "Hello, World!" << std::endl;
    std::cout << greet("Developer") << std::endl;
    return 0;
}`,

  php: `<?php
// PHP Code
function greet($name) {
    return "Hello, $name!";
}

echo "Hello, World!\n";
echo greet("Developer");
?>`,

  typescript: `// TypeScript Code
function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

console.log("Hello, World!");
console.log(greet("Developer"));`,

  rust: `// Rust Code
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    println!("Hello, World!");
    println!("{}", greet("Developer"));
}`,

  go: `// Go Code
package main

import "fmt"

func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

func main() {
    fmt.Println("Hello, World!")
    fmt.Println(greet("Developer"))
}`
};

const LanguageSelector = ({ language, onLanguageChange, availableRuntimes }) => {
  return (
    <select 
      value={language}
      onChange={(e) => onLanguageChange(e.target.value)}
      className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
    >
      {Object.keys(LANGUAGE_VERSIONS).map((lang) => {
        const runtimeAvailable = availableRuntimes.some(
          runtime => runtime.language === lang
        );
        return (
          <option 
            key={lang} 
            value={lang} 
            disabled={!runtimeAvailable}
          >
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
            {!runtimeAvailable && ' (Unavailable)'}
          </option>
        );
      })}
    </select>
  );
};

const CodeEditor = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE_TEMPLATES.javascript);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableRuntimes, setAvailableRuntimes] = useState([]);
  const [error, setError] = useState(null);
  const [executionStats, setExecutionStats] = useState({
    totalRuns: 0,
    successfulRuns: 0,
    currentStreak: 0,
    experiencePoints: 0
  });
  const editorRef = useRef(null);

  // Fetch available runtimes on component mount
  useEffect(() => {
    const fetchRuntimes = async () => {
      try {
        const response = await fetch('https://emkc.org/api/v2/piston/runtimes');
        const runtimes = await response.json();
        setAvailableRuntimes(runtimes);
      } catch (err) {
        console.error('Error fetching runtimes:', err);
        setError('Unable to fetch available runtimes');
      }
    };

    fetchRuntimes();
  }, []);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setCode(DEFAULT_CODE_TEMPLATES[selectedLanguage]);
    setError(null);
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const updateExecutionStats = (success) => {
    setExecutionStats(prev => {
      const newStats = {
        totalRuns: prev.totalRuns + 1,
        successfulRuns: success ? prev.successfulRuns + 1 : prev.successfulRuns,
        currentStreak: success ? prev.currentStreak + 1 : 0,
        experiencePoints: prev.experiencePoints + (success ? 10 : 0)
      };
      return newStats;
    });
  };

  const runCode = async () => {
    setIsLoading(true);
    setOutput('');
    setError(null);

    try {
      const languageRuntimes = availableRuntimes
        .filter(runtime => runtime.language === language)
        .sort((a, b) => new Date(b.version) - new Date(a.version));

      if (languageRuntimes.length === 0) {
        throw new Error(`No runtime available for ${language}`);
      }

      const selectedVersion = languageRuntimes[0].version;

      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: language,
          version: selectedVersion,
          files: [
            {
              name: `main.${LANGUAGE_CONFIGS[language].extension}`,
              content: code,
            },
          ],
        }),
      });

      const result = await response.json();
      
      if (result.run) {
        setOutput(result.run.output || 'Code executed successfully.');
        updateExecutionStats(true);
      } else {
        setOutput(result.message || 'An error occurred');
        setError(result.message);
        updateExecutionStats(false);
      }
    } catch (error) {
      console.error('Execution error:', error);
      setOutput(`Error: ${error.message}`);
      setError(error.message);
      updateExecutionStats(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getExperienceLevelName = (xp) => {
    if (xp < 50) return 'Novice';
    if (xp < 100) return 'Apprentice';
    if (xp < 250) return 'Coder';
    if (xp < 500) return 'Developer';
    return 'Master Programmer';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-xl flex space-x-4">
      {/* Left Side: Code Editor and Controls */}
      <div className="w-2/3 space-y-4">
        <div className="flex space-x-4 w-full">
          <div className="w-70">
            <LanguageSelector 
              language={language} 
              onLanguageChange={handleLanguageChange}
              availableRuntimes={availableRuntimes}
            />
          </div>
          <div className="w-30">
            <button 
              className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded flex items-center justify-center space-x-2 disabled:opacity-50"
              onClick={runCode}
              disabled={isLoading || availableRuntimes.length === 0}
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faPlay} />
              )}
              <span>Run Code</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md">
          <Editor
            height="400px"
            language={language}
            value={code}
            theme="vs-dark"
            onMount={handleEditorMount}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              formatOnType: true,
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      {/* Right Side: Output and Gamification Stats */}
      <div className="w-1/3 space-y-4">
        {/* Gamification Stats */}
        <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-blue-800 dark:text-blue-200 flex items-center">
              <FontAwesomeIcon icon={faTrophy} className="mr-2" />
              Progress
            </h3>
            <span className="text-sm text-blue-600 dark:text-blue-300">
              {getExperienceLevelName(executionStats.experiencePoints)}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Total Runs:</span>
              <span>{executionStats.totalRuns}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Successful Runs:</span>
              <span className="text-green-600">{executionStats.successfulRuns}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Current Streak:</span>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faFire} className="mr-1 text-orange-500" />
                {executionStats.currentStreak}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Experience:</span>
              <span>{executionStats.experiencePoints} XP</span>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-500" />
            Output
          </h3>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-md border-l-4 border-red-500 flex items-center mb-2">
              <FontAwesomeIcon 
                icon={faExclamationTriangle} 
                className="mr-3 text-red-500 dark:text-red-300 text-xl" 
              />
              <div>
                <p className="text-red-800 dark:text-red-200 font-semibold">Execution Error</p>
                <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}
          
          <div className={`
            bg-gray-100 dark:bg-gray-800 rounded-md p-3 
            max-h-[300px] overflow-y-auto
            ${error ? 'border-l-4 border-red-500' : ''}
          `}>
            <pre className="m-0 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
              {output || 'Run your code to see the output...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;