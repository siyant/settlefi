import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { parseTransactions } from './llm';

function ImageUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [parsedResult, setParsedResult] = useState<string>();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async () => {
    const result = await parseTransactions(files);
    console.log('result :>> ', result);
    setParsedResult(result);
  };

  return (
    <div>
      <div className="dropzone" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>

      {files.length > 0 && (
        <div>
          <h4>Files:</h4>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleSubmit}>Import</button>
      {parsedResult}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageUpload />} />
      </Routes>
    </Router>
  );
}
