# My Chrome Extension

A simple Chrome extension that displays the current tab's title when you click a button.

## Features

- Display current tab information
- Clean and simple popup interface
- Manifest V3 compatible

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your Chrome toolbar

## Usage

1. Click the extension icon in your Chrome toolbar
2. A popup will appear with a "Click me!" button
3. Click the button to see the title of your current tab

## File Structure

```
chrome-extension/
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
└── README.md
```

## Development

- **manifest.json**: Extension configuration and metadata
- **popup.html**: The HTML structure for the extension popup
- **popup.css**: Styles for the popup interface
- **popup.js**: JavaScript functionality for the popup

## Permissions

- `activeTab`: Allows the extension to access the currently active tab

## Version

1.0.0

## License

This project is open source and available for modification and distribution.
