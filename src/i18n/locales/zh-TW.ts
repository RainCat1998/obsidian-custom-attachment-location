import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const zhTW: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: '您是否要為資料夾中的所有筆記收集附件：',
      part2: '以及其所有子資料夾？',
      part3: '此操作無法復原。'
    },
    progressBar: {
      message: '正在收集附件 {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: '正在收集附件...'
    }
  },
  buttons: {
    copy: '複製',
    move: '移動',
    previewAttachmentFile: '預覽附件檔案',
    skip: '跳過'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: '附件',
      part2: '被多個筆記引用。'
    },
    heading: '正在收集被多個筆記使用的附件',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: '應該對其他有問題的附件使用相同操作'
  },
  commands: {
    collectAttachmentsCurrentFolder: '收集當前資料夾中的附件',
    collectAttachmentsCurrentNote: '收集當前筆記中的附件',
    collectAttachmentsEntireVault: '收集整個庫中的附件'
  },
  menuItems: {
    collectAttachmentsInFolder: '收集資料夾中的附件'
  },
  notice: {
    collectingAttachments: '正在為 \'{{noteFilePath}}\' 收集附件',
    collectingAttachmentsCancelled: '附件收集已取消。詳情請查看控制台。',
    generatedAttachmentFileNameIsInvalid: {
      part1: '生成的附件檔案名稱 \'{{path}}\' 無效。\n{{validationMessage}}\n請檢查您的',
      part2: '設定。'
    },
    notePathIsIgnored: '筆記路徑已被忽略'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: '取消',
      ok: '確定'
    },
    dataview: {
      itemsPerPage: '每頁項目：',
      jumpToPage: '跳轉到頁面：'
    },
    notices: {
      attachmentIsStillUsed: '附件 {{attachmentPath}} 仍被其他筆記使用。不會被刪除。',
      unhandledError: '發生未處理的錯誤。請查看控制台以獲取更多信息。'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: '所有檔案都會重新命名。',
        displayText: '全部'
      },
      none: {
        description: '保留其名稱。',
        displayText: '無'
      },
      onlyPastedImages: {
        description: '僅重新命名貼上的圖片。僅適用於直接從剪貼簿貼上 PNG 圖片內容時。通常用於貼上截圖。',
        displayText: '僅貼上的圖片'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: '取消附件收集。',
        displayText: '取消'
      },
      copy: {
        description: '將附件複製到新位置。',
        displayText: '複製'
      },
      move: {
        description: '將附件移動到新位置。',
        displayText: '移動'
      },
      prompt: {
        description: '提示用戶選擇操作。',
        displayText: '提示'
      },
      skip: {
        description: '跳過此附件並繼續下一個。',
        displayText: '跳過'
      }
    },
    defaultImageSizeDimension: {
      height: '高度',
      width: '寬度'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: '將刪除空附件資料夾。',
        displayText: '刪除'
      },
      deleteWithEmptyParents: {
        description: '將連同空的父資料夾一起刪除空附件資料夾。',
        displayText: '連同空的父資料夾一起刪除'
      },
      keep: {
        description: '將保留空附件資料夾。',
        displayText: '保留'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment: '// 自訂令牌因需更新為插件 9.0.0 版本所引入的新格式而被註解。\n// 詳情請參考官方文件。',
      deprecated: {
        part1: '在插件 9.0.0 版本中，自訂令牌的註冊格式已變更。請更新您的令牌。參見',
        part2: '官方文件',
        part3: '以獲得更多資訊'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: '在插件 9.0.0 版本中，此',
      part2: '設定已被淘汰。請改用',
      part3: '格式。參見',
      part4: '官方文件',
      part5: '獲取更多資訊'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: '您為以下項目設定了可能不正確的值',
        part2: '格式。請參考',
        part3: '官方文件',
        part4: '了解更多信息',
        part5: '此訊息將不再顯示。'
      }
    },
    specialCharacters: {
      part1: '在插件 9.16.0 版本中，',
      part2: '預設設定值已更改。您的設定已更新為新預設值。'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: '預設圖片大小必須是像素或百分比',
      invalidCustomTokensCode: '無效的自訂令牌代碼',
      invalidRegularExpression: '無效的正則表達式 {{regExp}}',
      specialCharactersMustNotContainSlash: '特殊字元不得包含 /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters: '特殊字元的替換不得包含無效的檔名或路徑字元。'
    },
    version: {
      part1: '您的設定檔案',
      part2: '版本為',
      part3: '高於目前插件版本',
      part4: '插件可能無法正常運作。請更新插件至最新版本，或確認設定是否正確。'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: '附加檔案時：'
      },
      name: '附件重新命名模式'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: '當收集的附件被多個筆記使用時：'
      },
      name: '多筆記共用附件收集模式'
    },
    customTokens: {
      description: {
        part1: '自訂令牌用於。',
        part2: '詳見',
        part3: '官方文件',
        part4: '以獲取更多資訊。',
        part5: '⚠️ 自訂令牌可包含任意 JavaScript 代碼，若撰寫不當可能導致資料遺失，請自行斟酌使用。'
      },
      name: '自訂令牌'
    },
    defaultImageSize: {
      description: {
        part1: '預設圖片大小。',
        part2: '可以指定為像素',
        part3: '或是圖片完整大小的百分比',
        part4: '留空以使用原始圖片大小。'
      },
      name: '預設圖片大小'
    },
    duplicateNameSeparator: {
      description: {
        part1: '當您貼上或拖曳一個與已有檔案同名的檔案時，此分隔符會加在檔名後。',
        part2: '例如，當拖曳檔案',
        part3: '時，會被重新命名為',
        part4: '依此類推直到找到可用名稱。'
      },
      name: '重複名稱分隔符'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: '當附件資料夾變空時：'
      },
      name: '空附件資料夾行為'
    },
    excludePaths: {
      description: {
        part1: '排除下列路徑內的筆記。',
        part2: '每條路徑請另起一行。',
        part3: '您可使用路徑字串或',
        part4: '若設定為空，則不排除任何筆記。'
      },
      name: '排除路徑'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: '執行',
        part2: '收集附件',
        part3: '指令時排除下列路徑中的附件。',
        part4: '每條路徑請另起一行。',
        part5: '您可使用路徑字串或',
        part6: '若設定為空，收集附件時不排除任何路徑。'
      },
      name: '收集附件排除路徑'
    },
    generatedAttachmentFileName: {
      description: {
        part1: '參見可用',
        part2: '令牌'
      },
      name: '產生的附件檔案名稱'
    },
    includePaths: {
      description: {
        part1: '包含下列路徑中的筆記。',
        part2: '每條路徑請另起一行。',
        part3: '您可使用路徑字串或',
        part4: '若設定為空，則包含所有筆記。'
      },
      name: '包含路徑'
    },
    jpegQuality: {
      description: '品質越低，壓縮比越高。',
      name: 'JPEG 品質'
    },
    locationForNewAttachments: {
      description: {
        part1: '以',
        part2: '開頭使用相對路徑。',
        part3: '參見可用',
        part4: '令牌',
        part5: '類似以點開頭的資料夾',
        part6: '不建議使用，因 Obsidian 無法追蹤。您可能需要使用',
        part7: '插件管理。'
      },
      name: '新附件位置'
    },
    markdownUrlFormat: {
      description: {
        part1: '將插入 Markdown 的 URL 格式。',
        part2: '參見可用',
        part3: '令牌',
        part4: '留空使用預設格式。'
      },
      name: 'Markdown URL 格式'
    },
    renameAttachmentsToLowerCase: '將附件名稱改成小寫',
    resetToSampleCustomTokens: {
      message: '您確定要重設自訂令牌為範例令牌嗎？您的更改將會遺失。',
      title: '重設為範例令牌'
    },
    shouldConvertPastedImagesToJpeg: {
      description: '是否轉換貼上的圖片為 JPEG。僅在 PNG 圖片內容直接從剪貼簿貼上時適用。通常用於貼上截圖。',
      name: '是否轉換貼上的圖片為 JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: '啟用時，刪除筆記時將同時刪除其孤立附件。',
      name: '刪除孤立附件'
    },
    shouldRenameAttachmentFiles: {
      description: '筆記被重新命名或移動時，是否重新命名附件檔案。',
      name: '重新命名附件檔案'
    },
    shouldRenameAttachmentFolders: {
      description: '筆記被重新命名或移動時，是否重新命名附件資料夾。',
      name: '重新命名附件資料夾'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: '啟用時，通過',
        part2: '收集附件',
        part3: '指令處理的附件將根據',
        part4: '設定重新命名。'
      },
      name: '重新命名收集的附件'
    },
    specialCharacters: {
      description: {
        part1: '附件資料夾和檔案名稱中的特殊字元將被替換或移除。',
        part2: '留空以保留特殊字元。'
      },
      name: '特殊字元'
    },
    specialCharactersReplacement: {
      description: {
        part1: '附件資料夾和檔案名稱特殊字元的替換字串。',
        part2: '留空以刪除特殊字元。'
      },
      name: '特殊字元替換'
    },
    timeoutInSeconds: {
      description: {
        part1: '所有操作的逾時秒數。',
        part2: '若設定，將停用操作逾時。',
        part3: ''
      },
      name: '逾時秒數'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: '將具有這些擴展名的檔案視為附件。',
        part2: '預設情況下',
        part3: '與',
        part4: '連結的檔案不視為附件，且不會與筆記一起移動。',
        part5: '您可以添加自訂擴展名，例如',
        part6: '來覆寫此行為。'
      },
      name: '視為附件擴展名'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: '預覽附件檔案 \'{{fullFileName}}\''
    },
    title: '提供提示令牌的值'
  },
  regularExpression: '/正則表達式/'
};
