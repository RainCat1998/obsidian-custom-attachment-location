# Obsidian Custom Attachment location

Customize attachment location with variables($filename, $data, etc) like typora.

## Features

- Modify location for attachment folder.
- Modify filename for **Pasted Files**.

## Settings

### Location for New Attachments

- Same to "Files & Links -> Default location for new attachments".
- `${filename}` representing for current note filename.
- `${date:format}` representing for the current date/time using [Moment.js formatting][Moment.js formatting].
- **Put "./" at the beginning of the path if you want to use relative path.**
- example: `assets/${filename}`, `./assets/${filename}`, `./assets/${filename}/${date:YYYY}`

### Pasted File Name

- `${filename}` representing for current note filename.
- `${date:format}` representing for the current date/time using [Moment.js formatting][Moment.js formatting].
- `${originalCopiedFilename}` representing for original copied to clipboard filename.
- `${prompt}` representing the value asked from the user prompt.
- example: `${originalCopiedFilename}-${date:YYYYMMDDHHmmssSSS}`, `${filename}-img-${date:YYYYMMDD}`
- Obsidian default: `Pasted image YYYYMMDDHHmmss`.
- **Note**: This setting only changes image filename from clipboard. If your attachment is copied from the explorer, obsidian will just copy the original file to the attachment folder without renaming.

### Automatically rename attachment folder

Automatically update attachment folder name if "Location for New Attachments" contains `${filename}`.

### Automatically rename attachment files

- Automatically update attachment files in target md file if "Pasted Image Name" contains `${filename}`.
- Just simply substitute `${filename}` string in attachment filename. So it may be dangerous if multiple files share the same prefix.

### Replace whitespace with hyphen

Automatically replace whitespace in attachment folder and file name with hyphens.

### All lowercase names

Automatically set all characters in folder name and pasted image name to be lowercase.

### Convert pasted images to JPEG

Paste images from clipboard converting them to JPEG.

### JPEG Quality

The smaller the quality, the greater the compression ratio.

### Convert images on drag&drop

If enabled and `Convert pasted images to JPEG` setting is enabled, images drag&dropped into the editor will be converted to JPEG.

### Rename attachments on drag&drop

If enabled, attachments dragged and dropped into the editor will be renamed according to the `Pasted File Name` setting.

### Duplicate name separator

When you are pasting/dragging a file with the same name as an existing file, this separator will be added to the file name.

E.g., when you are dragging file `existingFile.pdf`, it will be renamed to `existingFile 1.pdf`, `existingFile 2.pdf`, etc, getting the first name available.

Default value is ` ` (`space`).

## Installation

- `Custom Attachment Location` is available in [the official Community Plugins repository](https://obsidian.md/plugins?id=obsidian-custom-attachment-location).
- Beta releases can be installed through [BRAT](https://obsidian.md/plugins?id=obsidian42-brat).

© [RainCat1998](https://github.com/RainCat1998/)

[Moment.js formatting]: https://momentjs.com/docs/#/displaying/format/
