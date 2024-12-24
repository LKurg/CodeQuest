import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSpinner, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

// Language versions and runtime configurations
export const LANGUAGE_VERSIONS = {
  javascript: '18.15.0',
  python: '3.10.0',
  java: '15.0.2',
  cpp: '11.0.0',
  php: '8.1.2',
  typescript: '5.0.3',
  rust: '1.68.0',
  go: '1.20.3',
};

export const LANGUAGE_CONFIGS = {
  javascript: { extension: 'js', runCommand: 'node' },
  python: { extension: 'py', runCommand: 'python3' },
  java: { extension: 'java', runCommand: 'java' },
  cpp: { extension: 'cpp', runCommand: 'g++' },
  php: { extension: 'php', runCommand: 'php' },
  typescript: { extension: 'ts', runCommand: 'ts-node' },
  rust: { extension: 'rs', runCommand: 'rustc' },
  go: { extension: 'go', runCommand: 'go' },
};

// Default code templates for each language
const DEFAULT_CODE_TEMPLATES = {
  javascript: `console.log("Hello, World!");`,
  python: `print("Hello, World!")`,
  java: `public class Main { public static void main(String[] args) { System.out.println("Hello, World!"); } }`,
  cpp: `#include <iostream> int main() { std::cout << "Hello, World!"; return 0; }`,
  php: `<?php echo "Hello, World!"; ?>`,
  typescript: `console.log("Hello, World!");`,
  rust: `fn main() { println!("Hello, World!"); }`,
  go: `package main import "fmt" func main() { fmt.Println("Hello, World!") }`,
};

const LanguageSelector = ({ language, onLanguageChange, availableRuntimes }) => {
  return (
    <select
      value={language}
      onChange={(e) => onLanguageChange(e.target.value)}
      className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
    >
      {Object.keys(LANGUAGE_VERSIONS).map((lang) => {
        const runtimeAvailable = availableRuntimes.some((runtime) => runtime.language === lang);
        return (
          <option key={lang} value={lang} disabled={!runtimeAvailable}>
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
            {!runtimeAvailable && ' (Unavailable)'}
          </option>
        );
      })}
    </select>
  );
};

const CodeEditor = ({ onRunComplete }) => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE_TEMPLATES.javascript);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableRuntimes, setAvailableRuntimes] = useState([]);
  const [error, setError] = useState(null);
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

  const runCode = async () => {
    setIsLoading(true);
    setOutput('');
    setError(null);

    try {
      const languageRuntimes = availableRuntimes
        .filter((runtime) => runtime.language === language)
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
          language,
          version: selectedVersion,
          files: [{ name: `main.${LANGUAGE_CONFIGS[language].extension}`, content: code }],
        }),
      });

      const result = await response.json();
      setOutput(result.run?.output || result.message || 'Code executed successfully.');

      // Call onRunComplete if it's passed as a prop
      if (onRunComplete) {
        onRunComplete(result);  // Pass the result to the parent
      }
    } catch (error) {
      console.error('Execution error:', error);
      setOutput(`Error: ${error.message}`);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-xl flex space-x-4">
      {/* Left Side: Code Editor and Controls */}
      <div className="w-2/3 space-y-4">
        <div className="flex space-x-4 w-full">
          <LanguageSelector
            language={language}
            onLanguageChange={handleLanguageChange}
            availableRuntimes={availableRuntimes}
          />
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded flex items-center justify-center space-x-2 disabled:opacity-50"
            onClick={runCode}
            disabled={isLoading || availableRuntimes.length === 0}
          >
            {isLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faPlay} />}
            <span>Run Code</span>
          </button>
        </div>
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

      {/* Output Section */}
      <div className="w-1/3 space-y-4">
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-500" />
            Output
          </h3>
          {error && (
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-md border-l-4 border-red-500 flex items-center mb-2">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3 text-red-500 dark:text-red-300 text-xl" />
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 max-h-[300px] overflow-y-auto">
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
