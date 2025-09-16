import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const zh: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: '是否要为文件夹中的所有笔记收集附件：',
      part2: '以及其所有子文件夹？',
      part3: '此操作无法撤销。'
    },
    progressBar: {
      message: '正在收集附件 {{iterationStr}} - \'{{noteFilePath}}\'。',
      title: '正在收集附件...'
    }
  },
  buttons: {
    copy: '复制',
    move: '移动',
    previewAttachmentFile: '预览附件文件',
    skip: '跳过'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: '附件',
      part2: '被多个笔记引用。'
    },
    heading: '正在收集被多个笔记使用的附件',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: '是否对其他有问题的附件使用相同操作'
  },
  commands: {
    collectAttachmentsCurrentFolder: '收集当前文件夹中的附件',
    collectAttachmentsCurrentNote: '收集当前笔记中的附件',
    collectAttachmentsEntireVault: '收集整个库中的附件'
  },
  menuItems: {
    collectAttachmentsInFolder: '收集文件夹中的附件'
  },
  notice: {
    collectingAttachments: '正在为 \'{{noteFilePath}}\' 收集附件',
    collectingAttachmentsCancelled: '附件收集已取消。详情请查看控制台。',
    generatedAttachmentFileNameIsInvalid: {
      part1: '生成的附件文件名 \'{{path}}\' 无效。\n{{validationMessage}}\n请检查',
      part2: '设置。'
    },
    notePathIsIgnored: '笔记路径已被忽略'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: '取消',
      ok: '确定'
    },
    dataview: {
      itemsPerPage: '每页项数:',
      jumpToPage: '跳转至页数:'
    },
    notices: {
      attachmentIsStillUsed: '附件 {{attachmentPath}} 仍然被其他笔记使用。它不会被删除。',
      unhandledError: '未处理的错误发生。请检查控制台以获取更多信息。'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: '所有文件都会被重命名。',
        displayText: '全部'
      },
      none: {
        description: '文件名保持不变。',
        displayText: '无'
      },
      onlyPastedImages: {
        description: '仅对粘贴的图片进行重命名。仅当 PNG 图像内容直接从剪贴板粘贴时适用。通常用于粘贴屏幕截图。',
        displayText: '仅粘贴的图片'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: '取消附件收集。',
        displayText: '取消'
      },
      copy: {
        description: '将附件复制到新位置。',
        displayText: '复制'
      },
      move: {
        description: '将附件移动到新位置。',
        displayText: '移动'
      },
      prompt: {
        description: '提示用户选择操作。',
        displayText: '提示'
      },
      skip: {
        description: '跳过附件并继续下一个。',
        displayText: '跳过'
      }
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: '将删除空的附件文件夹。',
        displayText: '删除'
      },
      deleteWithEmptyParents: {
        description: '将删除空的附件文件夹及其空的父文件夹。',
        displayText: '删除并删除空父文件夹'
      },
      keep: {
        description: '将保留空的附件文件夹。',
        displayText: '保留'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// 自定义令牌已被注释掉，因为它们需要更新为插件 9.0.0 版本引入的新格式。\n// 更多信息请参考文档 (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens)。',
      deprecated: {
        part1: '在插件 9.0.0 版本中，自定义令牌注册格式已更改。请相应更新你的令牌。参考',
        part2: '文档',
        part3: '了解更多信息'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: '在插件 9.0.0 版本中，',
      part2: '设置已弃用。请使用',
      part3: '格式代替。参见',
      part4: '文档',
      part5: '了解更多信息'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: '你可能为',
        part2: '格式设置了错误的值。请参考',
        part3: '文档',
        part4: '了解更多信息',
        part5: '此消息不会再次显示。'
      }
    },
    specialCharacters: {
      part1: '在插件版本 9.16.0 中，',
      part2: '默认设置值已更改。您的设置值已更新为新的默认值。'
    },
    validation: {
      invalidCustomTokensCode: '无效的自定义令牌代码',
      invalidRegularExpression: '无效的正则表达式 {{regExp}}',
      specialCharactersMustNotContainSlash: '特殊字符不能包含 /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters: '特殊字符替换不能包含无效的文件名路径字符。'
    },
    version: {
      part1: '您的设置文件 ',
      part2: '版本为',
      part3: '，比当前插件版本更新',
      part4: '插件可能无法正常工作。请将插件更新到最新版本或确保设置正确。'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: '当附加文件时：'
      },
      name: '附件重命名模式'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: '当收集的附件被多个笔记使用时：'
      },
      name: '收集被多个笔记使用的附件模式'
    },
    customTokens: {
      description: {
        part1: '要使用的自定义令牌。',
        part2: '参见',
        part3: '文档',
        part4: '了解更多信息。',
        part5: '⚠️ 自定义令牌可以是任意 JavaScript 代码。如果编写不当，可能会导致数据丢失。风险自担。'
      },
      name: '自定义令牌'
    },
    duplicateNameSeparator: {
      description: {
        part1: '当你粘贴/拖拽一个与现有文件同名的文件时，此分隔符会添加到文件名中。',
        part2: '例如，当你拖拽文件',
        part3: '时，它会被重命名为',
        part4: '，依此类推，直到获得第一个可用名称。'
      },
      name: '重复文件名分隔符'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: '当附件文件夹变为空时：'
      },
      name: '空附件文件夹处理'
    },
    excludePaths: {
      description: {
        part1: '排除以下路径中的笔记。',
        part2: '每行输入一个路径。',
        part3: '你可以使用路径字符串或',
        part4: '如果设置为空，则不排除任何笔记。'
      },
      name: '排除路径'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: '当执行',
        part2: '收集附件',
        part3: '命令时，排除以下路径中的附件。',
        part4: '每行输入一个路径。',
        part5: '你可以使用路径字符串或',
        part6: '如果设置为空，则不会排除任何路径。'
      },
      name: '从附件收集中排除路径'
    },
    generatedAttachmentFileName: {
      description: {
        part1: '查看可用',
        part2: '令牌'
      },
      name: '生成的附件文件名'
    },
    includePaths: {
      description: {
        part1: '包含以下路径中的笔记。',
        part2: '每行输入一个路径。',
        part3: '你可以使用路径字符串或',
        part4: '如果设置为空，则包含所有笔记。'
      },
      name: '包含路径'
    },
    jpegQuality: {
      description: '质量越低，压缩率越高。',
      name: 'JPEG 质量'
    },
    locationForNewAttachments: {
      description: {
        part1: '以',
        part2: '开头使用相对路径。',
        part3: '查看可用',
        part4: '令牌',
        part5: '像',
        part6: '这样的点文件夹不推荐使用，因为 Obsidian 不会跟踪它们。你可能需要使用',
        part7: '插件来管理它们。'
      },
      name: '新附件位置'
    },
    markdownUrlFormat: {
      description: {
        part1: '插入到 Markdown 中的 URL 格式。',
        part2: '查看可用',
        part3: '令牌',
        part4: '留空以使用默认格式。'
      },
      name: 'Markdown URL 格式'
    },
    renameAttachmentsToLowerCase: '将附件重命名为小写',
    resetToSampleCustomTokens: {
      message: '确定要将自定义令牌重置为示例自定义令牌吗？你的更改将会丢失。',
      title: '重置为示例自定义令牌'
    },
    shouldConvertPastedImagesToJpeg: {
      description: '是否将粘贴的图片转换为 JPEG。仅当 PNG 图像内容直接从剪贴板粘贴时适用。通常用于粘贴屏幕截图。',
      name: '是否将粘贴的图片转换为 JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: '如果启用，当笔记被删除时，其孤立的附件也会被删除。',
      name: '是否删除孤立附件'
    },
    shouldRenameAttachmentFiles: {
      description: '当笔记被重命名或移动时，是否重命名附件文件。',
      name: '是否重命名附件文件'
    },
    shouldRenameAttachmentFolders: {
      description: '当笔记被重命名或移动时，是否重命名附件文件夹。',
      name: '是否重命名附件文件夹'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: '如果启用，通过',
        part2: '收集附件',
        part3: '命令处理的附件将根据',
        part4: '设置重命名。'
      },
      name: '是否重命名收集的附件'
    },
    specialCharacters: {
      description: {
        part1: '要替换或删除的附件文件夹和文件名中的特殊字符。',
        part2: '留空以保留特殊字符。'
      },
      name: '特殊字符'
    },
    specialCharactersReplacement: {
      description: {
        part1: '附件文件夹和文件名中用于替换特殊字符的字符串。',
        part2: '留空以删除特殊字符。'
      },
      name: '特殊字符替换'
    },
    timeoutInSeconds: {
      description: {
        part1: '所有操作的超时时间（秒）。',
        part2: '如果',
        part3: '已设置，则禁用操作执行超时。'
      },
      name: '超时时间（秒）'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: '将这些扩展名的文件视为附件。',
        part2: '默认情况下',
        part3: '和',
        part4: '链接文件不会被视为附件，也不会随笔记移动。',
        part5: '你可以添加自定义扩展名，例如',
        part6: '，以覆盖此行为。'
      },
      name: '视为附件的扩展名'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: '预览附件文件 \'{{fullFileName}}\''
    },
    title: '为提示令牌提供一个值'
  },
  regularExpression: '/正则表达式/'
};
