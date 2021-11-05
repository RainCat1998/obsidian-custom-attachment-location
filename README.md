# Obsidian Custom Attachment location

Customize attachment location with variables($filename, $data, etc) like typora.

## Features
* Modify location for attachment folder.
* Modify filename for **Pasted Image**.

⚠️  **IMPORTANT:** This plugin will overwrite the following **two settings** and restore them when the plugin is disabled.
- **"Files & Links -> New link format -> Relative path to file"** for generating md links.
- **"Files & Links -> Default location for new attachments"** for custom attachment folder. 

# How to use

## Plugin Manager
- Install via the Third Party plugins setting. Search for **Custom Attachment location**.
- Activate the plugin in the settings.

## Manual Install
- Download `main.js`, `manifest.json` in the [latest release](https://github.com/RainCat1998/obsidian-custom-attachment-location-plugin/releases/latest).
- Copy `main.js`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/obsidian-custom-attachment-location-plugin/`.
- Enable plugin in Obsidian setting.

## Settings
- **Location for New Attachments**
  - Same to "Files & Links -> Default location for new attachments".
  - ${filename} representing for current note filename.
  - example: **"assets/${filename}"**. **DO NOT start with "./" or end with "/"**
  - (Wrong example: "./assets/${filename}/")
- **Pasted Image Name**
  - ${date} representing for current datetime in custom Date Format.
  - example: **"image-${date}"**
  - Obsidian default: "Pasted image YYYYMMDDHHmmss"
  - **Note**: This setting only changes image filename from clipboard. If your attachment is copied from the explorer, obsidian will just copy the original file to the attachment folder without renaming.
- **Date Format**
  - Date format string for moment.js.
  - More info: [Format](https://momentjs.com/docs/#/displaying/format/)
  - example: "YYYYMMDDHHmmssSSS".
## Screenshots
![image](https://user-images.githubusercontent.com/36730607/138717686-1f62b499-25ae-4662-bd50-6187c142b747.png)
![image](https://user-images.githubusercontent.com/36730607/138718244-f13c8f74-5347-4fef-8836-c42caa663c61.png)
