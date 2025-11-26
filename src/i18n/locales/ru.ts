import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const ru: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Хотите ли вы собрать вложения для всех заметок в папке:',
      part2: 'и во всех её подпапках?',
      part3: 'Эта операция не может быть отменена.'
    },
    progressBar: {
      message: 'Сбор вложений {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Сбор вложений...'
    }
  },
  buttons: {
    copy: 'Копировать',
    move: 'Переместить',
    previewAttachmentFile: 'Предпросмотр файла вложения',
    skip: 'Пропустить'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Вложение',
      part2: 'используется несколькими заметками.'
    },
    heading: 'Сбор вложения, используемого несколькими заметками',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Использовать то же действие для других проблемных вложений'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Собрать вложения в текущей папке',
    collectAttachmentsCurrentNote: 'Собрать вложения в текущей заметке',
    collectAttachmentsEntireVault: 'Собрать вложения во всём хранилище'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Собрать вложения в папке'
  },
  notice: {
    collectingAttachments: 'Сбор вложений для \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Сбор вложений отменён. См. консоль для подробностей.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Сгенерированное имя файла вложения \'{{path}}\' недопустимо.\n{{validationMessage}}\nПроверьте ваши',
      part2: 'настройки.'
    },
    notePathIsIgnored: 'Путь заметки игнорируется'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Отменить',
      ok: 'ОК'
    },
    dataview: {
      itemsPerPage: 'Элементов на страницу:',
      jumpToPage: 'Перейти к странице:'
    },
    notices: {
      attachmentIsStillUsed: 'Вложение {{attachmentPath}} всё ещё используется другими заметками. Оно не будет удалено.',
      unhandledError: 'Произошла необработанная ошибка. Проверьте консоль для получения дополнительной информации.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'все файлы переименовываются.',
        displayText: 'Все'
      },
      none: {
        description: 'их имена сохраняются.',
        displayText: 'Ничего'
      },
      onlyPastedImages: {
        description:
          'только вставленные изображения переименовываются. Применяется только когда содержимое PNG-изображения вставляется напрямую из буфера обмена. Обычно для вставки скриншотов.',
        displayText: 'Только вставленные изображения'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'отменить сбор вложений.',
        displayText: 'Отмена'
      },
      copy: {
        description: 'скопировать вложение в новое место.',
        displayText: 'Копировать'
      },
      move: {
        description: 'переместить вложение в новое место.',
        displayText: 'Переместить'
      },
      prompt: {
        description: 'запросить у пользователя выбор действия.',
        displayText: 'Запросить'
      },
      skip: {
        description: 'пропустить вложение и перейти к следующему.',
        displayText: 'Пропустить'
      }
    },
    defaultImageSizeDimension: {
      height: 'Высота',
      width: 'Ширина'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'удалит пустую папку вложений.',
        displayText: 'Удалить'
      },
      deleteWithEmptyParents: {
        description: 'удалит пустую папку вложений и её пустые родительские папки.',
        displayText: 'Удалить с пустыми родителями'
      },
      keep: {
        description: 'сохранит пустую папку вложений.',
        displayText: 'Сохранить'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Пользовательские токены были закомментированы, так как их нужно обновить до нового формата, введённого в версии 9.0.0 плагина.\n// Обратитесь к документации (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) для получения дополнительной информации.',
      deprecated: {
        part1: 'В версии 9.0.0 плагина формат регистрации пользовательских токенов изменился. Обновите ваши токены соответствующим образом. См.',
        part2: 'документацию',
        part3: 'для получения дополнительной информации'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'В версии 9.0.0 плагина эта',
      part2: 'настройка устарела. Используйте',
      part3: 'формат вместо неё. См.',
      part4: 'документацию',
      part5: 'для получения дополнительной информации'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'У вас установлено потенциально некорректное значение для',
        part2: 'формата. См.',
        part3: 'документацию',
        part4: 'для получения дополнительной информации.',
        part5: 'Это сообщение больше не будет показано.'
      }
    },
    specialCharacters: {
      part1: 'В версии 9.16.0 плагина',
      part2: 'значение настройки по умолчанию было изменено. Ваше значение обновлено на новое значение по умолчанию.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'Размер изображения по умолчанию должен быть в пикселях или процентах',
      invalidCustomTokensCode: 'Неверный код пользовательских токенов',
      invalidRegularExpression: 'Неверное регулярное выражение {{regExp}}',
      specialCharactersMustNotContainSlash: 'Специальные символы не должны содержать /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'Замена специальных символов не должна содержать недопустимые символы для пути файла.'
    },
    version: {
      part1: 'Ваш файл настроек ',
      part2: 'имеет версию',
      part3: 'которая новее текущей версии плагина',
      part4: 'Плагин может работать некорректно. Пожалуйста, обновите плагин до последней версии или убедитесь, что настройки правильные.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'При добавлении файлов:'
      },
      name: 'Режим переименования вложений'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Когда собираемое вложение используется несколькими заметками:'
      },
      name: 'Режим сбора вложений, используемых несколькими заметками'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'См.',
        part2: 'доступные токены'
      },
      name: 'Собранное имя файла вложения'
    },
    customTokens: {
      description: {
        part1: 'Пользовательские токены для использования.',
        part2: 'См.',
        part3: 'документацию',
        part4: 'для получения дополнительной информации.',
        part5:
          '⚠️ Пользовательские токены могут содержать произвольный JavaScript-код. Если написаны неверно, это может привести к потере данных. Используйте на свой риск.'
      },
      name: 'Пользовательские токены'
    },
    defaultImageSize: {
      description: {
        part1: 'Размер изображения по умолчанию.',
        part2: 'Можно указать в пикселях',
        part3: 'или в процентах от полного размера изображения',
        part4: 'Оставьте пустым, чтобы использовать оригинальный размер изображения.'
      },
      name: 'Размер изображения по умолчанию'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Если вставляется/перетаскивается файл с тем же именем, что и существующий, этот разделитель будет добавлен к имени.',
        part2: 'Например, при перетаскивании файла',
        part3: ', он будет переименован в ',
        part4: ', и т.д., пока не будет найдено свободное имя.'
      },
      name: 'Разделитель для дубликатов имён'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Когда папка вложений пустая:'
      },
      name: 'Поведение пустой папки вложений'
    },
    excludePaths: {
      description: {
        part1: 'Исключить заметки из следующих путей.',
        part2: 'Вставьте каждый путь на новой строке.',
        part3: 'Вы можете использовать строку пути или',
        part4: 'Если настройка пуста, заметки не исключаются.'
      },
      name: 'Исключить пути'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Исключить вложения из следующих путей при выполнении команды',
        part2: 'Собрать вложения',
        part3: '.',
        part4: 'Вставьте каждый путь на новой строке.',
        part5: 'Вы можете использовать строку пути или',
        part6: 'Если настройка пуста, из сбора вложений не исключается ни один путь.'
      },
      name: 'Исключить пути из сбора вложений'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'См.',
        part2: 'доступные токены'
      },
      name: 'Сгенерированное имя файла вложения'
    },
    includePaths: {
      description: {
        part1: 'Включить заметки из следующих путей.',
        part2: 'Вставьте каждый путь на новой строке.',
        part3: 'Вы можете использовать строку пути или',
        part4: 'Если настройка пуста, все заметки будут включены.'
      },
      name: 'Включить пути'
    },
    jpegQuality: {
      description: 'Чем ниже качество, тем выше степень сжатия.',
      name: 'Качество JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Начинайте с',
        part2: 'чтобы использовать относительный путь.',
        part3: 'См.',
        part4: 'доступные токены',
        part5: 'Папки с точкой, такие как',
        part6: 'не рекомендуются, так как Obsidian их не отслеживает. Возможно, вам потребуется использовать',
        part7: 'плагин для их управления.'
      },
      name: 'Расположение для новых вложений'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Формат URL, который будет вставлен в Markdown.',
        part2: 'См.',
        part3: 'доступные токены',
        part4: 'Оставьте пустым для использования формата по умолчанию.'
      },
      name: 'Формат URL для Markdown'
    },
    renameAttachmentsToLowerCase: 'Переименовывать вложения строчными буквами',
    renamedAttachmentFileName: {
      description: {
        part1: 'См.',
        part2: 'доступные токены'
      },
      name: 'Переименованное имя файла вложения'
    },
    resetToSampleCustomTokens: {
      message: 'Вы уверены, что хотите сбросить пользовательские токены до образцов? Все ваши изменения будут потеряны.',
      title: 'Сбросить к образцам токенов'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Определяет, нужно ли конвертировать вставленные изображения в JPEG. Применяется только если PNG вставлен напрямую из буфера обмена. Обычно используется для скриншотов.',
      name: 'Конвертировать вставленные изображения в JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Если включено, при удалении заметки её осиротевшие вложения также будут удалены.',
      name: 'Удалять осиротевшие вложения'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'Если включено, при переименовании или перемещении заметки её вложения будут переименованы согласно',
        part2: 'настройке.'
      },
      name: 'Переименовывать файлы вложений'
    },
    shouldRenameAttachmentFolders: {
      description: 'Определяет, нужно ли переименовывать папки вложений при переименовании или перемещении заметки.',
      name: 'Переименовывать папки вложений'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Если включено, вложения, собранные через команду',
        part2: 'Собрать вложения',
        part3: 'будут переименованы в соответствии с',
        part4: 'настройкой.'
      },
      name: 'Переименовывать собранные вложения'
    },
    specialCharacters: {
      description: {
        part1: 'Специальные символы в имени папки или файла вложения, которые будут заменены или удалены.',
        part2: 'Оставьте пустым, чтобы сохранить специальные символы.'
      },
      name: 'Специальные символы'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Строка для замены специальных символов в имени папки или файла вложения.',
        part2: 'Оставьте пустым, чтобы удалить специальные символы.'
      },
      name: 'Замена специальных символов'
    },
    timeoutInSeconds: {
      description: {
        part1: 'Таймаут в секундах для всех операций.',
        part2: 'Если',
        part3: 'установлен, ограничение по времени отключается.'
      },
      name: 'Таймаут в секундах'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Рассматривать файлы с этими расширениями как вложения.',
        part2: 'По умолчанию',
        part3: 'и',
        part4: 'связанные файлы не считаются вложениями и не перемещаются вместе с заметкой.',
        part5: 'Вы можете добавить свои расширения, например,',
        part6: ', чтобы изменить это поведение.'
      },
      name: 'Рассматривать как расширения вложений'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Предпросмотр файла вложения \'{{fullFileName}}\''
    },
    title: 'Введите значение для токена запроса'
  },
  regularExpression: '/регулярное выражение/'
};
