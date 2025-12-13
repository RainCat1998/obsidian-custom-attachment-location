import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const kh: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'តើអ្នកចង់ប្រមូលឯកសារភ្ជាប់សម្រាប់កំណត់ត្រាទាំងអស់ក្នុងថតដោយធ្វើជាច្រើនកម្រិត (recursive) ដែរឬទេ?',
      part2: 'ប្រតិបត្តិការនេះមិនអាចបង្រ្កាបវិញបានទេ។'
    },
    progressBar: {
      message: 'កំពុងប្រក័បអទឹងដេរ {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'កំពុងប្រក័បអទឹងដេរ...'
    }
  },
  buttons: {
    copy: 'ចំលង',
    move: 'ផ្លាស់ទី',
    previewAttachmentFile: 'ប្រេវដាក់មើលឯកសារចំនាប់',
    skip: 'រំលង'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'ឯកសារចំណាប់',
      part2: 'ត្រូវបានអានកៅដោយការចំណាំច្រើន.'
    },
    heading: 'កំពុងប្រក័បអទឹងដេរដេលត្រូវបានប្រើដោយការចំណាំច្រើន',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'គុរប្រើការប្រតិបត្តិការដែលដ៉កសម្រាប់អទឹងដេរចំណាប់ដេលមានបញ្ហាផ្សេងទៀត'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'កំពុងប្រក័បអទឹងដេរនៅក្នុងទឹតែកបច្ចុប្បន្ន',
    collectAttachmentsCurrentNote: 'កំពុងប្រក័បអទឹងដេរនៅក្នុងការចំណាំបច្ចុប្បន្ន',
    collectAttachmentsEntireVault: 'កំពុងប្រក័បអទឹងដេរនៅក្នុងក្និនគ្រាប់មួយ'
  },
  menuItems: {
    collectAttachmentsInFile: 'ប្រមូលឯកសារភ្ជាប់ក្នុងឯកសារ',
    collectAttachmentsInFiles: 'ប្រមូលឯកសារភ្ជាប់ក្នុងឯកសារច្រើន'
  },
  notice: {
    collectingAttachments: 'កំពុងប្រក័បអទឹងដេរសម្រាប់ \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'ការកំពុងប្រក័បអទឹងដេរត្រូវបានបុកចេល។ មើលកន្សោលសម្រាប់រាយលំអិត។',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'ឈ្មោះឯកសារចំណាប់ដេលបានបង្កើត \'{{path}}\' មិនត្រឹមត្រូវទេ។\n{{validationMessage}}\nពិនិត្យមើល',
      part2: 'ការកំណត់របស់អ្នក។'
    },
    notePathIsIgnored: 'ធ្នាំការចំណាំត្រូវបានមិនចាប់អារម្មណ៍'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'បុកចេល',
      ok: 'OK'
    },
    dataview: {
      itemsPerPage: 'ធាតុក្នុងមួយទំព័រ:',
      jumpToPage: 'លោតទៅទំព័រ:'
    },
    notices: {
      attachmentIsStillUsed: 'ឯកសារចំណាប់ {{attachmentPath}} នៅតែត្រូវបានប្រើដោយការចំណាំផ្សេងទៀត។ វានឹងមិនត្រូវបានលុបទេ។',
      unhandledError: 'កំហុសដែលមិនបានដោះស្រាយបានកើតឡើង។ សូមពិនិត្យមើលកន្សោមសម្រាប់ព័ត៌មានបន្ថែម។'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'ឯកសារទាំងអស់ត្រូវបានប្តូរឈ្មោះ។',
        displayText: 'ទាំងអស់'
      },
      none: {
        description: 'ឈ្មោះរបស់ពួកគេត្រូវបានរក្សាទុក។',
        displayText: 'គ្មាន'
      },
      onlyPastedImages: {
        description: 'តែរូបភាពដែលបានបិទប៉ុណ្ណោះត្រូវបានប្តូរឈ្មោះ។ អនុវត្តតែនៅពេលដែលមាតិការូបភាព PNG ត្រូវបានបិទពីក្តារតម្រៀបដោយផ្ទាល់។ ជាធម្មតា សម្រាប់ការបិទរូបថតអេក្រង់។',
        displayText: 'តែរូបភាពដែលបានបិទប៉ុណ្ណោះ'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'បុកចេលការប្រក័បឯកសារចំណាប់។',
        displayText: 'បុកចេល'
      },
      copy: {
        description: 'ចំលងឯកសារចំណាប់ទៅទីតាំងថ្មី។',
        displayText: 'ចំលង'
      },
      move: {
        description: 'ផ្លាស់ទីឯកសារចំណាប់ទៅទីតាំងថ្មី។',
        displayText: 'ផ្លាស់ទី'
      },
      prompt: {
        description: 'ជំរុញអ្នកប្រើឱ្យជ្រើសរើសសកម្មភាព។',
        displayText: 'ជំរុញ'
      },
      skip: {
        description: 'រំលងឯកសារចំណាប់និងបន្តទៅបន្ទាប់។',
        displayText: 'រំលង'
      }
    },
    defaultImageSizeDimension: {
      height: 'កម្ពស់',
      width: 'ទទឹង'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'នឹងលុបទឹតែកឯកសារចំណាប់ទទេ។',
        displayText: 'លុប'
      },
      deleteWithEmptyParents: {
        description: 'នឹងលុបទឹតែកឯកសារចំណាប់ទទេនិងទឹតែកមេទទេរបស់វា។',
        displayText: 'លុបជាមួយមេទទេ'
      },
      keep: {
        description: 'នឹងរក្សាទឹតែកឯកសារចំណាប់ទទេ។',
        displayText: 'រក្សាទុក'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// សញ្ញាសម្គាល់ផ្ទាល់ខ្លួនត្រូវបានដកចេញពីមតិយោបល់ពីព្រោះពួកគេត្រូវតែបានធ្វើបច្ចុប្បន្នភាពទៅជាទម្រង់ថ្មីដែលបានណែនាំក្នុងកំណែផ្នែកបន្ថែម 9.0.0។\n// សូមមើលឯកសារយោង (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) សម្រាប់ព័ត៌មានបន្ថែម។',
      deprecated: {
        part1: 'ក្នុងកំណែផ្នែកបន្ថែម 9.0.0 ទម្រង់នៃការចុះឈ្មោះសញ្ញាសម្គាល់ផ្ទាល់ខ្លួនបានផ្លាស់ប្តូរ។ សូមធ្វើបច្ចុប្បន្នភាពសញ្ញាសម្គាល់របស់អ្នកតាម។ សូមមើល',
        part2: 'ឯកសារយោង',
        part3: 'សម្រាប់ព័ត៌មានបន្ថែម'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'ក្នុងកំណែផ្នែកបន្ថែម 9.0.0 ការកំណត់',
      part2: 'ត្រូវបានបដិសេធ។ ប្រើ',
      part3: 'ទម្រង់ជំនួស។ មើល',
      part4: 'ឯកសារយោង',
      part5: 'សម្រាប់ព័ត៌មានបន្ថែម'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'អ្នកមានតម្លៃដែលមិនត្រឹមត្រូវសម្រាប់',
        part2: 'ទម្រង់។ សូមមើល',
        part3: 'ឯកសារយោង',
        part4: 'សម្រាប់ព័ត៌មានបន្ថែម',
        part5: 'សារនេះនឹងមិនត្រូវបានបង្ហាញម្តងទៀតទេ។'
      }
    },
    specialCharacters: {
      part1: 'ក្នុងកំណែផ្នែកបន្ថែម 9.16.0 តម្លៃការកំណត់លំនាំដើម',
      part2: 'បានផ្លាស់ប្តូរ។ តម្លៃការកំណត់របស់អ្នកត្រូវបានធ្វើបច្ចុប្បន្នភាពទៅតម្លៃលំនាំដើមថ្មី។'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'ទំហំរូបភាពលំនាំដើមត្រូវតែជាភាគរយ ឬ ភីកសែល',
      invalidCustomTokensCode: 'កូដសញ្ញាសម្គាល់ផ្ទាល់ខ្លួនមិនត្រឹមត្រូវ',
      invalidRegularExpression: 'កន្សោមធម្មតាមិនត្រឹមត្រូវ {{regExp}}',
      specialCharactersMustNotContainSlash: 'តួអក្សរពិសេសមិនត្រូវមាន /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters: 'ការជំនួសតួអក្សរពិសេសមិនត្រូវមានតួអក្សរផ្លូវឈ្មោះឯកសារមិនត្រឹមត្រូវ។'
    },
    version: {
      part1: 'ឯកសារការកំណត់របស់អ្នក ',
      part2: 'មានកំណែ',
      part3: 'ដែលថ្មីជាងកំណែផ្នែកបន្ថែមបច្ចុប្បន្ន',
      part4: 'ផ្នែកបន្ថែមអាចមិនដំណើរការតាមដែលរំពឹងទុក។ សូមធ្វើបច្ចុប្បន្នភាពផ្នែកបន្ថែមទៅកំណែចុងក្រោយបំផុត ឬធានាថាការកំណត់ត្រឹមត្រូវ។'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'នៅពេលភ្ជាប់ឯកសារ:'
      },
      name: 'របៀបប្តូរឈ្មោះឯកសារចំណាប់'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'នៅពេលឯកសារចំណាប់ដែលបានប្រក័បត្រូវបានប្រើដោយការចំណាំច្រើន:'
      },
      name: 'របៀបប្រក័បឯកសារចំណាប់ដែលប្រើដោយការចំណាំច្រើន'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'មើល',
        part2: 'សញ្ញាសម្គាល់ដែលមាន'
      },
      name: 'ឈ្មោះឯកសារចំណាប់ដែលបានប្រក័ប'
    },
    customTokens: {
      description: {
        part1: 'សញ្ញាសម្គាល់ផ្ទាល់ខ្លួនដែលត្រូវប្រើ។',
        part2: 'មើល',
        part3: 'ឯកសារយោង',
        part4: 'សម្រាប់ព័ត៌មានបន្ថែម។',
        part5: '⚠️ សញ្ញាសម្គាល់ផ្ទាល់ខ្លួនអាចជាកូដ JavaScript បំពាន។ ប្រសិនបើសរសេរមិនល្អ វាអាចបណ្តាលឱ្យបាត់បង់ទិន្នន័យ។ ប្រើវាតាមហានុភាពរបស់អ្នក។'
      },
      name: 'សញ្ញាសម្គាល់ផ្ទាល់ខ្លួន'
    },
    defaultImageSize: {
      description: {
        part1: 'ទំហំរូបភាពលំនាំដើម។',
        part2: 'អាចកំណត់ជាភីកសែលបាន',
        part3: 'ឬជាភាគរយនៃទំហំរូបភាពពេញ',
        part4: 'ទុកឲ្យទទេដើម្បីប្រើទំហំដើម។'
      },
      name: 'ទំហំរូបភាពលំនាំដើម'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'នៅពេលអ្នកកំពុងបិទ/ទាញឯកសារដែលមានឈ្មោះដូចគ្នានឹងឯកសារដែលមានស្រាប់ អ្នកបំបែកនេះនឹងត្រូវបានបន្ថែមទៅឈ្មោះឯកសារ។',
        part2: 'ឧទាហរណ៍ នៅពេលអ្នកកំពុងទាញឯកសារ',
        part3: ' វានឹងត្រូវបានប្តូរឈ្មោះទៅ',
        part4: ' ជាដើម ទទួលបានឈ្មោះដំបូងដែលមាន។'
      },
      name: 'អ្នកបំបែកឈ្មោះដូចគ្នា'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'នៅពេលទឹតែកឯកសារចំណាប់ក្លាយជាទទេ:'
      },
      name: 'ឥរិយាបទទឹតែកឯកសារចំណាប់ទទេ'
    },
    excludePaths: {
      description: {
        part1: 'ដកចេញការចំណាំពីផ្លូវខាងក្រោម។',
        part2: 'បញ្ចូលផ្លូវនីមួយៗនៅលើបន្ទាត់ថ្មី។',
        part3: 'អ្នកអាចប្រើខ្សែអក្សរផ្លូវ ឬ',
        part4: 'ប្រសិនបើការកំណត់ទទេ គ្មានការចំណាំណាមួយត្រូវបានដកចេញទេ។'
      },
      name: 'ដកចេញផ្លូវ'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'ដកចេញឯកសារចំណាប់ពីផ្លូវខាងក្រោមនៅពេល',
        part2: 'ប្រក័បឯកសារចំណាប់',
        part3: 'ពាក្យបញ្ជាត្រូវបានប្រតិបត្តិ។',
        part4: 'បញ្ចូលផ្លូវនីមួយៗនៅលើបន្ទាត់ថ្មី។',
        part5: 'អ្នកអាចប្រើខ្សែអក្សរផ្លូវ ឬ',
        part6: 'ប្រសិនបើការកំណត់ទទេ គ្មានផ្លូវណាមួយត្រូវបានដកចេញពីការប្រក័បឯកសារចំណាប់ទេ។'
      },
      name: 'ដកចេញផ្លូវពីការប្រក័បឯកសារចំណាប់'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'មើល',
        part2: 'សញ្ញាសម្គាល់ដែលមាន'
      },
      name: 'ឈ្មោះឯកសារចំណាប់ដែលបានបង្កើត'
    },
    includePaths: {
      description: {
        part1: 'រាប់បញ្ចូលការចំណាំពីផ្លូវខាងក្រោម។',
        part2: 'បញ្ចូលផ្លូវនីមួយៗនៅលើបន្ទាត់ថ្មី។',
        part3: 'អ្នកអាចប្រើខ្សែអក្សរផ្លូវ ឬ',
        part4: 'ប្រសិនបើការកំណត់ទទេ ការចំណាំទាំងអស់ត្រូវបានរាប់បញ្ចូល។'
      },
      name: 'រាប់បញ្ចូលផ្លូវ'
    },
    jpegQuality: {
      description: 'គុណភាពតូចជាង សមាមាត្របង្ហាប់កាន់តែធំ។',
      name: 'គុណភាព JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'ចាប់ផ្តើមដោយ',
        part2: 'ដើម្បីប្រើផ្លូវទាក់ទង។',
        part3: 'មើល',
        part4: 'សញ្ញាសម្គាល់ដែលមាន',
        part5: 'ទឹតែកចំណុចដូចជា',
        part6: 'មិនត្រូវបានណែនាំ ពីព្រោះ Obsidian មិនតាមដានពួកវាទេ។ អ្នកអាចត្រូវការប្រើ',
        part7: 'ផ្នែកបន្ថែមដើម្បីគ្រប់គ្រងពួកវា។'
      },
      name: 'ទីតាំងសម្រាប់ឯកសារចំណាប់ថ្មី'
    },
    markdownUrlFormat: {
      description: {
        part1: 'ទម្រង់សម្រាប់ URL ដែលនឹងត្រូវបានបញ្ចូលទៅក្នុង Markdown។',
        part2: 'មើល',
        part3: 'សញ្ញាសម្គាល់ដែលមាន',
        part4: 'ទុកទទេដើម្បីប្រើទម្រង់លំនាំដើម។'
      },
      name: 'ទម្រង់ URL Markdown'
    },
    renameAttachmentsToLowerCase: 'ប្តូរឈ្មោះឯកសារចំណាប់ទៅជាអក្សរតូច',
    renamedAttachmentFileName: {
      description: {
        part1: 'មើល',
        part2: 'សញ្ញាសម្គាល់ដែលមាន'
      },
      name: 'ឈ្មោះឯកសារចំណាប់ដែលបានប្តូរឈ្មោះ'
    },
    resetToSampleCustomTokens: {
      message: 'តើអ្នកប្រាកដថាចង់កំណត់ឡើងវិញសញ្ញាសម្គាល់ផ្ទាល់ខ្លួនទៅសញ្ញាសម្គាល់ផ្ទាល់ខ្លួនគំរូ? ការផ្លាស់ប្តូររបស់អ្នកនឹងបាត់បង់។',
      title: 'កំណត់ឡើងវិញទៅសញ្ញាសម្គាល់ផ្ទាល់ខ្លួនគំរូ'
    },
    shouldConvertPastedImagesToJpeg: {
      description: 'តើត្រូវប្តូររូបភាពដែលបានបិទទៅ JPEG ឬទេ។ អនុវត្តតែនៅពេលដែលមាតិការូបភាព PNG ត្រូវបានបិទពីក្តារតម្រៀបដោយផ្ទាល់។ ជាធម្មតា សម្រាប់ការបិទរូបថតអេក្រង់។',
      name: 'តើត្រូវប្តូររូបភាពដែលបានបិទទៅ JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'ប្រសិនបើបើក នៅពេលការចំណាំត្រូវបានលុប ឯកសារចំណាប់កំព្រារបស់វាក៏ត្រូវបានលុបដែរ។',
      name: 'តើត្រូវលុបឯកសារចំណាប់កំព្រា'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'ប្រសិនបើបើក នៅពេលការចំណាំត្រូវបានប្តូរឈ្មោះ ឬផ្លាស់ទី ឯកសារចំណាប់នឹងត្រូវបានប្តូរឈ្មោះតាម',
        part2: 'ការកំណត់។'
      },
      name: 'តើត្រូវប្តូរឈ្មោះឯកសារចំណាប់'
    },
    shouldRenameAttachmentFolders: {
      description: 'តើត្រូវប្តូរឈ្មោះទឹតែកឯកសារចំណាប់នៅពេលការចំណាំត្រូវបានប្តូរឈ្មោះ ឬផ្លាស់ទី។',
      name: 'តើត្រូវប្តូរឈ្មោះទឹតែកឯកសារចំណាប់'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'ប្រសិនបើបើក ឯកសារចំណាប់ដែលបានដំណើរការតាមរយៈ',
        part2: 'ប្រក័បឯកសារចំណាប់',
        part3: 'ពាក្យបញ្ជានឹងត្រូវបានប្តូរឈ្មោះតាម',
        part4: 'ការកំណត់។'
      },
      name: 'តើត្រូវប្តូរឈ្មោះឯកសារចំណាប់ដែលបានប្រក័ប'
    },
    specialCharacters: {
      description: {
        part1: 'តួអក្សរពិសេសក្នុងឈ្មោះទឹតែក និងឯកសារចំណាប់ដែលត្រូវបានជំនួស ឬដកចេញ។',
        part2: 'ទុកទទេដើម្បីរក្សាទុកតួអក្សរពិសេស។'
      },
      name: 'តួអក្សរពិសេស'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'ខ្សែអក្សរជំនួសសម្រាប់តួអក្សរពិសេសក្នុងឈ្មោះទឹតែក និងឯកសារចំណាប់។',
        part2: 'ទុកទទេដើម្បីដកចេញតួអក្សរពិសេស។'
      },
      name: 'ការជំនួសតួអក្សរពិសេស'
    },
    timeoutInSeconds: {
      description: {
        part1: 'ពេលវេលាអស់សម្រាប់ប្រតិបត្តិការទាំងអស់ (វិនាទី)។',
        part2: 'ប្រសិនបើ',
        part3: 'ត្រូវបានកំណត់ ពេលវេលាអស់ប្រតិបត្តិការប្រតិបត្តិការត្រូវបានបិទ។'
      },
      name: 'ពេលវេលាអស់ (វិនាទី)'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'ពិចារណាឯកសារដែលមានការពន្យារពេលទាំងនេះជាឯកសារចំណាប់។',
        part2: 'តាមលំនាំដើម',
        part3: 'និង',
        part4: 'ឯកសារដែលភ្ជាប់មិនត្រូវបានពិចារណាជាឯកសារចំណាប់ និងមិនត្រូវបានផ្លាស់ទីជាមួយការចំណាំ។',
        part5: 'អ្នកអាចបន្ថែមការពន្យារពេលផ្ទាល់ខ្លួន ឧទាហរណ៍',
        part6: ' ដើម្បីបដិសេធឥរិយាបទនេះ។'
      },
      name: 'ពិចារណាជាការពន្យារពេលឯកសារចំណាប់'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'ប្រេវដាក់មើលឯកសារចំណាប់ \'{{fullFileName}}\''
    },
    title: 'ផ្តល់តម្លៃសម្រាប់សញ្ញាសម្គាល់ជំរុញ'
  },
  regularExpression: '/កន្សោមធម្មតា/'
};
