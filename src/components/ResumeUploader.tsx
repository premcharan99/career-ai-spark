
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, Pencil } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface ResumeUploaderProps {
  onFileSelected: (file: File | null, text?: string) => void;
}

const ResumeUploader = ({ onFileSelected }: ResumeUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, Word document, or text file",
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
    setResumeText('');
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

  const handleTextSubmit = () => {
    if (resumeText.trim().length < 100) {
      toast({
        title: "Resume text too short",
        description: "Please enter a more detailed resume for better analysis",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(null);
    onFileSelected(null, resumeText);
    toast({
      title: "Resume text submitted",
      description: "Your resume text has been submitted for analysis",
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
  };

  const handleTabChange = (value: string) => {
    if (value === 'file' || value === 'text') {
      setActiveTab(value);
      
      // Reset the other input type
      if (value === 'file') {
        setResumeText('');
      } else {
        setSelectedFile(null);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Upload Your Resume</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="file" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">Upload File</TabsTrigger>
            <TabsTrigger value="text">Paste Resume Text</TabsTrigger>
          </TabsList>
          
          <TabsContent value="file">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
              } transition-colors mt-4`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
              
              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
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
                    Supported formats: PDF, DOC, DOCX, TXT (Max 5MB)
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
          </TabsContent>
          
          <TabsContent value="text">
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Paste your complete resume text below
                </p>
                <Textarea
                  placeholder="Copy and paste your resume text here..."
                  className="min-h-[250px] resize-none"
                  value={resumeText}
                  onChange={handleTextChange}
                />
              </div>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setResumeText('')}
                  disabled={!resumeText}
                >
                  Clear
                </Button>
                <Button
                  onClick={handleTextSubmit}
                  disabled={resumeText.trim().length < 100}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Use This Text
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResumeUploader;
