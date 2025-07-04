# Obsidian Custom Attachment location

Customize attachment location with tokens (`${fileName}`, `${date:format}`, etc) like typora.

## Features

- Modify location for attachment folder.
- Modify filename for **Pasted Files**.

## Settings

### Location for new attachments

- Same to "Files & Links -> Default location for new attachments".
- **Put "./" at the beginning of the path if you want to use relative path.**
- See available [tokens](#tokens).
- example: `assets/${filename}`, `./assets/${filename}`, `./assets/${filename}/${date:YYYY}`

### Generated attachment filename

- See available [tokens](#tokens).
- example: `${originalCopiedFileName}-${date:YYYYMMDDHHmmssSSS}`, `${filename}-img-${date:YYYYMMDD}`
- Obsidian default: `Pasted image ${date:YYYYMMDDHHmmss}`.

### Should rename attachment folder

Automatically update attachment folder name if [Location for New Attachments](#location-for-new-attachments) contains `${filename}`.

### Should rename attachment files

Automatically update attachment files in target md file if [Generated attachment filename](#generated-attachment-filename) contains `${filename}`.

### Special characters replacement

Automatically replace special characters in attachment folder and file name with the specified string.

### Should rename attachments to lowercase

Automatically set all characters in folder name and pasted image name to be lowercase.

### Should convert pasted images to JPEG

Paste images from clipboard converting them to JPEG.

### JPEG Quality

The smaller the quality, the greater the compression ratio.

### Convert images on drag&drop

If enabled and `Convert pasted images to JPEG` setting is enabled, images drag&dropped into the editor will be converted to JPEG.

### Rename only images

If enabled, only image files will be renamed.

If disabled, all attachment files will be renamed.

### Rename pasted files with known names

If enabled, pasted copied files with known names will be renamed.

If disabled, only clipboard image objects (e.g., screenshots) will be renamed.

### Rename attachments on drag&drop

If enabled, attachments dragged and dropped into the editor will be renamed according to the [Generated attachment filename](#generated-attachment-filename) setting.

### Should rename collected attachments

If enabled, attachments processed via `Collect attachments` commands will be renamed according to the [Generated attachment filename](#generated-attachment-filename) setting.

### Duplicate name separator

When you are pasting/dragging a file with the same name as an existing file, this separator will be added to the file name.

E.g., when you are dragging file `existingFile.pdf`, it will be renamed to `existingFile 1.pdf`, `existingFile 2.pdf`, etc, getting the first name available.

Default value is `␣` (`space`).

### Should keep empty attachment folders

If enabled, empty attachment folders will be preserved, useful for source control purposes.

### Should delete orphan attachments

If enabled, when the note is deleted, its orphan attachments are deleted as well.

## Tokens

The following tokens can be used in the [Location for New Attachments](#location-for-new-attachments) and [Generated attachment filename](#generated-attachment-filename) settings.

The tokens are case-insensitive. The formats are case-sensitive.

- `${attachmentFileSize}` / `${attachmentFileSize:format}`: Size of the attachment file.
  - `B` or format omitted: size in bytes.
  - `KB`: size in kilobytes.
  - `MB`: size in megabytes.
- `${date:format}`: Current date/time using [Moment.js formatting][Moment.js formatting].
- `${frontmatter:key}`: Frontmatter value of the current note. Nested keys are supported, e.g., `key1.key2.3.key4`.
- `${noteFileCreationDate:format}`: Note file creation date/time using [Moment.js formatting][Moment.js formatting].
- `${noteFileModificationDate:format}`: Note file modification date/time using [Moment.js formatting][Moment.js formatting].
- `${noteFileName}`: Current note filename.
- `${noteFilePath}`: Full path to current note.
- `${noteFolderName}`: Current note's folder name.
- `${noteFolderPath}`: Full path to current note's folder.
- `${originalAttachmentFileExtension}`: Extension of the original attachment file.
- `${originalAttachmentFileName}`: File name of the original attachment file.
- `${prompt}`: The value asked from the user prompt.
- `${randomDigitOrLetter}`: A random digit or letter.
- `${randomLetter}`: A random letter.
- `${uuid}`: A random UUID.

## Custom tokens

You can define custom tokens in the `Custom tokens` setting.

The custom tokens are defined as a functions, both sync and async are supported.

Example:

```javascript
exports.myCustomToken1 = (substitutions, format) => {
  return substitutions.noteFileName + substitutions.app.appId + format;
};

exports.myCustomToken2 = async (substitutions, format) => {
  return await Promise.resolve(
    substitutions.noteFileName + substitutions.app.appId + format
  );
};
```

Then you can use the defined `${myCustomToken1}`, `${myCustomToken2:format}` tokens in the [Location for New Attachments](#location-for-new-attachments) and [Generated attachment filename](#generated-attachment-filename) settings.

- `substitutions`: is an object with the following properties:
  - `app`: Obsidian app object.
  - `noteFileName`: The filename of the current note.
  - `noteFilePath`: The full path to the current note.
  - `noteFolderName`: The name of the folder containing the current note.
  - `noteFolderPath`: The full path to the folder containing the current note.
  - `originalAttachmentFileExtension`: Extension of the original attachment file.
  - `originalAttachmentFileName`: File name of the original attachment file.
  - `fillTemplate(template)`: Function to fill the template with the given format. E.g., `substitutions.fillTemplate('${date:YYYY-MM-DD}')`.
- `format`: optional format string.

## Changelog

All notable changes to this project will be documented in the [CHANGELOG](./CHANGELOG.md).

## Installation

The plugin is available in [the official Community Plugins repository](https://obsidian.md/plugins?id=obsidian-custom-attachment-location).

### Beta versions

To install the latest beta release of this plugin (regardless if it is available in [the official Community Plugins repository](https://obsidian.md/plugins) or not), follow these steps:

1. Ensure you have the [BRAT plugin](https://obsidian.md/plugins?id=obsidian42-brat) installed and enabled.
2. Click [Install via BRAT](https://intradeus.github.io/http-protocol-redirector?r=obsidian://brat?plugin=https://github.com/RainCat1998/obsidian-custom-attachment-location).
3. An Obsidian pop-up window should appear. In the window, click the `Add plugin` button once and wait a few seconds for the plugin to install.

## Debugging

By default, debug messages for this plugin are hidden.

To show them, run the following command:

```js
window.DEBUG.enable('obsidian-custom-attachment-location');
```

For more details, refer to the [documentation](https://github.com/mnaoumov/obsidian-dev-utils/blob/main/docs/debugging.md).

## Support

<a href="https://www.buymeacoffee.com/mnaoumov" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;"></a>

## License

© [RainCat1998](https://github.com/RainCat1998/)

Maintainer: [Michael Naumov](https://github.com/mnaoumov/)

[Moment.js formatting]: https://momentjs.com/docs/#/displaying/format/
