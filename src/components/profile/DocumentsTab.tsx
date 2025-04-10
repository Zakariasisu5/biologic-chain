
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileUploader } from '@/components/profile/FileUploader';
import { FileImage, FileVideo, File } from 'lucide-react';

export const DocumentsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents & Media</CardTitle>
        <CardDescription>Upload and manage your health-related documents and media</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Upload Files</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium flex items-center mb-2">
                  <FileImage className="h-4 w-4 mr-1" />
                  Images
                </h4>
                <FileUploader type="image" maxSizeMB={10} />
              </div>
              <div>
                <h4 className="text-sm font-medium flex items-center mb-2">
                  <FileVideo className="h-4 w-4 mr-1" />
                  Videos
                </h4>
                <FileUploader type="video" maxSizeMB={100} />
              </div>
              <div>
                <h4 className="text-sm font-medium flex items-center mb-2">
                  <File className="h-4 w-4 mr-1" />
                  Documents
                </h4>
                <FileUploader type="document" maxSizeMB={20} />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Recent Uploads</h3>
            <div className="border rounded-md p-4 text-center text-muted-foreground text-sm">
              No recent uploads. Upload files to see them here.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
