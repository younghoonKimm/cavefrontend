import React from 'react';

interface TextareaProps {
  [key: string]: any;
}

function Textarea(props: TextareaProps) {
  return <textarea {...props} />;
}

export default Textarea;
