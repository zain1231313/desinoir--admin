import { useState } from 'react';

interface FileUploaderProps {
  label: string;
  onFileSelect?: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ label, onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
        console.log('File preview:', filePreview); // Add this console log
      };
      reader.readAsDataURL(file);

      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div className="">
      <label htmlFor="file-input" className="rounded-l-md btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
        {label}
        <input
          type="file"
          id="file-input"
          placeholder="Choose a File"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </label>

      {filePreview && <img src={filePreview} className='w-20 h-20 object-cover mt-4' />}
      {fileName && <p>Selected file: {fileName}</p>}

    </div>
  );
};

export default FileUploader;