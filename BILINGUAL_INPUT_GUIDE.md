# BilingualInput Component - Auto-Translation Feature

## 🎯 Overview
The `BilingualInput` component automatically translates English text to Marathi as you type, eliminating the need to type content twice!

## ✨ Features
- ✅ **Auto-Translation**: Type in English, get Marathi translation automatically
- ✅ **Debounced Translation**: Waits 1.5 seconds after you stop typing
- ✅ **Manual Override**: You can always edit the Marathi text manually
- ✅ **Toggle Control**: Enable/disable auto-translation per field
- ✅ **Loading Indicator**: Shows when translation is in progress
- ✅ **Works with both**: Text inputs and textareas

## 📦 Installation
The component is already installed and ready to use!

Files created:
- `/src/utils/translator.js` - Translation utility functions
- `/src/components/common/BilingualInput.jsx` - Reusable component

## 🚀 Usage

### Basic Example

```jsx
import BilingualInput from '../../components/common/BilingualInput';

function MyForm() {
  const [formData, setFormData] = useState({
    title: { en: '', mr: '' },
    description: { en: '', mr: '' }
  });

  return (
    <form>
      {/* Simple text input */}
      <BilingualInput
        label="Title"
        name="title"
        value={formData.title}
        onChange={(value) => setFormData({...formData, title: value})}
        required
      />

      {/* Textarea for longer content */}
      <BilingualInput
        label="Description"
        name="description"
        type="textarea"
        rows={5}
        value={formData.description}
        onChange={(value) => setFormData({...formData, description: value})}
        required
      />
    </form>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | - | Field label (e.g., "Title") |
| `name` | string | - | Field name for identification |
| `value` | object | `{en:'', mr:''}` | Current value with en and mr keys |
| `onChange` | function | - | Callback: `(value) => {}` where value = `{en, mr}` |
| `required` | boolean | `false` | Show required asterisk |
| `type` | string | `'text'` | Input type: 'text', 'email', 'url', 'textarea' |
| `placeholder` | string | - | Placeholder text for English input |
| `rows` | number | `3` | Number of rows for textarea |
| `disabled` | boolean | `false` | Disable inputs |

## 🎨 How It Works

1. **Type in English field**:
   ```
   "Welcome to Gram Panchayat"
   ```

2. **Wait 1.5 seconds** (auto-save delay)

3. **Marathi field auto-fills**:
   ```
   "ग्राम पंचायतमध्ये आपले स्वागत आहे"
   ```

4. **Edit Marathi manually if needed** (optional)

## 📝 Real-World Examples

### Example 1: Site Settings (Already Implemented ✅)
Location: `/src/pages/admin/SiteSettings.jsx`

```jsx
<BilingualInput
  label="Panchayat Name"
  name="panchayatName"
  value={formData.panchayatName}
  onChange={(value) => handleChange('panchayatName', value)}
  required
  placeholder="e.g., Gram Panchayat Warghat"
/>
```

### Example 2: Notice Form
```jsx
<BilingualInput
  label="Notice Title"
  name="title"
  value={formData.title}
  onChange={(value) => setFormData({...formData, title: value})}
  required
/>

<BilingualInput
  label="Notice Description"
  name="description"
  type="textarea"
  rows={6}
  value={formData.description}
  onChange={(value) => setFormData({...formData, description: value})}
  required
/>
```

### Example 3: Scheme Form
```jsx
<BilingualInput
  label="Scheme Name"
  name="name"
  value={formData.name}
  onChange={(value) => setFormData({...formData, name: value})}
  required
/>

<BilingualInput
  label="Eligibility Criteria"
  name="eligibility"
  type="textarea"
  rows={4}
  value={formData.eligibility}
  onChange={(value) => setFormData({...formData, eligibility: value})}
/>
```

## ⚙️ Translation API

Currently using **MyMemory Translation API**:
- ✅ Free to use
- ✅ No API key required
- ✅ 1000 requests/day limit
- ✅ Good quality for English → Marathi

### Future Improvements
You can switch to other APIs like:
- Google Cloud Translation API (paid, better quality)
- Microsoft Translator API (paid)
- LibreTranslate (self-hosted, free)

To change the API, edit `/src/utils/translator.js`

## 🎛️ Features in the Component

### 1. Auto-translate Checkbox
Each field has a checkbox to enable/disable auto-translation:
```
☑️ Auto-translate to Marathi 🔄
```

### 2. Loading Indicator
Shows spinner while translating:
```
मराठी (Marathi) Translating... 🔄
```

### 3. Manual Edit Hint
```
💡 Auto-translated. You can edit manually.
```

## 🔧 Customization

### Change Translation Delay
Edit line 34 in `BilingualInput.jsx`:
```jsx
}, 1500); // Change this value (milliseconds)
```

### Disable Auto-translate by Default
Edit line 19 in `BilingualInput.jsx`:
```jsx
const [autoTranslate, setAutoTranslate] = useState(false); // Change to false
```

## 🎯 Migration Guide

### Old Way (Manual Entry)
```jsx
<div>
  <label>Title (English)</label>
  <input 
    value={formData.title_en} 
    onChange={(e) => setFormData({...formData, title_en: e.target.value})}
  />
</div>
<div>
  <label>शीर्षक (मराठी)</label>
  <input 
    value={formData.title_mr} 
    onChange={(e) => setFormData({...formData, title_mr: e.target.value})}
  />
</div>
```

### New Way (Auto-Translation) ✨
```jsx
<BilingualInput
  label="Title"
  value={{en: formData.title_en, mr: formData.title_mr}}
  onChange={(val) => setFormData({
    ...formData, 
    title_en: val.en, 
    title_mr: val.mr
  })}
/>
```

## 📊 Benefits

| Before | After |
|--------|-------|
| Type English text | Type English text |
| **Switch to Marathi field** | ✨ **Auto-translated!** |
| **Type again in Marathi** | Edit only if needed |
| **Time: ~2 minutes** | **Time: ~30 seconds** |

**Time Saved: ~75%** ⚡

## 🚀 Next Steps

1. ✅ **Already Done**: SiteSettings page updated with BilingualInput
2. 📋 **Recommended**: Update NoticeForm
3. 📋 **Recommended**: Update SchemeForm
4. 📋 **Recommended**: Update AboutPageManagement
5. 📋 **Recommended**: Update all other forms with bilingual fields

## 💡 Tips

1. **Always type in English first** - better translation quality
2. **Review Marathi translation** - auto-translation isn't perfect
3. **Keep internet connection** - API requires network access
4. **Uncheck auto-translate** - if you prefer manual entry
5. **Edit Marathi freely** - your edits won't be overwritten

## 🐛 Troubleshooting

### Translation not working?
- Check internet connection
- Check browser console for errors
- API might be rate-limited (1000/day)

### Translation quality poor?
- Edit manually in Marathi field
- Consider premium translation API

### Want offline translation?
- Would need to implement local ML model
- Or pre-translate common phrases

---

**Ready to use!** Just import `BilingualInput` and replace your dual input fields! 🎉
