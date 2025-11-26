import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const ja: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'フォルダ内のすべてのノートの添付ファイルを収集しますか：',
      part2: 'とすべてのサブフォルダ？',
      part3: 'この操作は元に戻すことができません。'
    },
    progressBar: {
      message: '添付ファイルを収集中 {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: '添付ファイルを収集中...'
    }
  },
  buttons: {
    copy: 'コピー',
    move: '移動',
    previewAttachmentFile: '添付ファイルのプレビュー',
    skip: 'スキップ'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: '添付ファイル',
      part2: 'が複数のノートで参照されています。'
    },
    heading: '複数のノートで使用されている添付ファイルの収集',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: '他の問題のある添付ファイルにも同じアクションを使用すべき'
  },
  commands: {
    collectAttachmentsCurrentFolder: '現在のフォルダの添付ファイルを収集',
    collectAttachmentsCurrentNote: '現在のノートの添付ファイルを収集',
    collectAttachmentsEntireVault: 'ボルト全体の添付ファイルを収集'
  },
  menuItems: {
    collectAttachmentsInFolder: 'フォルダの添付ファイルを収集'
  },
  notice: {
    collectingAttachments: '\'{{noteFilePath}}\'の添付ファイルを収集中',
    collectingAttachmentsCancelled: '添付ファイルの収集がキャンセルされました。詳細はコンソールを確認してください。',
    generatedAttachmentFileNameIsInvalid: {
      part1: '生成された添付ファイル名 \'{{path}}\' が無効です。\n{{validationMessage}}\n設定を',
      part2: '確認してください。'
    },
    notePathIsIgnored: 'ノートパスが無視されています'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'キャンセル',
      ok: 'OK'
    },
    dataview: {
      itemsPerPage: 'ページあたりの項目数:',
      jumpToPage: 'ページにジャンプ:'
    },
    notices: {
      attachmentIsStillUsed: '添付ファイル {{attachmentPath}} は他のノートでまだ使用されています。削除されません。',
      unhandledError: '未処理のエラーが発生しました。詳細についてはコンソールを確認してください。'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'すべてのファイルがリネームされます。',
        displayText: 'すべて'
      },
      none: {
        description: '名前が保持されます。',
        displayText: 'なし'
      },
      onlyPastedImages: {
        description:
          '貼り付けた画像のみがリネームされます。PNG画像の内容がクリップボードから直接貼り付けられた場合にのみ適用されます。通常、スクリーンショットの貼り付けに使用されます。',
        displayText: '貼り付けた画像のみ'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: '添付ファイルの収集をキャンセルします。',
        displayText: 'キャンセル'
      },
      copy: {
        description: '添付ファイルを新しい場所にコピーします。',
        displayText: 'コピー'
      },
      move: {
        description: '添付ファイルを新しい場所に移動します。',
        displayText: '移動'
      },
      prompt: {
        description: 'ユーザーにアクションを選択するよう促します。',
        displayText: 'プロンプト'
      },
      skip: {
        description: '添付ファイルをスキップして次のファイルに進みます。',
        displayText: 'スキップ'
      }
    },
    defaultImageSizeDimension: {
      height: '高さ',
      width: '幅'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: '空の添付ファイルフォルダを削除します。',
        displayText: '削除'
      },
      deleteWithEmptyParents: {
        description: '空の添付ファイルフォルダとその空の親フォルダを削除します。',
        displayText: '空の親フォルダと一緒に削除'
      },
      keep: {
        description: '空の添付ファイルフォルダを保持します。',
        displayText: '保持'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// カスタムトークンは、プラグイン バージョン 9.0.0 で導入された新しい形式に更新する必要があるため、コメントアウトされました。\n// 詳細については、ドキュメント (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) を参照してください。',
      deprecated: {
        part1: 'プラグイン バージョン 9.0.0 では、カスタムトークン登録の形式が変更されました。トークンを適切に更新してください。詳細については',
        part2: 'ドキュメント',
        part3: 'を参照してください'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'プラグイン バージョン 9.0.0 では、',
      part2: '設定は非推奨です。代わりに',
      part3: '形式を使用してください。詳細については',
      part4: 'ドキュメント',
      part5: 'を参照してください'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: '以下の形式に対して潜在的に正しくない値が設定されています',
        part2: '。詳細については',
        part3: 'ドキュメント',
        part4: 'を参照してください',
        part5: 'このメッセージは再度表示されません。'
      }
    },
    specialCharacters: {
      part1: 'プラグイン バージョン 9.16.0 では、',
      part2: 'デフォルト設定値が変更されました。設定値は新しいデフォルト値に更新されました。'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'デフォルトの画像サイズはピクセルまたはパーセンテージで指定する必要があります',
      invalidCustomTokensCode: '無効なカスタムトークンコード',
      invalidRegularExpression: '無効な正規表現 {{regExp}}',
      specialCharactersMustNotContainSlash: '特殊文字には / を含めることはできません',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters: '特殊文字の置換には無効なファイル名パス文字を含めることはできません。'
    },
    version: {
      part1: '設定ファイル ',
      part2: 'のバージョン',
      part3: 'は現在のプラグインバージョンより新しいです',
      part4: 'プラグインが期待通りに動作しない可能性があります。プラグインを最新バージョンに更新するか、設定が正しいことを確認してください。'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'ファイルを添付するとき:'
      },
      name: '添付ファイルリネームモード'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: '収集された添付ファイルが複数のノートで使用されているとき:'
      },
      name: '複数のノートで使用される添付ファイル収集モード'
    },
    collectedAttachmentFileName: {
      description: {
        part1: '利用可能な',
        part2: 'トークンを参照',
        part3: '代わりに',
        part4: '設定を使用する場合は空白のままにしてください。'
      },
      name: '収集された添付ファイル名'
    },
    customTokens: {
      description: {
        part1: '使用するカスタムトークン。',
        part2: '詳細については',
        part3: 'ドキュメント',
        part4: 'を参照してください。',
        part5:
          '⚠️ カスタムトークンは任意のJavaScriptコードにすることができます。不適切に記述された場合、データ損失を引き起こす可能性があります。自己責任で使用してください。'
      },
      name: 'カスタムトークン'
    },
    defaultImageSize: {
      description: {
        part1: 'デフォルトの画像サイズです。',
        part2: 'ピクセルで指定できます',
        part3: 'または画像全体のサイズのパーセンテージで指定できます',
        part4: '元の画像サイズを使用する場合は空欄にしてください。'
      },
      name: 'デフォルトの画像サイズ'
    },
    duplicateNameSeparator: {
      description: {
        part1: '既存のファイルと同じ名前のファイルを貼り付け/ドラッグするとき、この区切り文字がファイル名に追加されます。',
        part2: '例：ファイルをドラッグするとき',
        part3: '、それは',
        part4: 'などにリネームされ、最初に利用可能な名前を取得します。'
      },
      name: '重複名区切り文字'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: '添付ファイルフォルダが空になったとき:'
      },
      name: '空の添付ファイルフォルダの動作'
    },
    excludePaths: {
      description: {
        part1: '以下のパスからノートを除外します。',
        part2: '各パスを新しい行に挿入してください。',
        part3: 'パス文字列または',
        part4: 'を使用できます。設定が空の場合、ノートは除外されません。'
      },
      name: '除外パス'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: '以下のパスから添付ファイルを除外します',
        part2: '添付ファイルを収集',
        part3: 'コマンドが実行されるとき。',
        part4: '各パスを新しい行に挿入してください。',
        part5: 'パス文字列または',
        part6: 'を使用できます。設定が空の場合、添付ファイル収集からパスは除外されません。'
      },
      name: '添付ファイル収集から除外するパス'
    },
    generatedAttachmentFileName: {
      description: {
        part1: '利用可能な',
        part2: 'トークンを参照'
      },
      name: '生成された添付ファイル名'
    },
    includePaths: {
      description: {
        part1: '以下のパスからノートを含めます。',
        part2: '各パスを新しい行に挿入してください。',
        part3: 'パス文字列または',
        part4: 'を使用できます。設定が空の場合、すべてのノートが含まれます。'
      },
      name: '含めるパス'
    },
    jpegQuality: {
      description: '品質が低いほど、圧縮率が高くなります。',
      name: 'JPEG品質'
    },
    locationForNewAttachments: {
      description: {
        part1: '相対パスを使用するには',
        part2: 'で始めてください。',
        part3: '利用可能な',
        part4: 'トークンを参照',
        part5: 'ドットフォルダ（例：',
        part6: '）は推奨されません。Obsidianが追跡しないためです。管理するには',
        part7: 'プラグインが必要な場合があります。'
      },
      name: '新しい添付ファイルの場所'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Markdownに挿入されるURLの形式。',
        part2: '利用可能な',
        part3: 'トークンを参照',
        part4: 'デフォルト形式を使用するには空白のままにしてください。'
      },
      name: 'Markdown URL形式'
    },
    renameAttachmentsToLowerCase: '添付ファイルを小文字にリネーム',
    renamedAttachmentFileName: {
      description: {
        part1: '利用可能な',
        part2: 'トークンを参照',
        part3: '代わりに',
        part4: '設定を使用する場合は空白のままにしてください。'
      },
      name: 'リネームされた添付ファイル名'
    },
    resetToSampleCustomTokens: {
      message: 'カスタムトークンをサンプルカスタムトークンにリセットしてもよろしいですか？変更は失われます。',
      title: 'サンプルカスタムトークンにリセット'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        '貼り付けた画像をJPEGに変換するかどうか。PNG画像の内容がクリップボードから直接貼り付けられた場合にのみ適用されます。通常、スクリーンショットの貼り付けに使用されます。',
      name: '貼り付けた画像をJPEGに変換する'
    },
    shouldDeleteOrphanAttachments: {
      description: '有効にすると、ノートが削除されたとき、その孤立した添付ファイルも削除されます。',
      name: '孤立した添付ファイルを削除する'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: '有効にすると、ノートがリネームまたは移動されたときに、その添付ファイルは',
        part2: '設定に従ってリネームされます。'
      },
      name: '添付ファイルをリネームする'
    },
    shouldRenameAttachmentFolders: {
      description: 'ノートがリネームまたは移動されたときに添付ファイルフォルダをリネームするかどうか。',
      name: '添付ファイルフォルダをリネームする'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: '有効にすると、',
        part2: '添付ファイルを収集',
        part3: 'コマンドを介して処理された添付ファイルは',
        part4: '設定に従ってリネームされます。'
      },
      name: '収集された添付ファイルをリネームする'
    },
    specialCharacters: {
      description: {
        part1: '添付ファイルフォルダとファイル名で置換または削除する特殊文字。',
        part2: '特殊文字を保持するには空白のままにしてください。'
      },
      name: '特殊文字'
    },
    specialCharactersReplacement: {
      description: {
        part1: '添付ファイルフォルダとファイル名の特殊文字の置換文字列。',
        part2: '特殊文字を削除するには空白のままにしてください。'
      },
      name: '特殊文字の置換'
    },
    timeoutInSeconds: {
      description: {
        part1: 'すべての操作のタイムアウト（秒）。',
        part2: 'もし',
        part3: 'が設定されている場合、操作の実行タイムアウトは無効になります。'
      },
      name: 'タイムアウト（秒）'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'これらの拡張子を持つファイルを添付ファイルとして扱います。',
        part2: 'デフォルトでは',
        part3: 'と',
        part4: 'リンクされたファイルは添付ファイルとして扱われず、ノートと一緒に移動されません。',
        part5: 'この動作をオーバーライドするために、カスタム拡張子（例：',
        part6: '）を追加できます。'
      },
      name: '添付ファイル拡張子として扱う'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: '添付ファイルのプレビュー \'{{fullFileName}}\''
    },
    title: 'プロンプトトークンの値を提供してください'
  },
  regularExpression: '/正規表現/'
};
