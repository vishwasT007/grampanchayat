/**
 * Image Compression Utility
 * Compresses images to reduce file size while maintaining quality
 */

/**
 * Compress an image file to target size
 * @param {File} file - Image file to compress
 * @param {number} maxSizeKB - Maximum size in KB (default: 350KB)
 * @param {number} maxWidth - Maximum width (default: 1920px)
 * @param {number} maxHeight - Maximum height (default: 1080px)
 * @returns {Promise<File>} Compressed image file
 */
export const compressImage = async (file, maxSizeKB = 350, maxWidth = 1920, maxHeight = 1080) => {
  return new Promise((resolve, reject) => {
    // Check if file is already small enough
    const fileSizeKB = file.size / 1024;
    
    if (fileSizeKB <= maxSizeKB) {
      console.log(`Image ${file.name} is already small enough (${fileSizeKB.toFixed(2)}KB)`);
      resolve(file);
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Start with high quality and reduce if needed
        let quality = 0.9;
        const targetSizeBytes = maxSizeKB * 1024;
        
        const tryCompress = (currentQuality) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              
              console.log(`Compressed ${file.name}: ${(blob.size / 1024).toFixed(2)}KB at quality ${currentQuality}`);
              
              // If size is good or quality is too low, accept it
              if (blob.size <= targetSizeBytes || currentQuality <= 0.5) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                
                console.log(`Final size: ${(compressedFile.size / 1024).toFixed(2)}KB`);
                resolve(compressedFile);
              } else {
                // Try again with lower quality
                tryCompress(currentQuality - 0.1);
              }
            },
            'image/jpeg',
            currentQuality
          );
        };
        
        tryCompress(quality);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Compress multiple images
 * @param {Array<File>} files - Array of image files
 * @param {number} maxSizeKB - Maximum size per image in KB
 * @returns {Promise<Array<File>>} Array of compressed files
 */
export const compressMultipleImages = async (files, maxSizeKB = 350) => {
  const compressionPromises = files.map(file => compressImage(file, maxSizeKB));
  return Promise.all(compressionPromises);
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export const validateImageFile = (file) => {
  const errors = [];
  
  // Check if it's an image
  if (!file.type.startsWith('image/')) {
    errors.push('File must be an image');
    return { valid: false, errors };
  }
  
  // Check file size (max 10MB before compression)
  const maxSizeMB = 10;
  if (file.size > maxSizeMB * 1024 * 1024) {
    errors.push(`File size must be less than ${maxSizeMB}MB`);
    return { valid: false, errors };
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Only JPEG, PNG, and WebP images are allowed');
    return { valid: false, errors };
  }
  
  return { valid: true, errors: [] };
};
