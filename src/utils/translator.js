// Translation utility using Google Translate API (via MyMemory or LibreTranslate)

/**
 * Translates text from English to Marathi
 * Using MyMemory Translation API (free, no API key required)
 */
export const translateToMarathi = async (englishText) => {
  if (!englishText || englishText.trim() === '') {
    return '';
  }

  try {
    // Using MyMemory Translation API (free)
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      englishText
    )}&langpair=en|mr`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData) {
      return data.responseData.translatedText;
    } else {
      console.error('Translation API error:', data);
      return englishText; // Return original text if translation fails
    }
  } catch (error) {
    console.error('Translation error:', error);
    return englishText; // Return original text if translation fails
  }
};

/**
 * Translates multiple fields from English to Marathi
 * @param {Object} data - Object with English text values
 * @returns {Object} - Object with both en and mr translations
 */
export const translateFields = async (data) => {
  const translations = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      translations[key] = {
        en: value,
        mr: await translateToMarathi(value),
      };
    } else if (typeof value === 'object' && value !== null) {
      // Handle nested objects
      translations[key] = await translateFields(value);
    }
  }

  return translations;
};

/**
 * Debounced translation function to avoid too many API calls
 */
export const debouncedTranslate = (() => {
  let timeout;
  return (text, callback, delay = 1000) => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      const translated = await translateToMarathi(text);
      callback(translated);
    }, delay);
  };
})();
