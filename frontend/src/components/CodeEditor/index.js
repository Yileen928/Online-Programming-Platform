import React, { useRef } from 'react';
import Editor from "@monaco-editor/react";
import { theme } from 'antd';
import './style.css';

const CodeEditor = ({ 
  language = 'javascript',
  value = '',
  onChange,
  readOnly = false,
  height = "70vh"
}) => {
  const editorRef = useRef(null);
  const { token } = theme.useToken();

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const getEditorTheme = () => {
    return token.colorBgContainer === '#141414' ? 'vs-dark' : 'light';
  };

  return (
    <div className="code-editor-container">
      <Editor
        height={height}
        defaultLanguage={language}
        language={language}
        value={value}
        theme={getEditorTheme()}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          folding: true,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          renderValidationDecorations: 'on',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          }
        }}
      />
    </div>
  );
};

export default CodeEditor; 