/**
 * Extract YouTube video ID from various YouTube URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if invalid
 */
export const getYouTubeVideoId = (url) => {
  if (!url) return null;
  
  // Remove whitespace
  url = url.trim();
  
  // Regular expression patterns for different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,           // https://www.youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/embed\/)([^?&\s]+)/,            // https://www.youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/v\/)([^?&\s]+)/,                // https://www.youtube.com/v/VIDEO_ID
    /(?:youtu\.be\/)([^?&\s]+)/,                      // https://youtu.be/VIDEO_ID
    /(?:youtube\.com\/watch\?.*&v=)([^&\s]+)/         // https://www.youtube.com/watch?feature=...&v=VIDEO_ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * Generate YouTube embed URL from video ID
 * @param {string} videoId - YouTube video ID
 * @returns {string} - Embed URL
 */
export const getYouTubeEmbedUrl = (videoId) => {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
};

/**
 * Generate YouTube thumbnail URL from video ID
 * @param {string} videoId - YouTube video ID
 * @param {string} quality - Thumbnail quality ('default', 'mqdefault', 'hqdefault', 'sddefault', 'maxresdefault')
 * @returns {string} - Thumbnail URL
 */
export const getYouTubeThumbnail = (videoId, quality = 'hqdefault') => {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * Validate YouTube URL
 * @param {string} url - YouTube URL
 * @returns {boolean} - True if valid YouTube URL
 */
export const isValidYouTubeUrl = (url) => {
  return getYouTubeVideoId(url) !== null;
};
