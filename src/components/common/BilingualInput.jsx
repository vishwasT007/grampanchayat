import { useState, useEffect } from 'react';
import { Languages, Loader2 } from 'lucide-react';
import { translateToMarathi } from '../../utils/translator';

/**
 * Bilingual Input Component with Auto-Translation
 * Type in English, automatically translates to Marathi
 */
const BilingualInput = ({
  label,
  name,
  value = { en: '', mr: '' },
  onChange,
  required = false,
  type = 'text',
  placeholder = '',
  rows = 3,
  disabled = false,
}) => {
  const [translating, setTranslating] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [translationTimeout, setTranslationTimeout] = useState(null);

  const isTextarea = type === 'textarea';

  // Handle English input change
  const handleEnglishChange = (e) => {
    const englishValue = e.target.value;

    // Update English value immediately
    onChange({
      ...value,
      en: englishValue,
    });

    // Auto-translate to Marathi if enabled
    if (autoTranslate && englishValue.trim()) {
      // Clear previous timeout
      if (translationTimeout) {
        clearTimeout(translationTimeout);
      }

      // Set new timeout for debounced translation
      const timeout = setTimeout(async () => {
        setTranslating(true);
        try {
          const marathiTranslation = await translateToMarathi(englishValue);
          onChange({
            en: englishValue,
            mr: marathiTranslation,
          });
        } catch (error) {
          console.error('Translation failed:', error);
        } finally {
          setTranslating(false);
        }
      }, 1500); // Wait 1.5 seconds after user stops typing

      setTranslationTimeout(timeout);
    }
  };

  // Handle Marathi input change (manual override)
  const handleMarathiChange = (e) => {
    const marathiValue = e.target.value;
    onChange({
      ...value,
      mr: marathiValue,
    });
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (translationTimeout) {
        clearTimeout(translationTimeout);
      }
    };
  }, [translationTimeout]);

  const InputComponent = isTextarea ? 'textarea' : 'input';

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Auto-translate toggle */}
      <div className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          id={`auto-translate-${name}`}
          checked={autoTranslate}
          onChange={(e) => setAutoTranslate(e.target.checked)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor={`auto-translate-${name}`} className="text-gray-600 flex items-center gap-1">
          <Languages size={14} />
          Auto-translate to Marathi
          {translating && (
            <Loader2 size={14} className="animate-spin text-primary-600 ml-1" />
          )}
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* English Input */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            English
          </label>
          <InputComponent
            type={!isTextarea ? type : undefined}
            rows={isTextarea ? rows : undefined}
            value={value.en || ''}
            onChange={handleEnglishChange}
            placeholder={placeholder || `Enter ${label} in English`}
            required={required}
            disabled={disabled}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Marathi Input */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            मराठी (Marathi)
            {translating && (
              <span className="ml-2 text-primary-600 text-xs">Translating...</span>
            )}
          </label>
          <InputComponent
            type={!isTextarea ? type : undefined}
            rows={isTextarea ? rows : undefined}
            value={value.mr || ''}
            onChange={handleMarathiChange}
            placeholder={`${label} मराठीत लिहा`}
            disabled={disabled}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
          {autoTranslate && (
            <p className="text-xs text-gray-500 mt-1">
              💡 Auto-translated. You can edit manually.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BilingualInput;
