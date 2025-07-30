# Custom Attachment Location

This is a plugin for [Obsidian](https://obsidian.md/) that allows to customize attachment location with tokens (`${noteFileName}`, `${date:format}`, etc) like typora.

## Features

- Modify location for attachment folder.
- Modify file name for **Pasted Files**.
- **Collect attachments** - take all attachments from the notes and puts them into the corresponding configured folders.

## Settings

### Location for new attachments

- Same to "Files & Links -> Default location for new attachments".
- **Put "./" at the beginning of the path if you want to use relative path.**
- See available [tokens](#tokens).
- example: `assets/${noteFileName}`, `./assets/${noteFileName}`, `./assets/${noteFileName}/${date:YYYY}`

### Generated attachment file name

- See available [tokens](#tokens).
- example: `${originalAttachmentFileName}-${date:YYYYMMDDHHmmssSSS}`, `${noteFileName}-img-${date:YYYYMMDD}`
- Obsidian default: `Pasted image ${date:YYYYMMDDHHmmss}`.

### Markdown URL format

Format for the URL that will be inserted into Markdown.

- See available [tokens](#tokens).

### Should rename attachment folder

Automatically update attachment folder name if [Location for New Attachments](#location-for-new-attachments) contains `${noteFileName}`.

### Should rename attachment files

Automatically update attachment files in target md file if [Generated attachment file name](#generated-attachment-file-name) contains `${noteFileName}`.

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

If enabled, attachments dragged and dropped into the editor will be renamed according to the [Generated attachment file name](#generated-attachment-file-name) setting.

### Should rename collected attachments

If enabled, attachments processed via `Collect attachments` commands will be renamed according to the [Generated attachment file name](#generated-attachment-file-name) setting.

### Duplicate name separator

When you are pasting/dragging a file with the same name as an existing file, this separator will be added to the file name.

E.g., when you are dragging file `existingFile.pdf`, it will be renamed to `existingFile 1.pdf`, `existingFile 2.pdf`, etc, getting the first name available.

Default value is `␣` (`space`).

### Should keep empty attachment folders

If enabled, empty attachment folders will be preserved, useful for source control purposes.

### Should delete orphan attachments

If enabled, when the note is deleted, its orphan attachments are deleted as well.

## Tokens

The following tokens can be used in the [Location for New Attachments](#location-for-new-attachments), [Generated attachment file name](#generated-attachment-file-name) and [Markdown URL format](#markdown-url-format) settings.

Token strings: `${token}` or `${token:format}`. `token` is case-insensitive. `format` is case-sensitive. When `${token}` is used, `format` is empty string.

### `${attachmentFileSize}`

Size of the attachment file.

**Format**:

- B`n` (default): size in bytes rounded to `n` decimal points. `n` is a number (`0` if omitted).
- KB`n`: size in kilobytes rounded to `n` decimal points. `n` is a number (`0` if omitted).
- MB`n`: size in megabytes rounded to `n` decimal points. `n` is a number (`0` if omitted).

### `${date}`

Current date/time.

**Format**: [Moment.js formatting][Moment.js formatting].

### `${frontmatter}`

Frontmatter value of the current note.

**Format**: frontmatter key. Nested keys are supported, e.g., `key1.key2.3.key4`.

### `${generatedAttachmentFileName}`

The generated file name of the attachment (available only inside [Markdown URL format](#markdown-url-format) setting).

**Format**:

- (default): Unchanged file name. **Example**: `foo/bar/baz qux quux.pdf` -> `baz qux quux`.
- left`n`: Left `n` characters of the file name. **Example** `left2`: `foo/bar/baz qux quux.pdf` -> `ba`.
- lower: Lowercase file name. **Example**: `foo/bar/Baz QUX quux.pdf` -> `baz qux quux`.
- right`n`: Right `n` characters of the file name. **Example** `right2`: `foo/bar/baz qux quux.pdf` -> `ux`.
- slug: Slugified file name. **Example**: `foo/bar/baz qux quux.pdf` -> `baz-qux-quux`.
- upper: Uppercase file name. **Example**: `foo/bar/Baz QUX quux.pdf` -> `BAZ QUX QUUX`.

### `${generatedAttachmentFilePath}`

The generated file path of the attachment (available only inside [Markdown URL format](#markdown-url-format) setting).

**Example**: `foo/bar/baz.pdf` -> `foo/bar/baz.pdf`.

### `${noteFileCreationDate}`

Note file creation date/time.

**Format**: [Moment.js formatting][Moment.js formatting].

### `${noteFileModificationDate}`

Note file modification date/time.

**Format**: [Moment.js formatting][Moment.js formatting].

### `${noteFileName}`

Current note file name.

**Format**:

- (default): Unchanged file name. **Example**: `foo/bar/baz qux quux.md` -> `baz qux quux`.
- left`n`: Left `n` characters of the file name. **Example** `left2`: `foo/bar/baz qux quux.md` -> `ba`.
- lower: Lowercase file name. **Example**: `foo/bar/Baz QUX quux.md` -> `baz qux quux`.
- right`n`: Right `n` characters of the file name. **Example** `right2`: `foo/bar/baz qux quux.md` -> `ux`.
- slug: Slugified file name. **Example**: `foo/bar/baz qux quux.md` -> `baz-qux-quux`.
- upper: Uppercase file name. **Example**: `foo/bar/Baz QUX quux.md` -> `BAZ QUX QUUX`.

### `${noteFilePath}`

Current note full path.

**Example**: `foo/bar/baz.md` -> `foo/bar/baz.md`.

### `${noteFolderName}`

Current note's folder name.

**Format**:

- (default): Unchanged folder name. **Example**: `foo/bar baz qux/quux.md` -> `bar baz qux`.
- left`n`: Left `n` characters of the folder name. **Example** `left2`: `foo/bar baz qux/quux.md` -> `ba`.
- lower: Lowercase folder name. **Example**: `foo/Bar BAZ qux/quux.md` -> `bar baz qux`.
- right`n`: Right `n` characters of the folder name. **Example** `right2`: `foo/bar baz qux/quux.md` -> `ux`.
- slug: Slugified folder name. **Example**: `foo/bar baz qux/quux.md` -> `bar-baz-qux`.
- upper: Uppercase folder name. **Example**: `foo/Bar BAZ qux/quux.md` -> `BAR BAZ QUX`.

- indexFromEnd`n`: 0-based index from the end of the folder tree. **Example** `indexFromEnd1`: `foo/bar/baz/qux/quux.md` -> `baz`.
- indexFromStart`n`: 0-based index from the start of the folder tree. **Example** `indexFromStart1`: `foo/bar/baz/qux/quux.md` -> `bar`.

You can combine both kind of format formats, having `indexFrom...` first:

- indexFromEnd`n`,left`m`.**Example** `indexFromEnd1,left2`: `foo/bar/baz/qux/quux.md` -> `ba` (first two characters of `baz`).

### `${noteFolderPath}`

Current note's folder full path.

**Example**: `foo/bar/baz.md` -> `foo/bar`.

### `${originalAttachmentFileExtension}`

Extension of the original attachment file.

**Example**: `foo.bar.pdf` -> `pdf`.

### `${originalAttachmentFileName}`

File name of the original attachment file.

**Format**:

- (default): File name as is. **Example**: `foo bar.baz.pdf` -> `foo bar.baz`.
- left`n`: Left `n` characters of the file name. **Example** `left2`: `foo/bar baz qux/quux.pdf` -> `ba`.
- lower: Lowercase folder name. **Example**: `foo Bar.BAZ.pdf` -> `foo bar.baz`.
- right`n`: Right `n` characters of the folder name. **Example** `left2`: `foo/bar baz qux/quux.pdf` -> `ux`.
- slug: Slugified file name. **Example**: `foo bar.baz.pdf` -> `foo-bar-baz`.
- upper: Uppercase folder name. **Example**: `foo Bar.BAZ.pdf` -> `FOO BAR.BAZ`.

### `${prompt}`

The value asked from the user prompt.

### `${random}`

Random value.

**Format**:

- D`n`: `n` random digits. `n` is a number (`1` if omitted).
- L`n`: `n` random letters. `n` is a number (`1` if omitted).
- DL`n`: `n` random digits or letters. `n` is a number (`1` if omitted).
- uuid: Random UUID.

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

Then you can use the defined `${myCustomToken1}`, `${myCustomToken2:format}` tokens in the [Location for New Attachments](#location-for-new-attachments), [Generated attachment file name](#generated-attachment-file-name) and [Markdown URL format](#markdown-url-format) settings.

- `substitutions`: is an object with the following properties:
  - `app`: Obsidian app object.
  - `generatedAttachmentFileName`: The generated file name of the attachment (available only inside [Markdown URL format](#markdown-url-format) setting).
  - `generatedAttachmentFilePath`: The generated file path of the attachment (available only inside [Markdown URL format](#markdown-url-format) setting).
  - `noteFileName`: The file name of the current note.
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
