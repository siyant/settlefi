import { ImageBlockParam } from '@anthropic-ai/sdk/resources';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { convertToBase64 } from './utils';

export default function ImportTransactions() {
  const [state, setState] = useState<'selectFile' | 'editTransactions'>(
    'selectFile',
  );
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [files, setFiles] = useState<File[]>([]);
  const [parsedResult, setParsedResult] = useState<string>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log('importTransactions');
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async () => {
    setLoading(true);
    const imagesContent: ImageBlockParam[] = [];
    for (let file of files) {
      imagesContent.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/png',
          data: await convertToBase64(file),
        },
      } as ImageBlockParam);
    }
    const content = [
      ...imagesContent,
      {
        type: 'text',
        text: "Extract the transactions in these images into a csv with columns Date, Description, Amount, From, To. Populate the From column with 'Account:HSBC Revolution' and the To column with these values: Expense:Transport, Expense:Groceries, Expense:Food, Expense:Shopping, Expense:Utilities, Expense:Uncategorised. Remove any 'SINGAPORE SG' or 'Singapore SG' from the end of the description fields. Only return the csv, do not include any explanation text at the start or end.",
      },
    ];

    const result = await window.electron.ipcRenderer.invoke(
      'call-llm',
      content,
    );
    console.log('result :>> ', result);
    setParsedResult(result);
    setLoading(false);
    setState('editTransactions');
  };

  const handleSave = async () => {
    window.electron.ipcRenderer.sendMessage('save-transactions', parsedResult);
    navigate('/');
  };

  return (
    <div>
      <h2>Import Transactions</h2>

      {state === 'selectFile' && (
        <>
          <Dropdown
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.value)}
            options={[
              { label: 'HSBC Revolution', value: 'HSBC Revolution' },
              { label: 'DBS Altitude', value: 'DBS Altitude' },
            ]}
            placeholder="Select account"
            filter
            className="w-full md:w-14rem"
          />
          <br />
          <br />

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
          <br />

          <Button
            onClick={handleSubmit}
            disabled={files.length === 0}
            loading={loading}
          >
            Import transactions
          </Button>
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
          <br />
          <Button onClick={handleSave}>Save transactions</Button>
        </>
      )}
    </div>
  );
}
