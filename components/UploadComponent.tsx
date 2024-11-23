'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface UploadComponentProps {
  onUploadComplete: (url: string) => void
}

export function UploadComponent({ onUploadComplete }: UploadComponentProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.')
      return
    }

    setUploading(true)
    setError(null)

    try {
    
      const fileName = encodeURIComponent(file.name)
      const res = await fetch(`/api/upload?file=${fileName}`)
      const { url, fields } = await res.json()

      const formData = new FormData()
      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value as string | Blob)
      })

      const uploadRes = await fetch(url, {
        method: 'POST',
        body: formData,
      })

      if (uploadRes.ok) {
        const imageUrl = `${url}/${fields.key}`
        onUploadComplete(imageUrl)
      } else {
        throw new Error('Upload failed')
      }
    } catch (err) {
      setError('Failed to upload file. Please try again.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        disabled={uploading}
      />
      <Button 
        onClick={handleUpload} 
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
