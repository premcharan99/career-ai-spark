
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ResumeUploaderProps {
  onFileSelected: (file: File) => void;
}

const ResumeUploader = ({ onFileSelected }: ResumeUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive",
      });
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    onFileSelected(file);
    toast({
      title: "File selected",
      description: `${file.name} has been selected`,
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
          } transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx"
          />
          
          {selectedFile ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-success-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Resume Selected</h3>
              <p className="mt-1 text-sm text-gray-500">{selectedFile.name}</p>
              <div className="mt-4">
                <Button onClick={triggerFileInput} variant="outline" size="sm">
                  Change File
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Upload Your Resume</h3>
              <p className="mt-1 text-sm text-gray-500">
                Drag and drop your file here, or click to browse
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Supported formats: PDF, DOC, DOCX (Max 5MB)
              </p>
              <div className="mt-4">
                <Button onClick={triggerFileInput} variant="default">
                  <FileText className="h-4 w-4 mr-2" />
                  Select Resume
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeUploader;
