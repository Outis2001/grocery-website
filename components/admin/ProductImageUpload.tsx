'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'

type ProductUpdate = Database['public']['Tables']['products']['Update']

interface ProductImageUploadProps {
  productId: string
  productName: string
  currentImageUrl: string | null
  onImageUpdated: (newImageUrl: string | null) => void
}

export function ProductImageUpload({
  productId,
  productName,
  currentImageUrl,
  onImageUpdated,
}: ProductImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${productId}-${Date.now()}.${fileExt}`
      const filePath = fileName

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      const publicUrl = urlData.publicUrl

      // Update product record
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: publicUrl } as ProductUpdate)
        .eq('id', productId)

      if (updateError) throw updateError

      // Delete old image if exists
      if (currentImageUrl) {
        const oldFileName = currentImageUrl.split('/').pop()
        if (oldFileName) {
          await supabase.storage
            .from('product-images')
            .remove([oldFileName])
        }
      }

      onImageUpdated(publicUrl)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleDeleteImage = async () => {
    if (!currentImageUrl) return
    
    const confirmed = window.confirm('Are you sure you want to delete this image?')
    if (!confirmed) return

    setDeleting(true)
    setError(null)

    try {
      const supabase = createClient()

      // Extract filename from URL
      const fileName = currentImageUrl.split('/').pop()
      
      if (fileName) {
        // Delete from storage
        const { error: deleteError } = await supabase.storage
          .from('product-images')
          .remove([fileName])

        if (deleteError) throw deleteError
      }

      // Update product record
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: null } as ProductUpdate)
        .eq('id', productId)

      if (updateError) throw updateError

      onImageUpdated(null)
    } catch (err: any) {
      console.error('Delete error:', err)
      setError(err.message || 'Failed to delete image')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Current Image Preview */}
      {currentImageUrl ? (
        <div className="relative group">
          <img
            src={currentImageUrl}
            alt={productName}
            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            onClick={handleDeleteImage}
            disabled={deleting}
            className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            title="Delete image"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </button>
        </div>
      ) : (
        <div className="w-full h-32 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-gray-400" />
        </div>
      )}

      {/* Upload Button */}
      <label
        className={`block w-full py-2 px-4 rounded-lg font-medium text-center cursor-pointer transition ${
          uploading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 text-white'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
        <span className="flex items-center justify-center gap-2">
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              {currentImageUrl ? 'Change Image' : 'Upload Image'}
            </>
          )}
        </span>
      </label>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
          {error}
        </p>
      )}

      {/* File Requirements */}
      <p className="text-xs text-gray-500 text-center">
        Max 5MB • JPG, PNG, WEBP
      </p>
    </div>
  )
}
