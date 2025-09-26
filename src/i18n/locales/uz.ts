import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const uz: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Papkadagi barcha eslatmalar uchun qo\'shimchalarni yig\'moqchimisiz:',
      part2: 'va uning barcha quyi papkalari?',
      part3: 'Bu amalni bekor qilib bo\'lmaydi.'
    },
    progressBar: {
      message: 'Qo\'shimchalarni yig\'layapman {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Qo\'shimchalarni yig\'layapman...'
    }
  },
  buttons: {
    copy: 'Nusxalash',
    move: 'Ko\'chirish',
    previewAttachmentFile: 'Qo\'shimcha faylni oldindan ko\'rish',
    skip: 'O\'tkazib yuborish'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Qo\'shimcha',
      part2: 'bir nechta eslatmalar tomonidan havola qilingan.'
    },
    heading: 'Bir nechta eslatmalar tomonidan ishlatiladigan qo\'shimchani yig\'moqdaman',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Boshqa muammoli qo\'shimchalar uchun bir xil harakatni ishlatish kerak'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Joriy papkadagi qo\'shimchalarni yig\'lash',
    collectAttachmentsCurrentNote: 'Joriy eslatmadagi qo\'shimchalarni yig\'lash',
    collectAttachmentsEntireVault: 'Butun ombordagi qo\'shimchalarni yig\'lash'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Papkadagi qo\'shimchalarni yig\'lash'
  },
  notice: {
    collectingAttachments: '\'{{noteFilePath}}\' uchun qo\'shimchalarni yig\'layapman',
    collectingAttachmentsCancelled: 'Qo\'shimchalarni yig\'lash bekor qilindi. Tafsilotlar uchun konsolni ko\'ring.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Yaratilgan qo\'shimcha fayl nomi \'{{path}}\' noto\'g\'ri.\n{{validationMessage}}\nSozlamangizni tekshiring',
      part2: ''
    },
    notePathIsIgnored: 'Eslatma yo\'li e\'tiborga olinmaydi'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Bekor qilish',
      ok: 'OK'
    },
    dataview: {
      itemsPerPage: 'Sahifaga elementlar:',
      jumpToPage: 'Sahifaga o\'tish:'
    },
    notices: {
      attachmentIsStillUsed: 'Qo\'shimcha {{attachmentPath}} hali ham boshqa eslatmalar tomonidan ishlatilmoqda. U o\'chirilmaydi.',
      unhandledError: 'Qayta ishlanmagan xatolik yuz berdi. Iltimos, qo\'shimcha ma\'lumot uchun konsolni tekshiring.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'Barcha fayllar qayta nomlanadi.',
        displayText: 'Barchasi'
      },
      none: {
        description: 'Ularning nomlari saqlanadi.',
        displayText: 'Hech biri'
      },
      onlyPastedImages: {
        description:
          'Faqat yopishtirilgan rasmlar qayta nomlanadi. Faqqt PNG rasm kontenti bevosita buferdan yopishtirilganida amal qiladi. Odatda skrinshotlar uchun.',
        displayText: 'Faqat yopishtirilgan rasmlar'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'Qo\'shimchalarni yig\'lashni bekor qilish.',
        displayText: 'Bekor qilish'
      },
      copy: {
        description: 'Qo\'shimchani yangi joyga nusxalash.',
        displayText: 'Nusxalash'
      },
      move: {
        description: 'Qo\'shimchani yangi joyga ko\'chirish.',
        displayText: 'Ko\'chirish'
      },
      prompt: {
        description: 'Foydalanuvchidan amal tanlashni so\'rash.',
        displayText: 'So\'rash'
      },
      skip: {
        description: 'Qo\'shimchani o\'tkazib yuborish va keyingisiga o\'tish.',
        displayText: 'O\'tkazib yuborish'
      }
    },
    defaultImageSizeDimension: {
      height: 'Balandlik',
      width: 'Kenglik'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'Bo\'sh qo\'shimcha papkasini o\'chiradi.',
        displayText: 'O\'chirish'
      },
      deleteWithEmptyParents: {
        description: 'Bo\'sh qo\'shimcha papkasini va uning bo\'sh ota-onalarini o\'chiradi.',
        displayText: 'Bo\'sh ota-onalar bilan o\'chirish'
      },
      keep: {
        description: 'Bo\'sh qo\'shimcha papkasini saqlaydi.',
        displayText: 'Saqlash'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Maxsus tokenlar komment qilindi, chunki ular 9.0.0 versiyasidagi yangi format bo\'yicha yangilanishi kerak.\n// Qo\'shimcha ma\'lumot uchun hujjatlarga murojaat qiling.',
      deprecated: {
        part1: '9.0.0 versiyasida maxsus tokenlar ro\'yxatga olish formati o\'zgardi. Iltimos, tokenlaringizni yangilang. Batafsil ma\'lumot uchun',
        part2: 'hujjatga murojaat qiling',
        part3: ''
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: '9.0.0 versiyasida bu',
      part2: 'sozlama eskirgan. Buning o\'rniga',
      part3: 'formatidan foydalaning. Batafsil uchun',
      part4: 'hujjatlarga qarang',
      part5: ''
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Potentsial noto\'g\'ri qiymat o\'rnatilgan',
        part2: 'format uchun. Iltimos, qarang',
        part3: 'hujjatlar',
        part4: 'batafsil ma\'lumot uchun.',
        part5: 'Ushbu xabar yana ko\'rsatilmaydi.'
      }
    },
    specialCharacters: {
      part1: '9.16.0 versiyada',
      part2: 'sozlamaning standart qiymati o\'zgardi. Sizning sozlamangiz yangi standart qiymatga yangilandi.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'Standart rasm o‘lchami piksel yoki foizda bo‘lishi kerak',
      invalidCustomTokensCode: 'Noto\'g\'ri maxsus token kodi',
      invalidRegularExpression: 'Noto\'g\'ri tartibiy ifoda {{regExp}}',
      specialCharactersMustNotContainSlash: 'Maxsus belgilar / ni o\'z ichiga olmang',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'Maxsus belgi o\'rnini bosuvchi fayl nomi yoki yo\'l belgilari bo\'lmasligi kerak.'
    },
    version: {
      part1: 'Sozlamalar faylingiz',
      part2: 'versiyasi mavjud',
      part3: 'va u mavjud plagin versiyasidan yangi.',
      part4: 'Plagin kutilganidek ishlamasligi mumkin. Iltimos, plagin so\'nggi versiyasiga yangilang yoki sozlamalarni tekshiring.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Fayllar qo\'shilganda:'
      },
      name: 'Qo\'shimchalarni qayta nomlash rejimi'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Yig\'ilgan qo\'shimcha bir nechta eslatmalarda ishlatilganda:'
      },
      name: 'Bir nechta eslatmalar tomonidan foydalanilgan qo\'shimchani yig\'ish rejimi'
    },
    customTokens: {
      description: {
        part1: 'Foydalaniladigan maxsus tokenlar.',
        part2: 'Qo\'shimcha ma\'lumot uchun qarang',
        part3: 'hujjatlar',
        part4: '',
        part5:
          '⚠️ Maxsus tokenlar istalgan JavaScript kodi bo\'lishi mumkin. Noto\'g\'ri yozilganda ma\'lumot yo\'qolishi mumkin. O\'z xataringizga foydalaning.'
      },
      name: 'Maxsus tokenlar'
    },
    defaultImageSize: {
      description: {
        part1: 'Standart rasm o‘lchami.',
        part2: 'Pikselda ko‘rsatilishi mumkin',
        part3: 'Rasm to‘liq o‘lchamining foizi sifatida',
        part4: 'Asl o‘lchamdan foydalanish uchun bo‘sh qoldiring.'
      },
      name: 'Standart rasm o‘lchami'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Mavjud fayl nomi bilan bir xil bo\'lgan faylni joylashtirganingizda/yurgizganingizda, ushbu ajratgich fayl nomiga qo\'shiladi.',
        part2: 'Masalan, faylni olib tashlayotganingizda:',
        part3: ', u quyidagicha qayta nomlanadi: ',
        part4: 'va boshqalar, birinchi mavjud nom aniqlanguncha.'
      },
      name: 'Nusxa nom ajratgichi'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Qo\'shimchalar papkasi bo\'sh bo\'lganda:'
      },
      name: 'Bo\'sh qo\'shimcha papkasining xatti-harakati'
    },
    excludePaths: {
      description: {
        part1: 'Quyidagi yo\'llardan eslatmalarni chiqarib tashlang.',
        part2: 'Har bir yo\'lni yangi qatorda kiriting.',
        part3: 'Yo\'l satridan yoki',
        part4: 'Agar sozlama bo\'sh bo\'lsa, hech narsa chiqarib tashlanmaydi.'
      },
      name: 'Chiqarib tashlanadigan yo\'llar'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Quyidagi yo\'llardan qo\'shimchalarni chiqarib tashlang, bu buyruq bajarilganda:',
        part2: 'Qo\'shimchalarni yig\'ish',
        part3: '',
        part4: 'Har bir yo\'lni yangi qatorda yozing.',
        part5: 'Yo\'l satridan yoki',
        part6: 'Sozlama bo\'sh bo\'lsa, hech qanday yo\'l chiqarilmaydi.'
      },
      name: 'Qo\'shimcha yig\'ishda chiqarib tashlangan yo\'llar'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Mavjud',
        part2: 'tokenlarni ko\'ring'
      },
      name: 'Yaratilgan qo\'shimcha fayl nomi'
    },
    includePaths: {
      description: {
        part1: 'Quyidagi yo\'llardagi eslatmalarni qo\'shing.',
        part2: 'Har bir yo\'lni yangi qatorda yozing.',
        part3: 'Yo\'l satridan yoki',
        part4: 'Sozlama bo\'sh bo\'lsa, barcha eslatmalar qo\'shiladi.'
      },
      name: 'Qo\'shiladigan yo\'llar'
    },
    jpegQuality: {
      description: 'Sifat qanchalik past bo\'lsa, siqish darajasi shunchalik yuqori bo\'ladi.',
      name: 'JPEG sifati'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Nisbiy yo\'lni ishlatish uchun bilan boshlang',
        part2: '.',
        part3: 'Mavjud',
        part4: 'tokenlarni ko\'ring',
        part5: '. nuqta bilan boshlangan papkalar, masalan',
        part6: ', tavsiya etilmaydi, chunki Obsidian ularni kuzatmaydi. Ularni boshqarish uchun',
        part7: 'kengaytmadan foydalanishingiz kerak bo\'lishi mumkin.'
      },
      name: 'Yangi qo\'shimchalar joylashuvi'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Markdown-ga qo\'shiladigan URL formati.',
        part2: 'Mavjud',
        part3: 'tokenlarni ko\'ring.',
        part4: 'Standart formatni ishlatish uchun bo\'sh qoldiring.'
      },
      name: 'Markdown URL formati'
    },
    renameAttachmentsToLowerCase: 'Qo\'shimchilarning nomlarini kichik harflarga o\'zgartirish',
    resetToSampleCustomTokens: {
      message: 'Maxsus tokenlarni namuna tokenlarga qaytarishni xohlaysizmi? O\'zgartirishlaringiz yo\'qoladi.',
      title: 'Namuna tokenlarga qaytarish'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Yopishtirilgan rasmlarni JPEG formatiga aylantirish-aylantirilmasligini belgilaydi. Bu faqat PNG rasmlar bo\'lsa va to\'g\'ridan-to\'g\'ri panodan yopishtirilganda ishlatiladi. Odatda, skrinshotlar uchun.',
      name: 'Yopishtirilgan rasmlarni JPEG-ga o\'zgartirish'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Faollashtirilganda, nota o\'chirilganda uning osmonga ketgan qo\'shimchalari ham o\'chiriladi.',
      name: 'Osmonga ketgan qo\'shimchalarni o\'chirish'
    },
    shouldRenameAttachmentFiles: {
      description: 'Nota nomi o\'zgartirilganda yoki ko\'chirilganda qo\'shimcha fayllar nomini o\'zgartirish kerakligini belgilaydi.',
      name: 'Qo\'shimcha fayllarni qayta nomlash'
    },
    shouldRenameAttachmentFolders: {
      description: 'Nota nomi o\'zgartirilganda yoki ko\'chirilganda qo\'shimcha papkalarni qayta nomlash kerakligini belgilaydi.',
      name: 'Qo\'shimcha papkalarni qayta nomlash'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Faollashtirilganda, qo\'llanilgan qo\'shimchalar',
        part2: 'Qo\'shimchalarni yig\'ish',
        part3: 'buyruqlari orqali qayta nomlanadi',
        part4: 'belgilanishiga muvofiq.'
      },
      name: 'Yig\'ilgan qo\'shimchalarni qayta nomlash'
    },
    specialCharacters: {
      description: {
        part1: 'Qo\'shimcha papkasi va fayl nomidagi maxsus belgilar almashtirilishi yoki olib tashlanishi kerak.',
        part2: 'Maxsus belgilarni saqlash uchun bo\'sh qoldiring.'
      },
      name: 'Maxsus belgilar'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Qo\'shimcha papka va fayl nomidagi maxsus belgilarni almashtirish uchun qatori.',
        part2: 'Maxsus belgilarni olib tashlash uchun bo\'sh qoldiring.'
      },
      name: 'Maxsus belgilarni almashtirish'
    },
    timeoutInSeconds: {
      description: {
        part1: 'Barcha operatsiyalar uchun vaqt tugashi (soniya).',
        part2: 'Agar',
        part3: 'belgilangan bo\'lsa, bajarilish vaqti cheklovlari o\'chiriladi.'
      },
      name: 'Vaqt tugashi (soniya)'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Ushbu kengaytmaga ega fayllar qo\'shimcha sifatida ko\'rib chiqiladi.',
        part2: 'Standart bo\'yicha',
        part3: 'va',
        part4: 'bog\'langan fayllar qo\'shimcha sifatida ko\'rilmaydi va notalar bilan ko\'chirilmaydi.',
        part5: 'Maxsus kengaytmalarni qo\'shishingiz mumkin, masalan,',
        part6: 'bu xatti-harakatni o\'zgartirish uchun.'
      },
      name: 'Qo\'shimcha kengaytmalari sifatida hisoblash'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Qo\'shimcha faylni oldindan ko\'rish \'{{fullFileName}}\''
    },
    title: 'So\'rov tokeni uchun qiymat kiriting'
  },
  regularExpression: '/muntazam ifoda/'
};
