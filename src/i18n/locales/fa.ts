import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const fa: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'آیا می‌خواهید پیوست‌های همه یادداشت‌های موجود در پوشه جمع‌آوری شوند:',
      part2: 'و همه زیرپوشه‌های آن؟',
      part3: 'این عملیات قابل بازگشت نیست.'
    },
    progressBar: {
      message: 'جمع‌آوری پیوست‌ها {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'در حال جمع‌آوری پیوست‌ها...'
    }
  },
  buttons: {
    copy: 'کپی',
    move: 'انتقال',
    previewAttachmentFile: 'پیش‌نمایش فایل پیوست',
    skip: 'رد کردن'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'پیوست',
      part2: 'توسط چندین یادداشت ارجاع داده شده است.'
    },
    heading: 'جمع‌آوری پیوست استفاده شده توسط چندین یادداشت',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'از همان عملیات برای سایر پیوست‌های مشکل‌دار استفاده شود'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'جمع‌آوری پیوست‌ها در پوشه فعلی',
    collectAttachmentsCurrentNote: 'جمع‌آوری پیوست‌ها در یادداشت فعلی',
    collectAttachmentsEntireVault: 'جمع‌آوری پیوست‌ها در کل خزانه'
  },
  menuItems: {
    collectAttachmentsInFolder: 'جمع‌آوری پیوست‌ها در پوشه'
  },
  notice: {
    collectingAttachments: 'جمع‌آوری پیوست‌ها برای \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'جمع‌آوری پیوست‌ها لغو شد. برای جزئیات کنسول را ببینید.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'نام فایل پیوست تولید شده \'{{path}}\' نامعتبر است.\n{{validationMessage}}\nتنظیمات',
      part2: 'خود را بررسی کنید.'
    },
    notePathIsIgnored: 'مسیر یادداشت نادیده گرفته شده است'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'لغو',
      ok: 'تأیید'
    },
    dataview: {
      itemsPerPage: 'آیتم در هر صفحه:',
      jumpToPage: 'رفتن به صفحه:'
    },
    notices: {
      attachmentIsStillUsed: 'پیوست {{attachmentPath}} هنوز توسط یادداشت‌های دیگر استفاده می‌شود. حذف نخواهد شد.',
      unhandledError: 'خطای غیرقابل مدیریت رخ داد. لطفاً کنسول را برای اطلاعات بیشتر بررسی کنید.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'همه فایل‌ها تغییر نام داده می‌شوند.',
        displayText: 'همه'
      },
      none: {
        description: 'نام‌های آن‌ها حفظ می‌شود.',
        displayText: 'هیچکدام'
      },
      onlyPastedImages: {
        description:
          'فقط تصاویر قرارداده شده تغییر نام داده می‌شوند. فقط زمانی اعمال می‌شود که محتوای تصویر PNG مستقیماً از کلیپ‌بورد قرارداده شود. معمولاً برای قراردادن عکس‌های صفحه.',
        displayText: 'فقط تصاویر قرارداده شده'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'جمع‌آوری پیوست‌ها را لغو کند.',
        displayText: 'لغو'
      },
      copy: {
        description: 'پیوست را به مکان جدید کپی کند.',
        displayText: 'کپی'
      },
      move: {
        description: 'پیوست را به مکان جدید انتقال دهد.',
        displayText: 'انتقال'
      },
      prompt: {
        description: 'از کاربر بپرسد که عملیات مورد نظر را انتخاب کند.',
        displayText: 'پرسش'
      },
      skip: {
        description: 'پیوست را رد کند و به مورد بعدی برود.',
        displayText: 'رد کردن'
      }
    },
    defaultImageSizeDimension: {
      height: 'ارتفاع',
      width: 'عرض'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'پوشه خالی پیوست‌ها را حذف خواهد کرد.',
        displayText: 'حذف'
      },
      deleteWithEmptyParents: {
        description: 'پوشه خالی پیوست‌ها و پوشه‌های والد خالی آن را حذف خواهد کرد.',
        displayText: 'حذف با والدین خالی'
      },
      keep: {
        description: 'پوشه خالی پیوست‌ها را نگه خواهد داشت.',
        displayText: 'نگهداری'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// نشان‌های سفارشی کامنت شده زیرا باید به فرمت جدید معرفی شده در نسخه 9.0.0 پلاگین به‌روزرسانی شوند.\n// برای اطلاعات بیشتر به مستندات (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) مراجعه کنید.',
      deprecated: {
        part1: 'در نسخه 9.0.0 پلاگین، فرمت ثبت نشان‌های سفارشی تغییر کرده است. لطفاً نشان‌های خود را به تناسب به‌روزرسانی کنید. به',
        part2: 'مستندات',
        part3: 'برای اطلاعات بیشتر مراجعه کنید'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'در نسخه 9.0.0 پلاگین، تنظیم',
      part2: 'منسوخ شده است. به جای آن از',
      part3: 'فرمت استفاده کنید.',
      part4: 'مستندات',
      part5: 'برای اطلاعات بیشتر را ببینید'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'به احتمال زیاد مقدار نادرستی برای',
        part2: 'فرمت تنظیم کرده‌اید. لطفاً به',
        part3: 'مستندات',
        part4: 'برای اطلاعات بیشتر مراجعه کنید',
        part5: 'این پیام دیگر نشان داده نخواهد شد.'
      }
    },
    specialCharacters: {
      part1: 'در نسخه 9.16.0 پلاگین،',
      part2: 'مقدار پیش‌فرض تنظیمات تغییر کرده است. مقدار تنظیمات شما به مقدار پیش‌فرض جدید به‌روزرسانی شد.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'اندازه پیش‌فرض تصویر باید بر حسب پیکسل یا درصد باشد',
      invalidCustomTokensCode: 'کد نشان‌های سفارشی نامعتبر',
      invalidRegularExpression: 'عبارت قانونی نامعتبر {{regExp}}',
      specialCharactersMustNotContainSlash: 'کراکترهای ویژه نباید حاوی / باشند',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters: 'جایگزین کراکترهای ویژه نباید حاوی کراکترهای نامعتبر مسیر نام فایل باشد.'
    },
    version: {
      part1: 'فایل تنظیمات شما ',
      part2: 'نسخه',
      part3: 'را دارد که جدیدتر از نسخه فعلی پلاگین است',
      part4: 'پلاگین ممکن است طبق انتظار کار نکند. لطفاً پلاگین را به آخرین نسخه به‌روزرسانی کنید یا اطمینان حاصل کنید که تنظیمات صحیح هستند.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'هنگام ضمیمه کردن فایل‌ها:'
      },
      name: 'حالت تغییر نام پیوست'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'زمانی که پیوست جمع‌آوری شده توسط چندین یادداشت استفاده می‌شود:'
      },
      name: 'حالت جمع‌آوری پیوست استفاده شده توسط چندین یادداشت'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'نشان‌های موجود',
        part2: 'را ببینید',
        part3: 'برای استفاده از',
        part4: 'تنظیمات خالی بگذارید.'
      },
      name: 'نام فایل پیوست جمع‌آوری شده'
    },
    customTokens: {
      description: {
        part1: 'نشان‌های سفارشی که استفاده خواهند شد.',
        part2: 'برای اطلاعات بیشتر',
        part3: 'مستندات',
        part4: 'را ببینید.',
        part5: '⚠️ نشان‌های سفارشی می‌توانند کد JavaScript دلخواهی باشند. اگر بد نوشته شوند، می‌توانند باعث از دست رفتن داده‌ها شوند. به عهده خودتان استفاده کنید.'
      },
      name: 'نشان‌های سفارشی'
    },
    defaultImageSize: {
      description: {
        part1: 'اندازه پیش‌فرض تصویر.',
        part2: 'می‌تواند بر حسب پیکسل مشخص شود',
        part3: 'یا بر حسب درصدی از اندازه کامل تصویر',
        part4: 'برای استفاده از اندازه اصلی خالی بگذارید.'
      },
      name: 'اندازه پیش‌فرض تصویر'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'زمانی که فایلی با همان نام فایل موجود را قرارداده/کشیده می‌کنید، این جداکننده به نام فایل افزوده خواهد شد.',
        part2: 'مثلاً، زمانی که فایل',
        part3: 'را می‌کشید، به ',
        part4: 'و غیره تغییر نام خواهد یافت، تا اولین نام موجود را بیابد.'
      },
      name: 'جداکننده نام تکراری'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'زمانی که پوشه پیوست‌ها خالی می‌شود:'
      },
      name: 'رفتار پوشه خالی پیوست'
    },
    excludePaths: {
      description: {
        part1: 'یادداشت‌های موجود در مسیرهای زیر را از در نظر گیری نادیده بگیرید.',
        part2: 'هر مسیر را در یک خط جدید وارد کنید.',
        part3: 'می‌توانید از رشته مسیر یا',
        part4: 'استفاده کنید. اگر تنظیم خالی باشد، هیچ یادداشتی نادیده گرفته نمی‌شود.'
      },
      name: 'مسیرهای نادیده گرفته شده'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'پیوست‌های موجود در مسیرهای زیر را زمانی که فرمان',
        part2: 'جمع‌آوری پیوست‌ها',
        part3: 'اجرا می‌شود، از در نظر گیری نادیده بگیرید.',
        part4: 'هر مسیر را در یک خط جدید وارد کنید.',
        part5: 'می‌توانید از رشته مسیر یا',
        part6: 'استفاده کنید. اگر تنظیم خالی باشد، هیچ مسیری از جمع‌آوری پیوست نادیده گرفته نمی‌شود.'
      },
      name: 'مسیرهای نادیده گرفته شده از جمع‌آوری پیوست'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'نشان‌های موجود',
        part2: 'را ببینید'
      },
      name: 'نام فایل پیوست تولید شده'
    },
    includePaths: {
      description: {
        part1: 'یادداشت‌های موجود در مسیرهای زیر را در نظر بگیرید.',
        part2: 'هر مسیر را در یک خط جدید وارد کنید.',
        part3: 'می‌توانید از رشته مسیر یا',
        part4: 'استفاده کنید. اگر تنظیم خالی باشد، همه یادداشت‌ها در نظر گرفته می‌شوند.'
      },
      name: 'مسیرهای در نظر گرفته شده'
    },
    jpegQuality: {
      description: 'هر چه کیفیت کمتر باشد، نسبت فشرده‌سازی بیشتر است.',
      name: 'کیفیت JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'با',
        part2: 'شروع کنید تا از مسیر نسبی استفاده کنید.',
        part3: 'نشان‌های موجود',
        part4: 'را ببینید',
        part5: 'پوشه‌های نقطه‌ای مانند',
        part6: 'توصیه نمی‌شوند، زیرا Obsidian آن‌ها را ردیابی نمی‌کند. ممکن است نیاز به استفاده از',
        part7: 'پلاگین برای مدیریت آن‌ها داشته باشید.'
      },
      name: 'مکان پیوست‌های جدید'
    },
    markdownUrlFormat: {
      description: {
        part1: 'فرمت URL که در Markdown وارد خواهد شد.',
        part2: 'نشان‌های موجود',
        part3: 'را ببینید',
        part4: 'برای استفاده از فرمت پیش‌فرض خالی بگذارید.'
      },
      name: 'فرمت URL Markdown'
    },
    renameAttachmentsToLowerCase: 'تغییر نام پیوست‌ها به حروف کوچک',
    renamedAttachmentFileName: {
      description: {
        part1: 'نشان‌های موجود',
        part2: 'را ببینید',
        part3: 'برای استفاده از',
        part4: 'تنظیمات خالی بگذارید.'
      },
      name: 'نام فایل پیوست تغییر نام یافته'
    },
    resetToSampleCustomTokens: {
      message: 'آیا مطمئن هستید که می‌خواهید نشان‌های سفارشی را به نشان‌های سفارشی نمونع بازنشانی کنید؟ تغییرات شما از دست خواهد رفت.',
      title: 'بازنشانی به نشان‌های سفارشی نمونه'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'آیا تصاویر قرارداده شده به JPEG تبدیل شوند. فقط زمانی اعمال می‌شود که محتوای تصویر PNG مستقیماً از کلیپ‌بورد قرارداده شود. معمولاً برای قراردادن عکس‌های صفحه.',
      name: 'آیا تصاویر قرارداده شده به JPEG تبدیل شوند'
    },
    shouldDeleteOrphanAttachments: {
      description: 'اگر فعال باشد، زمانی که یادداشت حذف می‌شود، پیوست‌های یتیم آن نیز حذف می‌شوند.',
      name: 'آیا پیوست‌های یتیم حذف شوند'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'اگر فعال باشد، زمانی که یادداشت تغییر نام یا انتقال پیدا می‌کند، فایل‌های پیوست بر اساس',
        part2: 'تنظیمات تغییر نام خواهند یافت.'
      },
      name: 'آیا فایل‌های پیوست تغییر نام پیدا کنند'
    },
    shouldRenameAttachmentFolders: {
      description: 'آیا زمانی که یادداشت تغییر نام یا انتقال پیدا می‌کند، پوشه‌های پیوست نیز تغییر نام پیدا کنند.',
      name: 'آیا پوشه‌های پیوست تغییر نام پیدا کنند'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'اگر فعال باشد، پیوست‌های پردازش شده از طریق',
        part2: 'جمع‌آوری پیوست‌ها',
        part3: 'فرمان‌ها بر اساس تنظیم',
        part4: 'تغییر نام خواهند یافت.'
      },
      name: 'آیا پیوست‌های جمع‌آوری شده تغییر نام پیدا کنند'
    },
    specialCharacters: {
      description: {
        part1: 'کراکترهای ویژه در پوشه پیوست و نام فایل که باید جایگزین یا حذف شوند.',
        part2: 'برای حفظ کراکترهای ویژه خالی بگذارید.'
      },
      name: 'کراکترهای ویژه'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'رشته جایگزین برای کراکترهای ویژه در پوشه پیوست و نام فایل.',
        part2: 'برای حذف کراکترهای ویژه خالی بگذارید.'
      },
      name: 'جایگزین کراکترهای ویژه'
    },
    timeoutInSeconds: {
      description: {
        part1: 'زمان انقضا به ثانیه برای همه عملیات.',
        part2: 'اگر',
        part3: 'تنظیم شود، زمان انقضا اجرای عملیات غیرفعال می‌شود.'
      },
      name: 'زمان انقضا به ثانیه'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'فایل‌های با این پسوندها را به عنوان پیوست در نظر بگیرید.',
        part2: 'به طور پیش‌فرض',
        part3: 'و',
        part4: 'فایل‌های لینک شده به عنوان پیوست در نظر گرفته نمی‌شوند و با یادداشت انتقال پیدا نمی‌کنند.',
        part5: 'می‌توانید پسوندهای سفارشی اضافه کنید، مثلاً',
        part6: '، تا این رفتار را بازنویسی کنید.'
      },
      name: 'پسونده‌های در نظر گرفته شده به عنوان پیوست'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'پیش‌نمایش فایل پیوست \'{{fullFileName}}\''
    },
    title: 'مقداری برای نشان درخواست ارائه دهید'
  },
  regularExpression: '/عبارت قانونی/'
};
