import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const ar: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'هل تريد جمع المرفقات لجميع الملاحظات في المجلد:',
      part2: 'وجميع المجلدات الفرعية؟',
      part3: 'لا يمكن التراجع عن هذه العملية.'
    },
    progressBar: {
      message: 'جمع المرفقات {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'جمع المرفقات...'
    }
  },
  buttons: {
    copy: 'نسخ',
    move: 'نقل',
    previewAttachmentFile: 'معاينة ملف المرفق',
    skip: 'تخطي'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'المرفق',
      part2: 'يتم الرجوع إليه من عدة ملاحظات.'
    },
    heading: 'جمع المرفق المستخدم من عدة ملاحظات',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'يجب استخدام نفس الإجراء للمرفقات المشكوك فيها الأخرى'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'جمع المرفقات في المجلد الحالي',
    collectAttachmentsCurrentNote: 'جمع المرفقات في الملاحظة الحالية',
    collectAttachmentsEntireVault: 'جمع المرفقات في الخزانة بأكملها'
  },
  menuItems: {
    collectAttachmentsInFolder: 'جمع المرفقات في المجلد'
  },
  notice: {
    collectingAttachments: 'جمع المرفقات لـ \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'تم إلغاء جمع المرفقات. راجع وحدة التحكم للتفاصيل.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'اسم ملف المرفق المُولد \'{{path}}\' غير صالح.\n{{validationMessage}}\nتحقق من',
      part2: 'الإعداد.'
    },
    notePathIsIgnored: 'مسار الملاحظة مُتجاهل'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'إلغاء',
      ok: 'موافق'
    },
    dataview: {
      itemsPerPage: 'العناصر في الصفحة:',
      jumpToPage: 'الانتقال إلى الصفحة:'
    },
    notices: {
      attachmentIsStillUsed: 'المرفق {{attachmentPath}} لا يزال مستخدماً من ملاحظات أخرى. لن يتم حذفه.',
      unhandledError: 'حدث خطأ غير معالج. يرجى التحقق من وحدة التحكم لمزيد من المعلومات.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'جميع الملفات يتم إعادة تسميتها.',
        displayText: 'الكل'
      },
      none: {
        description: 'أسماؤها محفوظة.',
        displayText: 'لا شيء'
      },
      onlyPastedImages: {
        description: 'الصور المُلصقة فقط يتم إعادة تسميتها. ينطبق فقط عند لصق محتوى صورة PNG مباشرة من الحافظة. عادة، للصق لقطات الشاشة.',
        displayText: 'الصور المُلصقة فقط'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'إلغاء جمع المرفقات.',
        displayText: 'إلغاء'
      },
      copy: {
        description: 'نسخ المرفق إلى الموقع الجديد.',
        displayText: 'نسخ'
      },
      move: {
        description: 'نقل المرفق إلى الموقع الجديد.',
        displayText: 'نقل'
      },
      prompt: {
        description: 'مطالبة المستخدم باختيار الإجراء.',
        displayText: 'مطالبة'
      },
      skip: {
        description: 'تخطي المرفق والمتابعة إلى التالي.',
        displayText: 'تخطي'
      }
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'سيحذف مجلد المرفقات الفارغ.',
        displayText: 'حذف'
      },
      deleteWithEmptyParents: {
        description: 'سيحذف مجلد المرفقات الفارغ ومجلداته الأصلية الفارغة.',
        displayText: 'حذف مع المجلدات الأصلية الفارغة'
      },
      keep: {
        description: 'سيحتفظ بمجلد المرفقات الفارغ.',
        displayText: 'الاحتفاظ'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// تم تعليق الرموز المخصصة لأنها تحتاج إلى تحديث للتنسيق الجديد المُقدم في إصدار الإضافة 9.0.0.\n// راجع الوثائق (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) لمزيد من المعلومات.',
      deprecated: {
        part1: 'في إصدار الإضافة 9.0.0، تغير تنسيق تسجيل الرمز المخصص. يرجى تحديث رموزك وفقاً لذلك. راجع',
        part2: 'الوثائق',
        part3: 'لمزيد من المعلومات'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'في إصدار الإضافة 9.0.0،',
      part2: 'الإعداد مُهمل. استخدم',
      part3: 'التنسيق بدلاً من ذلك. انظر',
      part4: 'الوثائق',
      part5: 'لمزيد من المعلومات'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'لديك قيمة محتملة غير صحيحة مُعينة لـ',
        part2: 'التنسيق. يرجى الرجوع إلى',
        part3: 'الوثائق',
        part4: 'لمزيد من المعلومات',
        part5: 'لن تظهر هذه الرسالة مرة أخرى.'
      }
    },
    specialCharacters: {
      part1: 'في إصدار الإضافة 9.16.0،',
      part2: 'تم تغيير قيمة الإعداد الافتراضية. تم تحديث قيمة إعدادك إلى القيمة الافتراضية الجديدة.'
    },
    validation: {
      invalidCustomTokensCode: 'كود الرموز المخصصة غير صالح',
      invalidRegularExpression: 'التعبير النمطي غير صالح {{regExp}}',
      specialCharactersMustNotContainSlash: 'الأحرف الخاصة يجب ألا تحتوي على /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters: 'استبدال الأحرف الخاصة يجب ألا يحتوي على أحرف مسار اسم ملف غير صالحة.'
    },
    version: {
      part1: 'ملف إعداداتك ',
      part2: 'له إصدار',
      part3: 'أحدث من إصدار الإضافة الحالي',
      part4: 'قد لا تعمل الإضافة كما هو متوقع. يرجى تحديث الإضافة إلى أحدث إصدار أو التأكد من صحة الإعدادات.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'عند إرفاق الملفات:'
      },
      name: 'وضع إعادة تسمية المرفقات'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'عندما يتم استخدام المرفق المجموع من عدة ملاحظات:'
      },
      name: 'وضع جمع المرفق المستخدم من عدة ملاحظات'
    },
    customTokens: {
      description: {
        part1: 'الرموز المخصصة المراد استخدامها.',
        part2: 'انظر',
        part3: 'الوثائق',
        part4: 'لمزيد من المعلومات.',
        part5: '⚠️ يمكن أن تكون الرموز المخصصة كود JavaScript عشوائي. إذا كانت مكتوبة بشكل سيء، يمكن أن تسبب فقدان البيانات. استخدمها على مسؤوليتك الخاصة.'
      },
      name: 'الرموز المخصصة'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'عندما تقوم بلصق/سحب ملف بنفس اسم ملف موجود، سيتم إضافة هذا الفاصل إلى اسم الملف.',
        part2: 'مثلاً، عندما تسحب الملف',
        part3: '، سيتم إعادة تسميته إلى',
        part4: '، إلخ، للحصول على أول اسم متاح.'
      },
      name: 'فاصل الأسماء المكررة'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'عندما يصبح مجلد المرفقات فارغاً:'
      },
      name: 'سلوك مجلد المرفقات الفارغ'
    },
    excludePaths: {
      description: {
        part1: 'استبعاد الملاحظات من المسارات التالية.',
        part2: 'أدخل كل مسار في سطر جديد.',
        part3: 'يمكنك استخدام سلسلة المسار أو',
        part4: 'إذا كان الإعداد فارغاً، لن يتم استبعاد أي ملاحظات.'
      },
      name: 'استبعاد المسارات'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'استبعاد المرفقات من المسارات التالية عند',
        part2: 'جمع المرفقات',
        part3: 'تنفيذ الأمر.',
        part4: 'أدخل كل مسار في سطر جديد.',
        part5: 'يمكنك استخدام سلسلة المسار أو',
        part6: 'إذا كان الإعداد فارغاً، لن يتم استبعاد أي مسارات من جمع المرفقات.'
      },
      name: 'استبعاد المسارات من جمع المرفقات'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'انظر',
        part2: 'الرموز المتاحة'
      },
      name: 'اسم ملف المرفق المُولد'
    },
    includePaths: {
      description: {
        part1: 'تضمين الملاحظات من المسارات التالية.',
        part2: 'أدخل كل مسار في سطر جديد.',
        part3: 'يمكنك استخدام سلسلة المسار أو',
        part4: 'إذا كان الإعداد فارغاً، ستتم تضمين جميع الملاحظات.'
      },
      name: 'تضمين المسارات'
    },
    jpegQuality: {
      description: 'كلما قل الجودة، زادت نسبة الضغط.',
      name: 'جودة JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'ابدأ بـ',
        part2: 'لاستخدام المسار النسبي.',
        part3: 'انظر',
        part4: 'الرموز المتاحة',
        part5: 'المجلدات النقطية مثل',
        part6: 'غير موصى بها، لأن Obsidian لا يتتبعها. قد تحتاج إلى استخدام',
        part7: 'إضافة لإدارتها.'
      },
      name: 'موقع المرفقات الجديدة'
    },
    markdownUrlFormat: {
      description: {
        part1: 'تنسيق الرابط الذي سيتم إدراجه في Markdown.',
        part2: 'انظر',
        part3: 'الرموز المتاحة',
        part4: 'اتركه فارغاً لاستخدام التنسيق الافتراضي.'
      },
      name: 'تنسيق رابط Markdown'
    },
    renameAttachmentsToLowerCase: 'إعادة تسمية المرفقات بأحرف صغيرة',
    resetToSampleCustomTokens: {
      message: 'هل أنت متأكد من أنك تريد إعادة تعيين الرموز المخصصة إلى الرموز المخصصة النموذجية؟ ستضيع تغييراتك.',
      title: 'إعادة تعيين إلى الرموز المخصصة النموذجية'
    },
    shouldConvertPastedImagesToJpeg: {
      description: 'ما إذا كان يجب تحويل الصور المُلصقة إلى JPEG. ينطبق فقط عند لصق محتوى صورة PNG مباشرة من الحافظة. عادة، للصق لقطات الشاشة.',
      name: 'يجب تحويل الصور المُلصقة إلى JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'إذا تم تفعيله، عند حذف الملاحظة، سيتم حذف مرفقاتها اليتيمة أيضاً.',
      name: 'يجب حذف المرفقات اليتيمة'
    },
    shouldRenameAttachmentFiles: {
      description: 'ما إذا كان يجب إعادة تسمية ملفات المرفقات عند إعادة تسمية أو نقل الملاحظة.',
      name: 'يجب إعادة تسمية ملفات المرفقات'
    },
    shouldRenameAttachmentFolders: {
      description: 'ما إذا كان يجب إعادة تسمية مجلدات المرفقات عند إعادة تسمية أو نقل الملاحظة.',
      name: 'يجب إعادة تسمية مجلدات المرفقات'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'إذا تم تفعيله، المرفقات المعالجة عبر',
        part2: 'جمع المرفقات',
        part3: 'الأوامر سيتم إعادة تسميتها وفقاً لـ',
        part4: 'الإعداد.'
      },
      name: 'يجب إعادة تسمية المرفقات المجموعة'
    },
    specialCharacters: {
      description: {
        part1: 'الأحرف الخاصة في مجلد المرفقات واسم الملف المراد استبدالها أو إزالتها.',
        part2: 'اتركه فارغاً للحفاظ على الأحرف الخاصة.'
      },
      name: 'الأحرف الخاصة'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'سلسلة الاستبدال للأحرف الخاصة في مجلد المرفقات واسم الملف.',
        part2: 'اتركه فارغاً لإزالة الأحرف الخاصة.'
      },
      name: 'استبدال الأحرف الخاصة'
    },
    timeoutInSeconds: {
      description: {
        part1: 'مهلة الوقت بالثواني لجميع العمليات.',
        part2: 'إذا تم تعيين',
        part3: '، يتم تعطيل مهلة تنفيذ العمليات.'
      },
      name: 'مهلة الوقت بالثواني'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'اعتبر الملفات بهذه الامتدادات كمرفقات.',
        part2: 'افتراضياً',
        part3: 'و',
        part4: 'الملفات المرتبطة لا تُعتبر مرفقات ولا يتم نقلها مع الملاحظة.',
        part5: 'يمكنك إضافة امتدادات مخصصة، مثلاً',
        part6: '، لتجاوز هذا السلوك.'
      },
      name: 'اعتبار كامتدادات مرفقات'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'معاينة ملف المرفق \'{{fullFileName}}\''
    },
    title: 'قدم قيمة للرمز المطالبة'
  },
  regularExpression: '/التعبير النمطي/'
};
