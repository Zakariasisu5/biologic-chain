
import React, { useState } from 'react';
import { Upload, File, FileVideo, FileImage, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityTracker } from '@/utils/activityTracker';

export type FileType = 'image' | 'video' | 'document' | 'any';

interface FileUploaderProps {
  type?: FileType;
  maxSizeMB?: number;
  onUploadComplete?: (filePath: string) => void;
  className?: string;
}

export function FileUploader({
  type = 'any',
  maxSizeMB = 10,
  onUploadComplete,
  className
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { trackActivity } = useActivityTracker();

  // Determine accepted file types
  const getAcceptedFileTypes = () => {
    switch (type) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'document':
        return '.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx';
      case 'any':
      default:
        return '*';
    }
  };

  // Get icon based on file type
  const getFileIcon = () => {
    if (!file) return <Upload className="h-8 w-8 text-muted-foreground" />;

    if (file.type.startsWith('image/')) return <FileImage className="h-8 w-8 text-blue-500" />;
    if (file.type.startsWith('video/')) return <FileVideo className="h-8 w-8 text-purple-500" />;
    return <File className="h-8 w-8 text-amber-500" />;
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      return;
    }

    const selectedFile = e.target.files[0];
    
    // Check file size
    const fileSizeInMB = selectedFile.size / (1024 * 1024);
    if (fileSizeInMB > maxSizeMB) {
      setError(`File size exceeds the ${maxSizeMB}MB limit`);
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  // Upload file to Supabase storage
  const uploadFile = async () => {
    if (!file || !currentUser?.id) return;
    
    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      // Create a unique file path for the user's uploaded file
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${currentUser.id}/${fileName}`;
      
      // Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from('user_files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('user_files')
        .getPublicUrl(filePath);
      
      const publicUrl = data.publicUrl;
      
      // Track activity
      trackActivity('upload_file', '/profile', {
        fileType: file.type,
        fileName: file.name,
        fileSize: file.size
      });
      
      toast({
        title: 'File uploaded successfully',
        description: 'Your file has been uploaded and saved to your account.',
      });
      
      // Call the callback with the file path
      if (onUploadComplete) {
        onUploadComplete(publicUrl);
      }
      
      // Reset file state
      setFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file. Please try again later.');
      
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'There was a problem uploading your file.',
      });
    } finally {
      setUploading(false);
      setProgress(100);
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
              ${error ? 'border-destructive bg-destructive/10' : 'border-gray-300 hover:border-primary bg-gray-50 hover:bg-gray-100'}`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {getFileIcon()}
              <p className="mt-2 text-sm text-gray-500">
                {file ? file.name : `Click to upload ${type !== 'any' ? type : 'file'}`}
              </p>
              <p className="text-xs text-gray-500">Max size: {maxSizeMB}MB</p>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept={getAcceptedFileTypes()}
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
        
        {error && (
          <div className="flex items-center text-destructive text-sm gap-1">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        {file && (
          <div className="w-full space-y-2">
            {uploading && (
              <Progress value={progress} className="h-2 w-full" />
            )}
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={uploadFile} 
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setFile(null)}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

