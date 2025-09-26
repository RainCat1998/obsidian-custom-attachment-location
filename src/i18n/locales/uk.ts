import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const uk: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Чи хочете ви зібрати вкладення для всіх нотаток у папці:',
      part2: 'та всіх її підпапках?',
      part3: 'Цю операцію не можна скасувати.'
    },
    progressBar: {
      message: 'Збирання вкладень {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Збирання вкладень...'
    }
  },
  buttons: {
    copy: 'Копіювати',
    move: 'Перемістити',
    previewAttachmentFile: 'Попередній перегляд вкладеного файлу',
    skip: 'Пропустити'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Вкладення',
      part2: 'використовується кількома нотатками.'
    },
    heading: 'Збирання вкладення, яке використовується кількома нотатками',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Використовувати ту саму дію для інших проблемних вкладень'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Зібрати вкладення в поточній папці',
    collectAttachmentsCurrentNote: 'Зібрати вкладення в поточній нотатці',
    collectAttachmentsEntireVault: 'Зібрати вкладення в усьому сховищі'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Зібрати вкладення в папці'
  },
  notice: {
    collectingAttachments: 'Збирання вкладень для \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Збирання вкладень скасовано. Дивіться консоль для деталей.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Згенерована назва файлу вкладення \'{{path}}\' недійсна.\n{{validationMessage}}\nПеревірте ваші',
      part2: 'налаштування.'
    },
    notePathIsIgnored: 'Шлях нотатки ігнорується'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Скасувати',
      ok: 'ОК'
    },
    dataview: {
      itemsPerPage: 'Елементів на сторінку:',
      jumpToPage: 'Перейти на сторінку:'
    },
    notices: {
      attachmentIsStillUsed: 'Вкладення {{attachmentPath}} все ще використовується іншими нотатками. Воно не буде видалено.',
      unhandledError: 'Сталася необроблена помилка. Будь ласка, перевірте консоль для отримання додаткової інформації.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'всі файли перейменовуються.',
        displayText: 'Всі'
      },
      none: {
        description: 'їхні назви зберігаються.',
        displayText: 'Жоден'
      },
      onlyPastedImages: {
        description:
          'тільки вставлені зображення перейменовуються. Застосовується тільки коли контент PNG зображення вставляється безпосередньо з буфера обміну. Зазвичай, для вставки скріншотів.',
        displayText: 'Тільки вставлені зображення'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'скасувати збір вкладень.',
        displayText: 'Скасувати'
      },
      copy: {
        description: 'копіювати вкладення в нове місце.',
        displayText: 'Копіювати'
      },
      move: {
        description: 'перемістити вкладення в нове місце.',
        displayText: 'Перемістити'
      },
      prompt: {
        description: 'запитати користувача про вибір дії.',
        displayText: 'Запитати'
      },
      skip: {
        description: 'пропустити вкладення та перейти до наступного.',
        displayText: 'Пропустити'
      }
    },
    defaultImageSizeDimension: {
      height: 'Висота',
      width: 'Ширина'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'видалить порожню папку вкладень.',
        displayText: 'Видалити'
      },
      deleteWithEmptyParents: {
        description: 'видалить порожню папку вкладень і порожні батьківські папки.',
        displayText: 'Видалити з порожніми батьківськими'
      },
      keep: {
        description: 'збереже порожню папку вкладень.',
        displayText: 'Зберегти'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Користувацькі токени були закоментовані, оскільки їх потрібно оновити до нового формату, введеного у версії 9.0.0 плагіна.\n// Див. документацію.',
      deprecated: {
        part1: 'У версії 9.0.0 плагіна змінився формат реєстрації користувацьких токенів. Будь ласка, оновіть свої токени. Докладніше у',
        part2: 'документації',
        part3: ''
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'У версії 9.0.0 плагіна ця',
      part2: 'налаштування застаріла. Використайте',
      part3: 'формат замість неї. Див. документацію',
      part4: '',
      part5: ''
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'У вас встановлене потенційно некоректне значення для',
        part2: 'формату. Будь ласка, дивіться',
        part3: 'документацію',
        part4: 'Для більш детальної інформації',
        part5: 'Це повідомлення більше не буде відображатися.'
      }
    },
    specialCharacters: {
      part1: 'У версії 9.16.0 плагіна',
      part2: 'значення за замовчуванням було змінено. Ваше значення оновлено відповідно до нового стандарту.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'Розмір зображення за замовчуванням має бути в пікселях або відсотках',
      invalidCustomTokensCode: 'Невірний код користувацьких токенів',
      invalidRegularExpression: 'Невірний регулярний вираз {{regExp}}',
      specialCharactersMustNotContainSlash: 'Спеціальні символи не повинні містити /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'Заміна спеціальних символів не повинна містити недопустимі символи шляху або імені файлу.'
    },
    version: {
      part1: 'Ваш файл налаштувань ',
      part2: 'має версію',
      part3: 'яка новіша за поточну версію плагіна',
      part4: 'Плагін може працювати некоректно. Будь ласка, оновіть плагін до останньої версії або перевірте правильність налаштувань.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'При додаванні файлів:'
      },
      name: 'Режим перейменування вкладень'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Якщо вкладення використовується кількома нотатками:'
      },
      name: 'Режим збору вкладень, які використовуються кількома нотатками'
    },
    customTokens: {
      description: {
        part1: 'Користувацькі токени для використання.',
        part2: 'Дивіться',
        part3: 'документацію',
        part4: 'Для більш детальної інформації',
        part5:
          '⚠️ Користувацькі токени можуть містити довільний код JavaScript. При неправильному використанні можливі втрати даних. Використовуйте на свій ризик.'
      },
      name: 'Користувацькі токени'
    },
    defaultImageSize: {
      description: {
        part1: 'Розмір зображення за замовчуванням.',
        part2: 'Можна вказати в пікселях',
        part3: 'або відсотках від повного розміру зображення',
        part4: 'Залиште порожнім, щоб використовувати оригінальний розмір зображення.'
      },
      name: 'Розмір зображення за замовчуванням'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Коли ви вставляєте/перетягуєте файл із таким самим ім’ям як існуючий файл, буде доданий роздільник.',
        part2: 'Наприклад, при перетягуванні файлу',
        part3: 'він буде перейменований на ',
        part4: 'і так далі, доки не буде знайдено доступне ім’я.'
      },
      name: 'Роздільник для дублікатів імен'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Коли папка вкладень порожня:'
      },
      name: 'Поведение порожньої папки вкладень'
    },
    excludePaths: {
      description: {
        part1: 'Ігноруйте нотатки за наступними шляхами.',
        part2: 'Введіть кожен шлях з нового рядка.',
        part3: 'Можна використовувати рядок шляху або',
        part4: 'Якщо поле порожнє, жоден файл не ігнорується.'
      },
      name: 'Ігноровані шляхи'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Ігноруйте вкладення з наступних шляхів під час виконання команди',
        part2: 'Зібрати вкладення',
        part3: '.',
        part4: 'Введіть кожен шлях з нового рядка.',
        part5: 'Можна використовувати рядок шляху або',
        part6: 'Якщо поле порожнє, жоден шлях не ігнорується.'
      },
      name: 'Ігноровані шляхи при зборі вкладень'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Див. доступні',
        part2: 'токени'
      },
      name: 'Згенерована назва файлу вкладення'
    },
    includePaths: {
      description: {
        part1: 'Включити нотатки з таких шляхів.',
        part2: 'Введіть кожен шлях з нового рядка.',
        part3: 'Можна використовувати рядок шляху або',
        part4: 'Якщо поле порожнє, включаються всі нотатки.'
      },
      name: 'Включені шляхи'
    },
    jpegQuality: {
      description: 'Чим менша якість, тим більша компресія.',
      name: 'Якість JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Почніть з',
        part2: 'щоб використовувати відносний шлях.',
        part3: 'Див. доступні',
        part4: 'токени',
        part5: 'Папки з крапкою, як-от',
        part6: 'не рекомендуються, бо Obsidian їх не відслідковує. Можливо, треба використовувати',
        part7: 'плагін для керування.'
      },
      name: 'Розташування нових вкладень'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Формат URL, що вставлятиметься у Markdown.',
        part2: 'Див. доступні',
        part3: 'токени',
        part4: 'Залиште порожнім для використання формату за замовчуванням.'
      },
      name: 'Формат URL Markdown'
    },
    renameAttachmentsToLowerCase: 'Перейменовувати вкладення з маленьких літер',
    resetToSampleCustomTokens: {
      message: 'Ви впевнені, що хочете скинути користувацькі токени до прикладу? Ваші зміни буде втрачено.',
      title: 'Скинути до прикладу'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Перетворювати вставлені зображення у JPEG. Застосовується лише, коли PNG вставлено безпосередньо з буфера обміну. Зазвичай для вставки скріншотів.',
      name: 'Конвертувати вставлені зображення у JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Якщо увімкнено, при видаленні нотатки її осиротілі вкладення також видаляються.',
      name: 'Видаляти осиротілі вкладення'
    },
    shouldRenameAttachmentFiles: {
      description: 'Перейменовувати файли вкладень при перейменуванні або переміщенні нотатки.',
      name: 'Перейменовувати файли вкладень'
    },
    shouldRenameAttachmentFolders: {
      description: 'Перейменовувати папки вкладень при перейменуванні або переміщенні нотатки.',
      name: 'Перейменовувати папки вкладень'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Якщо увімкнено, вкладення, оброблені через',
        part2: 'Зібрати вкладення',
        part3: 'будуть перейменовані відповідно до',
        part4: 'налаштувань.'
      },
      name: 'Перейменовувати зібрані вкладення'
    },
    specialCharacters: {
      description: {
        part1: 'Спеціальні символи у назві папки та файлу вкладення, які треба замінити або видалити.',
        part2: 'Залиште порожнім для збереження символів.'
      },
      name: 'Спеціальні символи'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Рядок заміни для спеціальних символів у назві папки чи файлу вкладення.',
        part2: 'Залиште порожнім для видалення символів.'
      },
      name: 'Заміна спеціальних символів'
    },
    timeoutInSeconds: {
      description: {
        part1: 'Тайм-аут у секундах для усіх операцій.',
        part2: 'Якщо',
        part3: 'встановлено, тайм-аут операцій відключено.'
      },
      name: 'Тайм-аут в секундах'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Обробляти файли з такими розширеннями як вкладення.',
        part2: 'За замовчуванням',
        part3: 'та',
        part4: 'зв’язані файли не вважаються вкладеннями і не переміщуються разом з нотаткою.',
        part5: 'Ви можете додати власні розширення, наприклад,',
        part6: ', щоб змінити цю поведінку.'
      },
      name: 'Обробляти як розширення вкладень'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Попередній перегляд вкладеного файлу \'{{fullFileName}}\''
    },
    title: 'Введіть значення для токена запиту'
  },
  regularExpression: '/регулярний вираз/'
};
