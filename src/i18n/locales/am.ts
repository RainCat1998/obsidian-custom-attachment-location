import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const am: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'በአቃፊዎች ውስጥ ላሉ ሁሉም ማስታወሻዎች ተያያዥ ፋይሎችን በተደጋጋሚ መሰብሰብ ትፈልጋለህ?',
      part2: 'ይህ እርምጃ መመለስ አይቻልም።'
    },
    progressBar: {
      message: 'ተያያዥ ፋይሎችን በመሰብሰብ ላይ {{iterationStr}} - \'{{noteFilePath}}\'።',
      title: 'ተያያዥ ፋይሎችን በመሰብሰብ ላይ...'
    }
  },
  buttons: {
    copy: 'መቅዳት',
    move: 'መውሰድ',
    previewAttachmentFile: 'ተያያዥ ፋይል ቅድመ እይታ',
    skip: 'መዝለፍ'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'ተያያዥ',
      part2: 'በበርካታ ማስታወሻዎች ይጠቀሳል።'
    },
    heading: 'በበርካታ ማስታወሻዎች የሚጠቀም ተያያዥ መሰብሰብ',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'ለሌሎች ችግር ያላቸው ተያያዦች ተመሳሳይ እርምጃ መጠቀም አለበት'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'በአሁኑ ፎልደር ውስጥ ተያያዦችን መሰብሰብ',
    collectAttachmentsCurrentNote: 'በአሁኑ ማስታወሻ ውስጥ ተያያዦችን መሰብሰብ',
    collectAttachmentsEntireVault: 'በሙሉ ቫውልት ውስጥ ተያያዦችን መሰብሰብ'
  },
  menuItems: {
    collectAttachmentsInFile: 'በፋይል ውስጥ ተያያዥ ፋይሎችን ሰብስብ',
    collectAttachmentsInFiles: 'በፋይሎች ውስጥ ተያያዥ ፋይሎችን ሰብስብ'
  },
  notice: {
    collectingAttachments: 'ለ \'{{noteFilePath}}\' ተያያዦችን በመሰብሰብ ላይ',
    collectingAttachmentsCancelled: 'ተያያዦችን መሰብሰብ ተሰርዟል። ለዝርዝሮች ኮንሶል ይመልከቱ።',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'የተፈጠረው ተያያዥ ፋይል ስም \'{{path}}\' የማይሰራ ነው።\n{{validationMessage}}\nየእርስዎን',
      part2: 'ቅንብር ይፈትሹ።'
    },
    notePathIsIgnored: 'የማስታወሻ መንገድ ችላ ተብሏል'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'መሰረዝ',
      ok: 'እሺ'
    },
    dataview: {
      itemsPerPage: 'በአንድ ገጽ ውስጥ ያሉ ንጥሎች:',
      jumpToPage: 'ወደ ገጽ መዝለፍ:'
    },
    notices: {
      attachmentIsStillUsed: 'ተያያዥ {{attachmentPath}} አሁንም በሌሎች ማስታወሻዎች ይጠቀማል። አይሰረዝም።',
      unhandledError: 'ያልተቆጣጠረ ስህተት ተከስቷል። ለተጨማሪ መረጃ ኮንሶል ይፈትሹ።'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'ሁሉም ፋይሎች ይሰየማሉ።',
        displayText: 'ሁሉም'
      },
      none: {
        description: 'ስሞቻቸው ይጠበቃሉ።',
        displayText: 'ምንም'
      },
      onlyPastedImages: {
        description: 'የተጣበቁ ምስሎች ብቻ ይሰየማሉ። የ PNG ምስል ይዘት ከክሊፕቦርድ በቀጥታ ሲጣበቅ ብቻ ይተገበራል። በተለምዶ፣ ስክሪንሾችን ለመጣበቅ።',
        displayText: 'የተጣበቁ ምስሎች ብቻ'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'ተያያዥ መሰብሰብ መሰረዝ።',
        displayText: 'መሰረዝ'
      },
      copy: {
        description: 'ተያያዥን ወደ አዲሱ ቦታ መቅዳት።',
        displayText: 'መቅዳት'
      },
      move: {
        description: 'ተያያዥን ወደ አዲሱ ቦታ መውሰድ።',
        displayText: 'መውሰድ'
      },
      prompt: {
        description: 'ተጠቃሚውን እርምጃ እንዲመርጥ ማስጠንቀቅ።',
        displayText: 'ማስጠንቀቅ'
      },
      skip: {
        description: 'ተያያዥን መዝለፍ እና ወደ ቀጣዩ መቀጠል።',
        displayText: 'መዝለፍ'
      }
    },
    defaultImageSizeDimension: {
      height: 'እርዝመት',
      width: 'ስፋት'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'ባዶውን ተያያዥ ፎልደር ይሰርዛል።',
        displayText: 'መሰረዝ'
      },
      deleteWithEmptyParents: {
        description: 'ባዶውን ተያያዥ ፎልደር እና ባዶዎቹን የወላጅ ፎልደሮች ይሰርዛል።',
        displayText: 'ባዶ ወላጆች ጋር መሰረዝ'
      },
      keep: {
        description: 'ባዶውን ተያያዥ ፎልደር ይጠብቃል።',
        displayText: 'መጠበቅ'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// የተለመዱ ቶከኖች በፕላጊን ሥሪት 9.0.0 ውስጥ የተዋወቀውን አዲስ ቅርጸት ማዘመን ስለሚያስፈልጋቸው ተሰይመዋል።\n// ለተጨማሪ መረጃ ሰነዱን ይመልከቱ (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens)።',
      deprecated: {
        part1: 'በፕላጊን ሥሪት 9.0.0 ውስጥ፣ የተለመዱ ቶከን ምዝገባ ቅርጸት ተለወጠ። እባክዎ ቶከኖችዎን በዚሁ መሰረት ያዘምኑ። ወደ',
        part2: 'ሰነድ',
        part3: 'ለተጨማሪ መረጃ ይመልከቱ'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'በፕላጊን ሥሪት 9.0.0 ውስጥ፣',
      part2: 'ቅንብር ተሰርዟል። በምትኩ',
      part3: 'ቅርጸት ይጠቀሙ። ይመልከቱ',
      part4: 'ሰነድ',
      part5: 'ለተጨማሪ መረጃ'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'ለ',
        part2: 'ቅርጸት ምናልባት የማይሰራ እሴት አስቀመጥዎታል። እባክዎ ወደ',
        part3: 'ሰነድ',
        part4: 'ለተጨማሪ መረጃ ይመልከቱ',
        part5: 'ይህ መልዕክት እንደገና አይታይም።'
      }
    },
    specialCharacters: {
      part1: 'በፕላጊን ሥሪት 9.16.0 ውስጥ፣',
      part2: 'የመሰረት ቅንብር እሴት ተለወጠ። የእርስዎ ቅንብር እሴት ወደ አዲሱ የመሰረት እሴት ተዘመነ።'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'ነባሪ የምስል መጠን በፒክስል ወይም በመቶኛ መሆን አለበት',
      invalidCustomTokensCode: 'የማይሰራ የተለመዱ ቶከኖች ኮድ',
      invalidRegularExpression: 'የማይሰራ መደበኛ አገላለጽ {{regExp}}',
      specialCharactersMustNotContainSlash: 'ልዩ ቁምፊዎች / መያዝ የለባቸውም',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters: 'ልዩ ቁምፊ መተካት የማይሰራ የፋይል ስም መንገድ ቁምፊዎች መያዝ የለባቸውም።'
    },
    version: {
      part1: 'የእርስዎ ቅንብር ፋይል ',
      part2: 'ሥሪት አለው',
      part3: 'እሱም ከአሁኑ ፕላጊን ሥሪት የበለጠ አዲስ ነው',
      part4: 'ፕላጊኑ እንደሚጠበቀው ላይሰራ ይችላል። እባክዎ ፕላጊኑን ወደ የቅርብ ጊዜ ሥሪት ያዘምኑ ወይም ቅንብሮቹ ትክክል መሆናቸውን ያረጋግጡ።'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'ፋይሎች ሲጣበቁ:'
      },
      name: 'ተያያዥ ስም መለወጫ ሁነታ'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'የተሰበሰበው ተያያዥ በበርካታ ማስታወሻዎች ሲጠቀም:'
      },
      name: 'በበርካታ ማስታወሻዎች የሚጠቀም ተያያዥ መሰብሰብ ሁነታ'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'የሚገኙ',
        part2: 'ቶከኖችን ይመልከቱ',
        part3: 'ባዶ ይተው',
        part4: 'ቅንብርን በምትኩ ለመጠቀም።'
      },
      name: 'የተሰበሰበ ተያያዥ ፋይል ስም'
    },
    customTokens: {
      description: {
        part1: 'የሚጠቀሙ የተለመዱ ቶከኖች።',
        part2: 'ይመልከቱ',
        part3: 'ሰነድ',
        part4: 'ለተጨማሪ መረጃ።',
        part5: '⚠️ የተለመዱ ቶከኖች የዘፈቀደ JavaScript ኮድ ሊሆኑ ይችላሉ። በመጥፎ ሁኔታ ከተጻፉ፣ የመረጃ ኪሳራ ሊያስከትሉ ይችላሉ። በራስዎ አደጋ ይጠቀሙት።'
      },
      name: 'የተለመዱ ቶከኖች'
    },
    defaultImageSize: {
      description: {
        part1: 'ነባሪ የምስል መጠን።',
        part2: 'በፒክስል መወሰን ይችላል',
        part3: 'ወይም ከሙሉ የምስል መጠን መቶኛ',
        part4: 'ኦሪጅናል መጠን ለመጠቀም ባዶ ይተው።'
      },
      name: 'ነባሪ የምስል መጠን'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'ከነባር ፋይል ተመሳሳይ ስም ያለው ፋይል ሲጣበቅ/ሲጎተት፣ ይህ መለያያ ወደ ፋይል ስም ይጨመራል።',
        part2: 'ለምሳሌ፣ ፋይል',
        part3: 'ን ሲጎተቱ፣ ወደ',
        part4: 'ይሰየማል፣ ወዘተ፣ የመጀመሪያውን የሚገኝ ስም በማግኘት።'
      },
      name: 'የተደጋጋሚ ስም መለያያ'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'ተያያዥ ፎልደር ባዶ ሲሆን:'
      },
      name: 'ባዶ ተያያዥ ፎልደር አሰራር'
    },
    excludePaths: {
      description: {
        part1: 'ከሚከተሉት መንገዶች ማስታወሻዎችን አስወግድ።',
        part2: 'እያንዳንዱን መንገድ በአዲስ መስመር ያስገቡ።',
        part3: 'የመንገድ ሕብረቁምፊ ወይም',
        part4: 'ቅንብሩ ባዶ ከሆነ፣ ምንም ማስታወሻ አይገለልም።'
      },
      name: 'መንገዶችን ማስወገድ'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'ከሚከተሉት መንገዶች ተያያዦችን አስወግድ የሚሆነው',
        part2: 'ተያያዦችን መሰብሰብ',
        part3: 'ትዕዛዝ ሲፈጸም።',
        part4: 'እያንዳንዱን መንገድ በአዲስ መስመር ያስገቡ።',
        part5: 'የመንገድ ሕብረቁምፊ ወይም',
        part6: 'ቅንብሩ ባዶ ከሆነ፣ ምንም መንገድ ከተያያዥ መሰብሰብ አይገለልም።'
      },
      name: 'ከተያያዥ መሰብሰብ መንገዶችን ማስወገድ'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'የሚገኙ',
        part2: 'ቶከኖችን ይመልከቱ'
      },
      name: 'የተፈጠረ ተያያዥ ፋይል ስም'
    },
    includePaths: {
      description: {
        part1: 'ከሚከተሉት መንገዶች ማስታወሻዎችን ያካተቱ።',
        part2: 'እያንዳንዱን መንገድ በአዲስ መስመር ያስገቡ።',
        part3: 'የመንገድ ሕብረቁምፊ ወይም',
        part4: 'ቅንብሩ ባዶ ከሆነ፣ ሁሉም ማስታወሻዎች ይካተታሉ።'
      },
      name: 'መንገዶችን ማካተት'
    },
    jpegQuality: {
      description: 'ጥራቱ ያነሰ፣ የመጨመቂያ ጥምርታ ይበልጣል።',
      name: 'JPEG ጥራት'
    },
    locationForNewAttachments: {
      description: {
        part1: 'ከ',
        part2: 'ጀምሮ አንጻራዊ መንገድ ለመጠቀም።',
        part3: 'የሚገኙ',
        part4: 'ቶከኖችን ይመልከቱ',
        part5: 'እንደ',
        part6: 'ያሉ ዶት-ፎልደሮች አይመከሩም፣ ምክንያቱም Obsidian አይከታተላቸውም። ለማስተዳደር',
        part7: 'ፕላጊን መጠቀም ሊያስፈልግዎ ይችላል።'
      },
      name: 'ለአዲስ ተያያዦች ቦታ'
    },
    markdownUrlFormat: {
      description: {
        part1: 'ወደ Markdown ውስጥ የሚገባው URL ቅርጸት።',
        part2: 'የሚገኙ',
        part3: 'ቶከኖችን ይመልከቱ',
        part4: 'የመሰረት ቅርጸትን ለመጠቀም ባዶ ይተዉ።'
      },
      name: 'Markdown URL ቅርጸት'
    },
    renameAttachmentsToLowerCase: 'ተያያዦችን ወደ ትንሽ ፊደል መለወጥ',
    renamedAttachmentFileName: {
      description: {
        part1: 'የሚገኙ',
        part2: 'ቶከኖችን ይመልከቱ',
        part3: 'ባዶ ይተው',
        part4: 'ቅንብርን በምትኩ ለመጠቀም።'
      },
      name: 'የተሰየመ ተያያዥ ፋይል ስም'
    },
    resetToSampleCustomTokens: {
      message: 'የተለመዱ ቶከኖችን ወደ ናሙና የተለመዱ ቶከኖች ማዳከም እርግጠኛ ነዎት? የእርስዎ ለውጦች ይጠፋሉ።',
      title: 'ወደ ናሙና የተለመዱ ቶከኖች መለስ'
    },
    shouldConvertPastedImagesToJpeg: {
      description: 'የተጣበቁ ምስሎችን ወደ JPEG መቀየር አለበት እንደሆነ። የ PNG ምስል ይዘት ከክሊፕቦርድ በቀጥታ ሲጣበቅ ብቻ ይተገበራል። በተለምዶ፣ ስክሪንሾችን ለመጣበቅ።',
      name: 'የተጣበቁ ምስሎችን ወደ JPEG መቀየር አለበት'
    },
    shouldDeleteOrphanAttachments: {
      description: 'ከተንቃ፣ ማስታወሻ ሲሰረዝ፣ የራሱ የሆኑ ተያያዦችም ይሰረዛሉ።',
      name: 'የራሱ የሆኑ ተያያዦችን መሰረዝ አለበት'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'ከተንቃ፣ ማስታወሻ ሲሰየም ወይም ሲወሰድ፣ ተያያዦቹ በ',
        part2: 'ቅንብር መሰረት ይሰየማሉ።'
      },
      name: 'ተያያዥ ፋይሎችን መሰየም አለበት'
    },
    shouldRenameAttachmentFolders: {
      description: 'ማስታወሻ ሲሰየም ወይም ሲወሰድ፣ ተያያዥ ፎልደሮችን መሰየም አለበት።',
      name: 'ተያያዥ ፎልደሮችን መሰየም አለበት'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'ከተንቃ፣ በ',
        part2: 'ተያያዦችን መሰብሰብ',
        part3: 'ትዕዛዞች የተሰሩ ተያያዦች በ',
        part4: 'ቅንብር መሰረት ይሰየማሉ።'
      },
      name: 'የተሰበሰቡ ተያያዦችን መሰየም አለበት'
    },
    specialCharacters: {
      description: {
        part1: 'በተያያዥ ፎልደር እና ፋይል ስም ውስጥ የሚተኩ ወይም የሚወገዱ ልዩ ቁምፊዎች።',
        part2: 'ልዩ ቁምፊዎችን ለመጠበቅ ባዶ ይተዉ።'
      },
      name: 'ልዩ ቁምፊዎች'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'በተያያዥ ፎልደር እና ፋይል ስም ውስጥ ለልዩ ቁምፊዎች የመተካት ሕብረቁምፊ።',
        part2: 'ልዩ ቁምፊዎችን ለማስወገድ ባዶ ይተዉ።'
      },
      name: 'ልዩ ቁምፊዎች መተካት'
    },
    timeoutInSeconds: {
      description: {
        part1: 'ለሁሉም ስራዎች በሰከንድ የሚቆይ ጊዜ።',
        part2: 'ከሆነ',
        part3: 'ተዋቀረ፣ የስራዎች አፈጻጸም ጊዜ ይሰረዛል።'
      },
      name: 'በሰከንድ የሚቆይ ጊዜ'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'ከነዚህ ማስፋፊያዎች ጋር ያሉ ፋይሎችን እንደ ተያያዦች አስቡ።',
        part2: 'በመሰረቱ',
        part3: 'እና',
        part4: 'የተገናኙ ፋይሎች እንደ ተያያዦች አይቆጠሩም እና ከማስታወሻ ጋር አይወሰዱም።',
        part5: 'የተለመዱ ማስፋፊያዎች ማከል ይችላሉ፣ ለምሳሌ',
        part6: '፣ ይህንን አሰራር ለማስወገድ።'
      },
      name: 'እንደ ተያያዥ ማስፋፊያዎች አስቡ'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'ተያያዥ ፋይል ቅድመ እይታ \'{{fullFileName}}\''
    },
    title: 'ለማስጠንቀቂያ ቶከን እሴት ይስጡ'
  },
  regularExpression: '/መደበኛ አገላለጽ/'
};
