'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const fileName = encodeURIComponent(file.name);
      const fileType = file.type;

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, fileType }),
      });

      if (!res.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadURL } = await res.json();

      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": fileType },
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload file');
      }

      setUrl(uploadURL.split("?")[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload to S3</h1>
      <div className="space-y-4">
        <Input 
          type="file" 
          onChange={(e) => {
            const files = e.target.files;
            if (files) setFile(files[0]);
          }} 
        />
        <Button onClick={handleFileUpload} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {url && (
          <Alert>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              File uploaded: <a href={url} target="_blank" rel="noopener noreferrer" className="underline">{url}</a>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

