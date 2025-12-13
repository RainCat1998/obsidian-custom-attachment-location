import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const be: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Сабраць укладанні для ўсіх нататак у папках рэкурсіўна?',
      part2: 'Гэтую аперацыю нельга адмяніць.'
    },
    progressBar: {
      message: 'Збор далучэнняў {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Збор далучэнняў...'
    }
  },
  buttons: {
    copy: 'Капіяваць',
    move: 'Перамясціць',
    previewAttachmentFile: 'Праглядзець файл далучэння',
    skip: 'Прапусціць'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Далучэнне',
      part2: 'выкарыстоўваецца некалькімі нататкамі.'
    },
    heading: 'Збор далучэння, якое выкарыстоўваецца некалькімі нататкамі',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Ці выкарыстоўваць тое ж дзеянне для іншых праблемных далучэнняў'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Сабраць далучэнні ў бягучай папцы',
    collectAttachmentsCurrentNote: 'Сабраць далучэнні ў бягучай нататцы',
    collectAttachmentsEntireVault: 'Сабраць далучэнні ва ўсёй сховішчы'
  },
  menuItems: {
    collectAttachmentsInFile: 'Сабраць укладанні ў файле',
    collectAttachmentsInFiles: 'Сабраць укладанні ў файлах'
  },
  notice: {
    collectingAttachments: 'Збор далучэнняў для \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Збор далучэнняў адменены. Глядзіце кансоль для падрабязнасцей.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Згенераванае імя файла далучэння \'{{path}}\' недапушчальнае.\n{{validationMessage}}\nПраверце ваш',
      part2: 'параметр.'
    },
    notePathIsIgnored: 'Шлях нататкі ігнаруецца'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Адмена',
      ok: 'ОК'
    },
    dataview: {
      itemsPerPage: 'Элементаў на старонцы:',
      jumpToPage: 'Перайсці на старонку:'
    },
    notices: {
      attachmentIsStillUsed: 'Далучэнне {{attachmentPath}} усё яшчэ выкарыстоўваецца іншымі нататкамі. Яно не будзе выдалена.',
      unhandledError: 'Адбылася неапрацаваная памылка. Калі ласка, праверце кансоль для атрымання дадатковай інфармацыі.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'усе файлы перайменаваны.',
        displayText: 'Усе'
      },
      none: {
        description: 'іх назвы захаваны.',
        displayText: 'Ніводны'
      },
      onlyPastedImages: {
        description:
          'перайменаваны толькі ўстаўленыя выявы. Ужываецца толькі калі змесціва PNG выявы ўстаўляецца непасрэдна з буфера абмену. Звычайна для ўстаўкі скрыншотаў.',
        displayText: 'Толькі ўстаўленыя выявы'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'адмяніць збор далучэнняў.',
        displayText: 'Адмена'
      },
      copy: {
        description: 'скапіяваць далучэнне ў новую месцазнаходжанне.',
        displayText: 'Капіяваць'
      },
      move: {
        description: 'перамясціць далучэнне ў новую месцазнаходжанне.',
        displayText: 'Перамясціць'
      },
      prompt: {
        description: 'запытаць карыстальніка выбраць дзеянне.',
        displayText: 'Запыт'
      },
      skip: {
        description: 'прапусціць далучэнне і перайсці да наступнага.',
        displayText: 'Прапусціць'
      }
    },
    defaultImageSizeDimension: {
      height: 'Вышыня',
      width: 'Шырыня'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'выдаліць пустую папку далучэнняў.',
        displayText: 'Выдаліць'
      },
      deleteWithEmptyParents: {
        description: 'выдаліць пустую папку далучэнняў і яе пустыя бацькоўскія папкі.',
        displayText: 'Выдаліць з пустымі бацькоўскімі'
      },
      keep: {
        description: 'захаваць пустую папку далучэнняў.',
        displayText: 'Захаваць'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Карыстальніцкія токены былі закаментаваны, паколькі яны павінны быць абноўлены да новага фармату, уведзенага ў версіі плагіна 9.0.0.\n// Звярніцеся да дакументацыі (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) для атрымання дадатковай інфармацыі.',
      deprecated: {
        part1: 'У версіі плагіна 9.0.0 фармат рэгістрацыі карыстальніцкіх токенаў змяніўся. Калі ласка, абнавіце вашы токены адпаведна. Звярніцеся да',
        part2: 'дакументацыі',
        part3: 'для атрымання дадатковай інфармацыі'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'У версіі плагіна 9.0.0',
      part2: 'параметр састарэлы. Выкарыстоўвайце',
      part3: 'фармат замест гэтага. Глядзіце',
      part4: 'дакументацыю',
      part5: 'для атрымання дадатковай інфармацыі'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'У вас патэнцыйна няправільнае значэнне для',
        part2: 'фармату. Калі ласка, звярніцеся да',
        part3: 'дакументацыі',
        part4: 'для атрымання дадатковай інфармацыі',
        part5: 'Гэта паведамленне больш не будзе паказана.'
      }
    },
    specialCharacters: {
      part1: 'У версіі плагіна 9.16.0',
      part2: 'значэнне па змаўчанні было зменена. Ваша значэнне параметра было абноўлена да новага значэння па змаўчанні.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'Прадвызначаны памер выявы павінен быць у пікселях або ў працэнтах',
      invalidCustomTokensCode: 'Няправільны код карыстальніцкіх токенаў',
      invalidRegularExpression: 'Няправільны рэгулярны выраз {{regExp}}',
      specialCharactersMustNotContainSlash: 'Спецыяльныя сімвалы не павінны змяшчаць /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'Замена спецыяльных сімвалаў не павінна змяшчаць няправільныя сімвалы шляху імя файла.'
    },
    version: {
      part1: 'Ваш файл наладок ',
      part2: 'мае версію',
      part3: 'якая навейшая за бягучую версію плагіна',
      part4: 'Плагін можа працаваць не так, як чакаецца. Калі ласка, абнавіце плагін да апошняй версіі або пераканайцеся, што налады правільныя.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Пры далучэнні файлаў:'
      },
      name: 'Рэжым перайменавання далучэнняў'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Калі сабранае далучэнне выкарыстоўваецца некалькімі нататкамі:'
      },
      name: 'Рэжым збору далучэння, якое выкарыстоўваецца некалькімі нататкамі'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'Глядзіце даступныя',
        part2: 'токены',
        part3: 'Пакіньце пуста, каб выкарыстоўваць',
        part4: 'параметр замест гэтага.'
      },
      name: 'Імя файла сабранага далучэння'
    },
    customTokens: {
      description: {
        part1: 'Карыстальніцкія токены для выкарыстання.',
        part2: 'Глядзіце',
        part3: 'дакументацыю',
        part4: 'для атрымання дадатковай інфармацыі.',
        part5:
          '⚠️ Карыстальніцкія токены могуць быць адвольным JavaScript кодам. Калі яны дрэнна напісаны, гэта можа прывесці да страты даных. Выкарыстоўвайце на свой рызыку.'
      },
      name: 'Карыстальніцкія токены'
    },
    defaultImageSize: {
      description: {
        part1: 'Прадвызначаны памер выявы.',
        part2: 'Можа быць указаны ў пікселях',
        part3: 'або ў працэнтах поўнага памеру выявы',
        part4: 'Пакіньце пуста, каб выкарыстоўваць арыгінальны памер.'
      },
      name: 'Прадвызначаны памер выявы'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Калі вы ўстаўляеце/перацягваеце файл з тым жа імем, што і існуючы файл, гэты раздзяляльнік будзе дададзены да імя файла.',
        part2: 'Напрыклад, калі вы перацягваеце файл',
        part3: ', ён будзе перайменаваны ў',
        part4: ', і г.д., атрымліваючы першае даступнае імя.'
      },
      name: 'Раздзяляльнік дублікатаў імёнаў'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Калі папка далучэнняў становіцца пустой:'
      },
      name: 'Поведзінка пустой папкі далучэнняў'
    },
    excludePaths: {
      description: {
        part1: 'Выключыць нататкі з наступных шляхоў.',
        part2: 'Устаўце кожны шлях на новы радок.',
        part3: 'Вы можаце выкарыстоўваць радок шляху або',
        part4: 'Калі параметр пусты, ніякія нататкі не выключаюцца.'
      },
      name: 'Выключыць шляхі'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Выключыць далучэнні з наступных шляхоў калі',
        part2: 'Збор далучэнняў',
        part3: 'каманда выконваецца.',
        part4: 'Устаўце кожны шлях на новы радок.',
        part5: 'Вы можаце выкарыстоўваць радок шляху або',
        part6: 'Калі параметр пусты, ніякія шляхі не выключаюцца з збору далучэнняў.'
      },
      name: 'Выключыць шляхі з збору далучэнняў'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Глядзіце даступныя',
        part2: 'токены'
      },
      name: 'Згенераванае імя файла далучэння'
    },
    includePaths: {
      description: {
        part1: 'Уключыць нататкі з наступных шляхоў.',
        part2: 'Устаўце кожны шлях на новы радок.',
        part3: 'Вы можаце выкарыстоўваць радок шляху або',
        part4: 'Калі параметр пусты, усе нататкі ўключаюцца.'
      },
      name: 'Уключыць шляхі'
    },
    jpegQuality: {
      description: 'Чым менш якасць, тым больш каэфіцыент сціску.',
      name: 'Якасць JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Пачніце з',
        part2: 'для выкарыстання адноснага шляху.',
        part3: 'Глядзіце даступныя',
        part4: 'токены',
        part5: 'Кропкавыя папкі як',
        part6: 'не рэкамендуюцца, паколькі Obsidian не адсочвае іх. Вам можа спатрэбіцца выкарыстоўваць',
        part7: 'Плагін для кіравання імі.'
      },
      name: 'Месцазнаходжанне для новых далучэнняў'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Фармат для URL, які будзе ўстаўлены ў Markdown.',
        part2: 'Глядзіце даступныя',
        part3: 'токены',
        part4: 'Пакіньце пустым для выкарыстання фармату па змаўчанні.'
      },
      name: 'Фармат URL Markdown'
    },
    renameAttachmentsToLowerCase: 'Перайменаваць далучэнні ў ніжні рэгістр',
    renamedAttachmentFileName: {
      description: {
        part1: 'Глядзіце даступныя',
        part2: 'токены',
        part3: 'Пакіньце пуста, каб выкарыстоўваць',
        part4: 'параметр замест гэтага.'
      },
      name: 'Імя перайменаванага файла далучэння'
    },
    resetToSampleCustomTokens: {
      message: 'Вы ўпэўнены, што хочаце скінуць карыстальніцкія токены да ўзорных карыстальніцкіх токенаў? Вашы змены будуць страчаны.',
      title: 'Скінуць да ўзорных карыстальніцкіх токенаў'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Ці канвертаваць устаўленыя выявы ў JPEG. Ужываецца толькі калі змесціва PNG выявы ўстаўляецца непасрэдна з буфера абмену. Звычайна для ўстаўкі скрыншотаў.',
      name: 'Ці канвертаваць устаўленыя выявы ў JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Калі ўключана, калі нататка выдаляецца, яе сіроцкія далучэнні таксама выдаляюцца.',
      name: 'Ці выдаляць сіроцкія далучэнні'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'Калі ўключана, калі нататка перайменавана або перамешчана, яе далучэнні будуць перайменаваны згодна з',
        part2: 'параметрам.'
      },
      name: 'Ці перайменаваць файлы далучэнняў'
    },
    shouldRenameAttachmentFolders: {
      description: 'Ці перайменаваць папкі далучэнняў калі нататка перайменавана або перамешчана.',
      name: 'Ці перайменаваць папкі далучэнняў'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Калі ўключана, далучэнні апрацаваныя праз',
        part2: 'Збор далучэнняў',
        part3: 'каманды будуць перайменаваны згодна з',
        part4: 'параметрам.'
      },
      name: 'Ці перайменаваць сабраныя далучэнні'
    },
    specialCharacters: {
      description: {
        part1: 'Спецыяльныя сімвалы ў папцы далучэнняў і імені файла для замены або выдалення.',
        part2: 'Пакіньце пустым для захавання спецыяльных сімвалаў.'
      },
      name: 'Спецыяльныя сімвалы'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Радок замены для спецыяльных сімвалаў у папцы далучэнняў і імені файла.',
        part2: 'Пакіньце пустым для выдалення спецыяльных сімвалаў.'
      },
      name: 'Замена спецыяльных сімвалаў'
    },
    timeoutInSeconds: {
      description: {
        part1: 'Тайм-аўт у секундах для ўсіх аперацый.',
        part2: 'Калі',
        part3: 'устаноўлены, тайм-аўт выканання аперацый адключаны.'
      },
      name: 'Тайм-аўт у секундах'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Адносіцца да файлаў з гэтымі пашырэннямі як да далучэнняў.',
        part2: 'Па змаўчанні',
        part3: 'і',
        part4: 'звязаныя файлы не разглядаюцца як далучэнні і не перамяшчаюцца з нататкай.',
        part5: 'Вы можаце дадаць карыстальніцкія пашырэнні, напр.',
        part6: ', каб пераазначыць гэтую паводзіны.'
      },
      name: 'Адносіцца як да пашырэнняў далучэнняў'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Праглядзець файл далучэння \'{{fullFileName}}\''
    },
    title: 'Укажыце значэнне для токена запыту'
  },
  regularExpression: '/рэгулярны выраз/'
};
