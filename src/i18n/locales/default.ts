import type { DefaultTranslationsBase } from 'obsidian-dev-utils/obsidian/i18n/DefaultTranslationsBase';

export const defaultTranslations = {
  attachmentCollector: {
    confirm: {
      part1: 'Do you want to collect attachments for all notes in folders recursively?',
      part2: 'This operation cannot be undone.'
    },
    progressBar: {
      message: 'Collecting attachments {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Collecting attachments...'
    }
  },
  buttons: {
    copy: 'Copy',
    copyAll: 'Copy all',
    move: 'Move',
    previewAttachmentFile: 'Preview attachment file',
    select: 'Select',
    skip: 'Skip'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Attachment',
      part2: 'is referenced by multiple notes.'
    },
    heading: 'Collecting attachment used by multiple notes',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Should use the same action for other problematic attachments'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Collect attachments in current folder',
    collectAttachmentsCurrentNote: 'Collect attachments in current note',
    collectAttachmentsEntireVault: 'Collect attachments in entire vault',
    moveAttachmentToProperFolder: 'Move attachment to proper folder'
  },
  menuItems: {
    collectAttachmentsInFile: 'Collect attachments in file',
    collectAttachmentsInFiles: 'Collect attachments in files'
  },
  moveAttachmentToProperFolder: {
    progressBar: {
      message: 'Moving attachment to proper folder {{iterationStr}} - \'{{attachmentFilePath}}\'.',
      title: 'Moving attachment to proper folder...'
    },
    unusedAttachment: 'Attachment {{attachmentPath}} is not used by any note. It will not be moved.'
  },
  moveAttachmentToProperFolderUsedByMultipleNotesModal: {
    content: {
      part1: 'Attachment',
      part2: 'is referenced by multiple notes.',
      part3: 'Select notes to copy the attachment to.'
    },
    heading: 'Collecting attachment used by multiple notes',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Should use the same action for other problematic attachments'
  },
  notice: {
    collectingAttachments: 'Collecting attachments for \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Collecting attachments cancelled. See console for details.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Generated attachment file name \'{{path}}\' is invalid.\n{{validationMessage}}\nCheck your',
      part2: 'setting.'
    },
    notePathIsIgnored: 'Note path is ignored'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Cancel',
      ok: 'OK'
    },
    dataview: {
      itemsPerPage: 'Items per page:',
      jumpToPage: 'Jump to page:'
    },
    notices: {
      attachmentIsStillUsed: 'Attachment {{attachmentPath}} is still used by other notes. It will not be deleted.',
      unhandledError: 'An unhandled error occurred. Please check the console for more information.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'all files are renamed.',
        displayText: 'All'
      },
      none: {
        description: 'their names are preserved.',
        displayText: 'None'
      },
      onlyPastedImages: {
        description:
          'only pasted images are renamed. Applies only when the PNG image content is pasted from the clipboard directly. Typically, for pasting screenshots.',
        displayText: 'Only pasted images'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'cancel the attachment collecting.',
        displayText: 'Cancel'
      },
      copy: {
        description: 'copy the attachment to the new location.',
        displayText: 'Copy'
      },
      move: {
        description: 'move the attachment to the new location.',
        displayText: 'Move'
      },
      prompt: {
        description: 'prompt the user to choose the action.',
        displayText: 'Prompt'
      },
      skip: {
        description: 'skip the attachment and proceed to the next one.',
        displayText: 'Skip'
      }
    },
    defaultImageSizeDimension: {
      height: 'Height',
      width: 'Width'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'will delete the empty attachment folder.',
        displayText: 'Delete'
      },
      deleteWithEmptyParents: {
        description: 'will delete the empty attachment folder and its empty parent folders.',
        displayText: 'Delete with empty parents'
      },
      keep: {
        description: 'will keep the empty attachment folder.',
        displayText: 'Keep'
      }
    },
    moveAttachmentToProperFolderUsedByMultipleNotesMode: {
      cancel: {
        description: 'cancel the attachment collecting.',
        displayText: 'Cancel'
      },
      copyAll: {
        description: 'copy the attachment to the new location for all notes.',
        displayText: 'Copy all'
      },
      prompt: {
        description: 'prompt the user to choose the action.',
        displayText: 'Prompt'
      },
      skip: {
        description: 'skip the attachment and proceed to the next one.',
        displayText: 'Skip'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Custom tokens were commented out as they have to be updated to the new format introduced in plugin version 9.0.0.\n// Refer to the documentation (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) for more information.',
      deprecated: {
        part1: 'In plugin version 9.0.0, the format of custom token registration changed. Please update your tokens accordingly. Refer to the',
        part2: 'documentation',
        part3: 'for more information'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'In plugin version 9.0.0, the',
      part2: 'setting is deprecated. Use',
      part3: 'format instead. See',
      part4: 'documentation',
      part5: 'for more information'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'You have potentially incorrect value set for the',
        part2: 'format. Please refer to the',
        part3: 'documentation',
        part4: 'for more information',
        part5: 'This message will not be shown again.'
      }
    },
    specialCharacters: {
      part1: 'In plugin version 9.16.0, the',
      part2: 'default setting value was changed. Your setting value was updated to the new default value.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'Default image size must be in pixels or percentage',
      invalidCustomTokensCode: 'Invalid custom tokens code',
      invalidRegularExpression: 'Invalid regular expression {{regExp}}',
      specialCharactersMustNotContainSlash: 'Special characters must not contain /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'Special character replacement must not contain invalid file name path characters.'
    },
    version: {
      part1: 'Your settings file ',
      part2: 'has version',
      part3: 'which is newer than the current plugin version',
      part4: 'The plugin might not work as expected. Please update the plugin to the latest version or ensure that the settings are correct.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'When attaching files:'
      },
      name: 'Attachment rename mode'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'When the collected attachment is used by multiple notes:'
      },
      name: 'Collect attachment used by multiple notes mode'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'See available',
        part2: 'tokens',
        part3: 'Leave empty to use',
        part4: 'setting instead.'
      },
      name: 'Collected attachment file name'
    },
    customTokens: {
      description: {
        part1: 'Custom tokens to be used.',
        part2: 'See',
        part3: 'documentation',
        part4: 'for more information.',
        part5: '⚠️ Custom tokens can be an arbitrary JavaScript code. If poorly written, it can cause the data loss. Use it at your own risk.'
      },
      name: 'Custom tokens'
    },
    defaultImageSize: {
      description: {
        part1: 'The default image size.',
        part2: 'Can be specified in pixels',
        part3: 'or percentage of the full image size',
        part4: 'Leave blank to use the original image size.'
      },
      name: 'Default image size'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'When you are pasting/dragging a file with the same name as an existing file, this separator will be added to the file name.',
        part2: 'E.g., when you are dragging file',
        part3: ', it will be renamed to ',
        part4: ', etc, getting the first name available.'
      },
      name: 'Duplicate name separator'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'When the attachment folder becomes empty:'
      },
      name: 'Empty attachment folder behavior'
    },
    excludePaths: {
      description: {
        part1: 'Exclude notes from the following paths.',
        part2: 'Insert each path on a new line.',
        part3: 'You can use path string or',
        part4: 'If the setting is empty, no notes are excluded.'
      },
      name: 'Exclude paths'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Exclude attachments from the following paths when',
        part2: 'Collect attachments',
        part3: 'command is executed.',
        part4: 'Insert each path on a new line.',
        part5: 'You can use path string or',
        part6: 'If the setting is empty, no paths are excluded from attachment collecting.'
      },
      name: 'Exclude paths from attachment collecting'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'See available',
        part2: 'tokens'
      },
      name: 'Generated attachment file name'
    },
    includePaths: {
      description: {
        part1: 'Include notes from the following paths.',
        part2: 'Insert each path on a new line.',
        part3: 'You can use path string or',
        part4: 'If the setting is empty, all notes are included.'
      },
      name: 'Include paths'
    },
    jpegQuality: {
      description: 'The smaller the quality, the greater the compression ratio.',
      name: 'JPEG Quality'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Start with',
        part2: 'to use relative path.',
        part3: 'See available',
        part4: 'tokens',
        part5: 'Dot-folders like',
        part6: 'are not recommended, because Obsidian does not track them. You might need to use',
        part7: 'Plugin to manage them.'
      },
      name: 'Location for new attachments'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Format for the URL that will be inserted into Markdown.',
        part2: 'See available',
        part3: 'tokens',
        part4: 'Leave blank to use the default format.'
      },
      name: 'Markdown URL format'
    },
    moveAttachmentToProperFolderUsedByMultipleNotesMode: {
      description: {
        part1: 'When the attachment is used by multiple notes:'
      },
      name: 'Move attachment to proper folder used by multiple notes mode'
    },
    renameAttachmentsToLowerCase: 'Rename attachments to lower case',
    renamedAttachmentFileName: {
      description: {
        part1: 'See available',
        part2: 'tokens',
        part3: 'Leave empty to use',
        part4: 'setting instead.'
      },
      name: 'Renamed attachment file name'
    },
    resetToSampleCustomTokens: {
      message: 'Are you sure you want to reset the custom tokens to the sample custom tokens? Your changes will be lost.',
      title: 'Reset to sample custom tokens'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Whether to convert pasted images to JPEG. Applies only when the PNG image content is pasted from the clipboard directly. Typically, for pasting screenshots.',
      name: 'Should convert pasted images to JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'If enabled, when the note is deleted, its orphan attachments are deleted as well.',
      name: 'Should delete orphan attachments'
    },
    shouldHandleRenames: {
      description: 'Whether to handle renames.',
      name: 'Should handle renames'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'If enabled, when a note is renamed or moved, its attachments will be renamed according to the',
        part2: 'setting.'
      },
      name: 'Should rename attachment files'
    },
    shouldRenameAttachmentFolders: {
      description: 'Whether to rename attachment folders when a note is renamed or moved.',
      name: 'Should rename attachment folders'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'If enabled, attachments processed via',
        part2: 'Collect attachments',
        part3: 'commands will be renamed according to the',
        part4: 'setting.'
      },
      name: 'Should rename collected attachments'
    },
    specialCharacters: {
      description: {
        part1: 'Special characters in attachment folder and file name to be replaced or removed.',
        part2: 'Leave blank to preserve special characters.'
      },
      name: 'Special characters'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Replacement string for special characters in attachment folder and file name.',
        part2: 'Leave blank to remove special characters.'
      },
      name: 'Special characters replacement'
    },
    timeoutInSeconds: {
      description: {
        part1: 'The timeout in seconds for all operations.',
        part2: 'If',
        part3: 'is set, the operations execution timeout is disabled.'
      },
      name: 'Timeout in seconds'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Treat files with these extensions as attachments.',
        part2: 'By default',
        part3: 'and',
        part4: 'linked files are not treated as attachments and are not moved with the note.',
        part5: 'You can add custom extensions, e.g.',
        part6: ', to override this behavior.'
      },
      name: 'Treat as attachment extensions'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Preview attachment file \'{{fullFileName}}\''
    },
    title: 'Provide a value for the prompt token'
  },
  regularExpression: '/regular expression/'
} as const satisfies DefaultTranslationsBase;
