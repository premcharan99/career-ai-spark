
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, Clipboard } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface ResumeUploaderProps {
  onFileSelected: (file: File) => void;
  onTextResumeEntered?: (text: string) => void;
}

const ResumeUploader = ({ onFileSelected, onTextResumeEntered }: ResumeUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
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
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, Word document, or plain text file",
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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setResumeText(text);
      toast({
        description: "Resume text pasted from clipboard",
      });
    } catch (err) {
      toast({
        title: "Clipboard access denied",
        description: "Please grant clipboard permission or paste manually",
        variant: "destructive",
      });
    }
  };

  const handleSubmitText = () => {
    if (resumeText.trim().length < 100) {
      toast({
        title: "Resume text too short",
        description: "Please enter a more complete resume text for better analysis",
        variant: "destructive",
      });
      return;
    }

    // Create a text file from the resume content
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const file = new File([blob], 'resume.txt', { type: 'text/plain' });
    
    setSelectedFile(file);
    onFileSelected(file);
    
    toast({
      title: "Resume text accepted",
      description: "Your resume text has been prepared for analysis",
    });
    
    if (onTextResumeEntered) {
      onTextResumeEntered(resumeText);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
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
                accept=".pdf,.doc,.docx,.txt"
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
          
          <TabsContent value="paste">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Paste the complete text of your resume below
                </p>
                <Textarea 
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Copy and paste your entire resume text here..."
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePaste}
                  className="flex items-center"
                >
                  <Clipboard className="h-4 w-4 mr-2" />
                  Paste from Clipboard
                </Button>
                
                <Button 
                  onClick={handleSubmitText}
                  disabled={resumeText.trim().length < 100}
                >
                  Use This Resume
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
