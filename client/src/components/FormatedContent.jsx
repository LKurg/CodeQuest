import React from 'react';
import DOMPurify from 'dompurify';

const FormattedContent = ({ content }) => {
  // Configure DOMPurify to allow code tags
  const sanitizeConfig = {
    ALLOWED_TAGS: ['p', 'code', 'pre', 'strong', 'em', 'br'],
    ALLOWED_ATTR: []
  };

  // Create a wrapper div to parse the HTML content
  const createMarkup = () => {
    const cleanHtml = DOMPurify.sanitize(content, sanitizeConfig);
    return { __html: cleanHtml };
  };

  return (
    <div
      className="formatted-content"
      dangerouslySetInnerHTML={createMarkup()}
    />
  );
};

export default FormattedContent;