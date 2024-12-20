import parse, { domToReact } from 'html-react-parser';
import DOMPurify from 'dompurify';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { materialLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { materialOceanic } from 'react-syntax-highlighter/dist/cjs/styles/prism';


 const ContentRenderer = ({ content, type }) => {
    const renderContent = () => {
      switch (type) {
        case 'text':
          return (
            <div className="prose prose-lg prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900">
              {parse(DOMPurify.sanitize(content), {
                replace: (domNode) => {
                  if (domNode.name === 'pre' && domNode.attribs.class?.includes('ql-syntax')) {
                    return (
                      <div className=" rounded-lg p-4 overflow-x-auto">
                        <SyntaxHighlighter 
                          language="php" 
                          style={materialOceanic}
                          customStyle={{
                            borderRadius: '0.5rem',
                            fontSize: '0.9rem',
                           // backgroundColor: '#1E1E1E'
                          }}
                        >
                          {domNode.children[0]?.data || ''}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }
                  
                  // Custom styling for other elements
                  if (domNode.name === 'p') {
                    return <p className="mb-4 leading-relaxed">{domToReact(domNode.children)}</p>;
                  }
  
                  if (domNode.name === 'h1') {
                    return <h1 className="text-3xl font-bold mb-4 text-gray-900">{domToReact(domNode.children)}</h1>;
                  }
  
                  if (domNode.name === 'h2') {
                    return <h2 className="text-2xl font-semibold mb-3 text-gray-800">{domToReact(domNode.children)}</h2>;
                  }
  
                  if (domNode.name === 'ul') {
                    return <ul className="list-disc list-inside mb-4 pl-4">{domToReact(domNode.children)}</ul>;
                  }
  
                  if (domNode.name === 'ol') {
                    return <ol className="list-decimal list-inside mb-4 pl-4">{domToReact(domNode.children)}</ol>;
                  }
                }
              })}
            </div>
          );
        case 'code':
          return (
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <SyntaxHighlighter 
                language="php" 
                style={materialDark}
                customStyle={{
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  backgroundColor: '#1E1E1E'
                }}
              >
                {content}
              </SyntaxHighlighter>
            </div>
          );
        case 'image':
          return (
            <div className="flex justify-center items-center bg-gray-100 rounded-lg p-4">
              <img 
                src={content} 
                alt="Lesson visual" 
                className="max-w-full max-h-[500px] rounded-lg shadow-md object-contain"
              />
            </div>
          );
        case 'practice':
          return (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2 text-blue-600" />
                <h4 className="text-lg font-semibold text-blue-800">Practice Exercise</h4>
              </div>
              <p className="text-blue-700">{content}</p>
            </div>
          );
        default:
          return <div>{content}</div>;
      }
    };
  
    return (
      <div className="mb-6 transition-all duration-300 ease-in-out">
        {renderContent()}
      </div>
    );
  };
  export default ContentRenderer;