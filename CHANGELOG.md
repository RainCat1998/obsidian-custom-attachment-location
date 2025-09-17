# CHANGELOG

## 9.16.4

- Update libs (#222)

## 9.16.3

- Simplify AttachmentCollector as links already handled by Rename handler (#221)
- Ensure MetadataDeleted processed before queue (#220)

## 9.16.2

- Don't hide Notice until done
- Collect each attachment once (#219)

## 9.16.1

- Update libs (#217)
- Improve default placeholders

## 9.16.0

- Add all translations
- Validate plugin version
- Warn about special characters change
- Add missing i18n
- Replace special characters in headings
- Don't mix empty and default setting UI

## 9.15.8

- Ensure frontmatter links headings are not used

## 9.15.7

- Substitute headings on collect (#214)

## 9.15.6

- Clarify term `pasted image` (#215)

## 9.15.5

- Fix enum binding (#213)

## 9.15.4

- Minor changes

## 9.15.3

- Fix infinite rename (#211)

## 9.15.2

- Additional check for dummy path (#210)

## 9.15.1

- Fix root folder

## 9.15.0

- Add oldNoteFile* tokens

## 9.14.0

- Pass ActionContext

## 9.13.5

- Minor changes

## 9.13.4

- Minor changes

## 9.13.3

- Reuse base i18n

## 9.13.2

- Rename back

## 9.13.1

- Localize unhandledError

## 9.13.0

- Add Chinese translation (#201)

## 9.12.0

- Fix paths with trailing spaces and dots (#204)

## 9.11.1

- #206

## 9.11.0

- Add timeout setting (#203)

## 9.10.6

- Minor changes

## 9.10.5

- Fix uninitialized stats on rename
- Fix #202

## 9.10.4

- More accurate file changes

## 9.10.3

- Minor changes

## 9.10.2

- Register patch without using temp files (#199)

## 9.10.1

- Fix closing active note on load https://github.com/RainCat1998/obsidian-custom-attachment-location/issues/199#issuecomment-3241586013

## 9.10.0

- Add default=empty, default=now

## 9.9.1

- Truncate time

## 9.9.0

- Don't add extra new lines (#196)
- Improve description
- Pass content and stats to every substitutions
- Copy original times when creating attachments

## 9.8.1

- Minor changes

## 9.8.0

- originalAttachmentFileCreationDate / originalAttachmentFileModificationDate

## 9.7.1

- Prevent double prompt (#196)

## 9.7.0

- Allow generated file names with slash (#195)

## 9.6.0

- Insert shared text into cursor position (#196)

## 9.5.1

- Minor changes

## 9.5.0

- Restore shouldRenameAttachmentFiles

## 9.4.0

- Add shouldSkipDuplicateCheck

## 9.3.0

- Generate name in getAvailablePathForAttachments
- Move shouldRenameAttachments

## 9.2.2

- Minor changes

## 9.2.1

- Rephrase
- Add link to use cases

## 9.2.0

- Add warning with link
- Add warning to README

## 9.1.0

- Add obsidian to context

## 9.0.8

- getOsUnsafePathCharsRegExp

## 9.0.7

- Use platform-specific getInvalidFileNamePathCharsRegExp (#189)
- More abort signals

## 9.0.6

- Minor changes

## 9.0.5

- removeUndefinedProperties (#186, #188)
- Refactor abortSignal  (#186, #188)

## 9.0.4

- Revalidate tokens after debouncing

## 9.0.3

- Prevent infinite update loop
- Revalidate settings after registering tokens

## 9.0.2

- Register custom tokens on startup (#187)

## 9.0.1

- Don't timeout on collecting in prompt mode
- Prevent image/video overflow

## 9.0.0

- Highlight token
- Improve validation message
- Add formats for prompt
- Deprecate shouldRenameAttachmentsToLowerCase
- Add preview (#184)

## 8.8.2

- Don't use new API (#181)

## 8.8.1

- Prevent infinite loop in prompt

## 8.8.0

- Custom token from heading where the attachment is (#183)
- Trim end whitespaces
- Clean validation
- Improve validation
- Add heading variables

## 8.7.0

- Rename share files (#181)

## 8.6.0

- Validate formats
- Allow multi-format for syntax highlighting
- Add indexFromStart/indexFromEnd

## 8.5.2

- Minor changes

## 8.5.1

- Minor changes

## 8.5.0

- Add choice for CollectAttachmentUsedByMultipleNotesMode
- Reformat settings tab

## 8.4.2

- Add base examples
- Add more logging

## 8.4.1

- Minor changes

## 8.4.0

- generatedAttachmentFileName/generatedAttachmentFilePath
- Fix outdated descriptions

## 8.3.1

- Properly exclude paths (Fixes #175)

## 8.3.0

- Add left/right formatting (fixes #174)

## 8.2.2

- Update libs (#170)

## 8.2.1

- Replace legacy tokens in markdownUrlFormat

## 8.2.0

- Round size to decimal points

## 8.1.0

- \[FR\] Slugify as an option (#167)
- Refactor random
- Upper, lower, slugify file/folder names

## 8.0.2

- Update renamed token

## 8.0.1

- Fix warning condition

## 8.0.0

- \[FR\] File Size (#168)
- Add attachmentFileSize
- Rename tokens

## 7.11.0

- Fix the lib version
- Update libs (Fixes #169)

## 7.10.0

- Add toggle for avoiding attachment duplication during collection. #166 (by @Accelsnow)

## 7.9.0

- Exclude paths from attachment collecting

## 7.8.2

- Ensure attachment folder is updated on rename

## 7.8.1

- Fix build

## 7.8.0

- Update attachmentFolderPath on opening file

## 7.7.6

- Minor changes

## 7.7.5

- Minor changes

## 7.7.4

- Minor changes

## 7.7.3

- Properly handle sequential special characters

## 7.7.2

- Minor changes

## 7.7.1

- Reset default url format

## 7.7.0

- Modify url generation not faking the file instances
- Add markdown URL format customization #152 (thanks to @Kamesuta)

## 7.6.1

- Minor changes

## 7.6.0

- Fix size
- Add placeholder
- Fix compilation

## 7.5.0

- Switch to EmptyAttachmentFolderBehavior

## 7.4.3

- Minor changes

## 7.4.2

- Improve performance

## 7.4.1

- Minor changes

## 7.4.0

- Add Treat as attachment extensions.
- Support .md Attachments (#147)

## 7.3.0

- Add settings code highlighting

## 7.2.6

- Minor changes

## 7.2.5

- Pass original file name with extension

## 7.2.4

- Minor changes

## 7.2.3

- Minor changes

## 7.2.2

- Minor changes

## 7.2.1

- New template

## 7.2.0

- Show progress bar

## 7.1.0

- Replace special characters

## 7.0.5

- Minor changes

## 7.0.4

- Minor changes

## 7.0.3

- Minor changes

## 7.0.2

- Minor changes

## 7.0.1

- Minor changes

## 7.0.0

- Allow call fillTemplate() from custom token
- Add include/exclude settings

## 6.0.2

- Minor changes

## 6.0.1

- Update template

## 6.0.0

- Refactor to support insert attachment
- Rename settings

## 5.1.7

- Paste in input/textarea

## 5.1.6

- Lint

## 5.1.5

- Format

## 5.1.4

- Minor changes

## 5.1.3

- Minor changes

## 5.1.2

- Minor changes

## 5.1.1

- Minor changes

## 5.1.0

- Show visible whitespace

## 5.0.2

- Validate separator

## 5.0.1

- Pass attachment filename

## 5.0.0

- Add custom tokens
- Add frontmatter formatter
- Validate path after applying tokens
- Add fileCreationDate/fileModificationDate
- Handle ../ paths
- Add randoms and uuid
- Add originalCopiedFileExtension
- Don't allow tokens in prompt
- Allow root path
- Allow leading and trailing /
- Allow . and ..

## 4.31.1

- Respect renameOnlyImages when collecting

## 4.31.0

- Enable custom whitespace replacement
- Handle raw link

## 4.30.6

- Minor changes

## 4.30.5

- Minor changes

## 4.30.4

- Minor changes

## 4.30.3

- Minor changes

## 4.30.2

- Minor changes

## 4.30.1

- Refactor loop

## 4.30.0

- Remove date selector
- Refactor templating

## 4.29.1

- Minor changes

## 4.29.0

- Use image-override to be compatible with `Paste Mode` plugin
- Fix check for pasted image

## 4.28.5

- Minor changes

## 4.28.4

- Update libs - fixes mobile build

## 4.28.3

- Avoid default exports

## 4.28.2

- Minor changes

## 4.28.1

- Check for missing webUtils (Electron < 29)

## 4.28.0

- Fix passing path in new Electron

## 4.27.6

- Minor changes

## 4.27.5

- Minor changes

## 4.27.4

- Minor changes

## 4.27.3

- Minor changes

## 4.27.2

- Minor changes

## 4.27.1

- Refactor

## 4.27.0

- Allow paste in link editing textbox

## 4.26.0

- Don't fail on broken canvas

## 4.25.0

- Add support for frontmatter links

## 4.24.0

- Support multi-window

## 4.23.2

- Minor changes

## 4.23.1

- Minor changes

## 4.23.0

- Refactor

## 4.22.1

- Refactor

## 4.22.0

- Replace whitespace on drop
- Fix relative path resolution
- Handle duplicates
- Fix stat for mobile

## 4.21.0

- Fix race condition

## 4.20.0

- Init all settings

## 4.19.0

- Don't remove folders with hidden files

## 4.18.0

- Add `Delete orphan attachments` setting

## 4.17.0

- Remove to trash

## 4.16.0

- Preserve angle brackets and leading dot

## 4.15.0

- Reuse `RenameDeleteHandler`
- Add optional `skipFolderCreation` to `getAvailablePathForAttachments`

## 4.14.0

- Proper integration with Better Markdown Links

## 4.13.0

- Handle special renames

## 4.12.2

- Fix jpegQuality dropdown binding

## 4.12.1

- Add extension

## 4.12.0

- Add `Rename attachments on collecting` setting

## 4.11.0

- Show warning
- Fix build

## 4.10.0

- Fix settings saving
- Allow dot-folders
- Fix mobile loading
- Fix backlinks race condition
- Process attachments before note

## 4.9.4

- Handle removed parent folder case
- Rename attachments before changing links

## 4.9.3

- Fix backlink check
- Check for race conditions

## 4.9.2

- Fix options merging

## 4.9.1

- Fix related attachments notice

## 4.9.0

- Don't create fake file.

## 4.8.0

- Don't create duplicates when dragging vault files

## 4.7.0

- Skip paste handler in metadata editor

## 4.6.0

- Fix race condition

## 4.5.0

- Ensure `getAvailablePathForAttachments` creates missing folder

## 4.4.0

- Fix race conditions

## 4.3.3

- Bugfixes

## 4.3.2

- Fix double paste

## 4.3.1

- Create attachment folders on paste/drop

## 4.3.0

- Create attachment folder only when it is needed

## 4.2.1

- Fix build

## 4.2.0

- Add `Rename only images` setting

## 4.1.0

- Generate links exactly as Obsidian does

## 4.0.0

- Disable Obsidian's built-in way to update links
- Add commands and buttons to collect attachments

## 3.8.0

- Improve checks for target type

## 3.7.0

- Add `Rename pasted files with known names` setting

## 3.6.0

- Handle move, not only rename
- Add `Keep empty attachment folders` setting

## 3.5.0

- Preserve draggable on redrop

## 3.4.0

- Handle rename/delete for canvas

## 3.3.0

- Add `${foldername}` and `${folderPath}`

## 3.2.0

- Configure `Duplicate name separator`

## 3.1.0

- Add canvas support

## 3.0.0

- Don't modify `attachmentFolderPath` setting

## 2.1.0

- Configure drag&drop as paste behavior
- Remove extra dot before jpg
- Add support for `${prompt}`

## 2.0.0

- Make universal paste/drop

## 1.3.1

- Bugfixes

## 1.3.0

- Substitute `${originalCopiedFilename}`

## 1.2.0

- Bugfixes

## 1.1.0

- Bugfixes

## 1.0.3

- Remove unused attachment folder

## 1.0.2

- Forbid backslashes

## 1.0.1

- Add settings validation

## 1.0.0

- Fix README.md template example to prevent inappropriate latex rendering by @kaiiiz in https://github.com/RainCat1998/obsidian-custom-attachment-location/pull/28
- Handle pasting multiple images by @mnaoumov in https://github.com/RainCat1998/obsidian-custom-attachment-location/pull/58
- Support date var template(moment.js) in folder path & image name by @Harrd in https://github.com/RainCat1998/obsidian-custom-attachment-location/pull/56
- Add mobile support by @mengbo in https://github.com/RainCat1998/obsidian-custom-attachment-location/pull/44
- Add name sanitization when creating folder. by @EricWiener in https://github.com/RainCat1998/obsidian-custom-attachment-location/pull/35
- Feature: Compress images from png to jpeg while pasting from the clipboard by @kaiiiz in https://github.com/RainCat1998/obsidian-custom-attachment-location/pull/29

## 0.0.9

- Update attachment folder config when note renamed by @mnaoumov in https://github.com/RainCat1998/obsidian-custom-attachment-location/pull/26

## 0.0.8

- Move attachments when note is moved by @mnaoumov in https://github.com/RainCat1998/obsidian-custom-attachment-location/pull/21
- Make attachment folder setting modified every time file opens by @mnaoumov in https://github.com/RainCat1998/obsidian-custom-attachment-location/pull/23

## 0.0.7

- Fixed minor typo in the settings by @astrodad in https://github.com/RainCat1998/obsidian-custom-attachment-location/pull/10
- Temporarily fix Drag-n-Drop file from explorer doesn't copy file to obsidian vault.

## 0.0.6

- Add support for absolute path and relative path.
- Add options for auto renaming.

## 0.0.5

- Add support for drop event
- Fix typos & grammar by @TypicalHog in https://github.com/RainCat1998/obsidian-custom-attachment-location/pull/2

## 0.0.4

- Optimize code

## 0.0.3

- Add setting tabs and fix bugs.

## 0.0.2

- Add support for custom pasted image filename.

## 0.0.1

- Initial release
