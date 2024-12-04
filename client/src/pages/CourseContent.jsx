import React from 'react';

// Component to render course content with HTML tags
const CourseContent = ({ content }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  );
};

export default CourseContent;
