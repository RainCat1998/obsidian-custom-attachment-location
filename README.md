# Obsidian Custom Attachment location

Customize attachment location with variables($filename, $data, etc) like typora.

## Features

* Modify location for attachment folder.
* Modify filename for **Pasted Image**.

⚠️  **IMPORTANT:** This plugin will overwrite the following **two settings** and restore them when the plugin is disabled.

* **"Files & Links -> New link format -> Relative path to file"** for generating md links.

* **"Files & Links -> Default location for new attachments"** for custom attachment folder.

## How to use

### Plugin Manager

* Install via the Third Party plugins setting. Search for **Custom Attachment location**.
* Activate the plugin in the settings.

### Manual Install

* Download `main.js`, `manifest.json` in the [latest release](https://github.com/RainCat1998/obsidian-custom-attachment-location-plugin/releases/latest).
* Copy `main.js`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/obsidian-custom-attachment-location/`.
* Enable plugin in Obsidian setting.

### Settings

* **Location for New Attachments**
  * Same to "Files & Links -> Default location for new attachments".
  * ${filename} representing for current note filename.
  * **Put "./" at the beginning of the path if you want to use relative path.**
  * example: **"assets/${filename}", "./assets/${filename}"**
  * **DO NOT start with "/" or end with "/"**
  * (Wrong example: "/assets/${filename}/")

* **Pasted Image Name**
  * ${filename} representing for current note filename. ${date} representing for current datetime in custom Date Format.
  * example: **"image-${date}", "${filename}-img-${date}"**
  * Obsidian default: "Pasted image YYYYMMDDHHmmss"
  * **Note**: This setting only changes image filename from clipboard. If your attachment is copied from the explorer, obsidian will just copy the original file to the attachment folder without renaming.

* **Date Format**
  * Date format string for moment.js.
  * More info: [Format](https://momentjs.com/docs/#/displaying/format/)
  * example: "YYYYMMDDHHmmssSSS".

* **Automatically rename attachment folder**
  * Automatically update attachment folder name if "Location for New Attachments" contains ${filename}.

* **Automatically rename attachment files [Experimental]**
  * Automatically update attachment files in target md file if "Pasted Image Name" contains ${filename}.
  * Just simply substitute ${filename} string in attachment filename. So it may be dangerous if multiple files share the same prefix.

## Screenshots

![image](https://user-images.githubusercontent.com/36730607/138717686-1f62b499-25ae-4662-bd50-6187c142b747.png)
![image](https://user-images.githubusercontent.com/36730607/150306765-f7acb4e2-fd8c-472b-a952-5491b530ed6d.png)
