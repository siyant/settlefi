import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { parseTransactions } from './llm';
import './App.css';
import electron, { ipcRenderer } from 'electron';

function ImageUpload() {
  const [state, setState] = useState<'selectFile' | 'editTransactions'>(
    'selectFile',
  );
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
    setState('editTransactions');
  };

  const handleSave = async () => {
    window.electron.ipcRenderer.sendMessage('save-transactions', parsedResult);
  };

  return (
    <div>
      {state === 'selectFile' && (
        <>
          <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag and drop some files here, or click to select files</p>
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
          <button onClick={handleSubmit}>Import transactions</button>
        </>
      )}

      {state === 'editTransactions' && (
        <>
          {parsedResult && (
            <textarea
              style={{ width: '100%', height: '400px', flex: '1 1 100%' }}
              defaultValue={parsedResult}
            ></textarea>
          )}
          <button onClick={handleSave}>Save transactions</button>
        </>
      )}
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
