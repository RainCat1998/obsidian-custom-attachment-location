import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const he: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'האם ברצונך לאסוף קבצים מצורפים לכל ההערות בתיקיות באופן רקורסיבי?',
      part2: 'לא ניתן לבטל פעולה זו.'
    },
    progressBar: {
      message: 'אוסף קבצים מצורפים {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'אוסף קבצים מצורפים...'
    }
  },
  buttons: {
    copy: 'העתק',
    move: 'העבר',
    previewAttachmentFile: 'תצוגה מקדימה של קובץ מצורף',
    skip: 'דלג'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'קובץ מצורף',
      part2: 'משומש על ידי מספר רשימות.'
    },
    heading: 'איסוף קובץ מצורף המשומש על ידי מספר רשימות',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'יש להשתמש באותה פעולה עבור קבצים מצורפים בעייתיים אחרים'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'אסוף קבצים מצורפים בתיקייה הנוכחית',
    collectAttachmentsCurrentNote: 'אסוף קבצים מצורפים ברשימה הנוכחית',
    collectAttachmentsEntireVault: 'אסוף קבצים מצורפים בכל הכספת'
  },
  menuItems: {
    collectAttachmentsInFile: 'איסוף קבצים מצורפים בקובץ',
    collectAttachmentsInFiles: 'איסוף קבצים מצורפים בקבצים'
  },
  notice: {
    collectingAttachments: 'אוסף קבצים מצורפים עבור \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'איסוף קבצים מצורפים בוטל. ראה קונסול לפרטים.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'שם קובץ מצורף שנוצר \'{{path}}\' אינו תקף.\n{{validationMessage}}\nבדוק את',
      part2: 'ההגדרה שלך.'
    },
    notePathIsIgnored: 'נתיב רשימה מתעלם'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'ביטול',
      ok: 'אישור'
    },
    dataview: {
      itemsPerPage: 'פריטים לעמוד:',
      jumpToPage: 'קפוץ לעמוד:'
    },
    notices: {
      attachmentIsStillUsed: 'קבץ מצורף {{attachmentPath}} עדיין משומש על ידי רשימות אחרות. הוא לא ימחק.',
      unhandledError: 'אירעה שגיאה לא מטופלת. אנא בדוק את הקונסול למידע נוסף.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'כל הקבצים יקבלו שמות חדשים.',
        displayText: 'הכל'
      },
      none: {
        description: 'השמות שלהם נשמרים.',
        displayText: 'כלום'
      },
      onlyPastedImages: {
        description: 'רק תמונות שהודבקו יקבלו שמות חדשים. חל רק כאשר תוכן תמונת PNG מודבק ישירות מהלוח. בדרך כלל, להדבקת צילומי מסך.',
        displayText: 'רק תמונות שהודבקו'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'בטל את איסוף הקבצים המצורפים.',
        displayText: 'ביטול'
      },
      copy: {
        description: 'העתק את הקובץ המצורף למיקום החדש.',
        displayText: 'העתקה'
      },
      move: {
        description: 'העבר את הקובץ המצורף למיקום החדש.',
        displayText: 'העברה'
      },
      prompt: {
        description: 'הנחה את המשתמש לבחור את הפעולה.',
        displayText: 'הנחיה'
      },
      skip: {
        description: 'דלג על הקובץ המצורף והמשך לבא.',
        displayText: 'דילוג'
      }
    },
    defaultImageSizeDimension: {
      height: 'גובה',
      width: 'רוחב'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'ימחק את תיקיית הקבצים המצורפים הריקה.',
        displayText: 'מחיקה'
      },
      deleteWithEmptyParents: {
        description: 'ימחק את תיקיית הקבצים המצורפים הריקה ואת תיקיות האב הריקות שלה.',
        displayText: 'מחיקה עם אבות ריקים'
      },
      keep: {
        description: 'ישמור את תיקיית הקבצים המצורפים הריקה.',
        displayText: 'שמירה'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// טוקנים מותאמים אישיים הועברו להערה מכיוון שהם צריכים להיות מעודכנים לפורמט החדש שהוצג בגרסת תוסף 9.0.0.\n// פנה לתיעוד (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) למידע נוסף.',
      deprecated: {
        part1: 'בגרסת תוסף 9.0.0, הפורמט של רישום טוקנים מותאמים אישיים השתנה. אנא עדכן את הטוקנים שלך בהתאם. פנה ל',
        part2: 'תיעוד',
        part3: 'למידע נוסף'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'בגרסת תוסף 9.0.0, ההגדרה',
      part2: 'היא מיושנת. השתמש ב',
      part3: 'פורמט במקום. ראה',
      part4: 'תיעוד',
      part5: 'למידע נוסף'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'יש לך ערך פוטנציאלית שגוי עבור',
        part2: 'הפורמט. אנא פנה ל',
        part3: 'תיעוד',
        part4: 'למידע נוסף',
        part5: 'הודעה זו לא תוצג שוב.'
      }
    },
    specialCharacters: {
      part1: 'בגרסת תוסף 9.16.0, ערך',
      part2: 'ההגדרה ברירת המחדל השתנה. ערך ההגדרה שלך עודכן לערך ברירת המחדל החדש.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'גודל התמונה ברירת המחדל חייב להיות בפיקסלים או באחוזים',
      invalidCustomTokensCode: 'קוד טוקנים מותאמים אישיים לא תקף',
      invalidRegularExpression: 'ביטוי רגולרי לא תקף {{regExp}}',
      specialCharactersMustNotContainSlash: 'תווים מיוחדים לא יכולים להכיל /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters: 'החלפת תווים מיוחדים לא יכולה להכיל תווים לא תקפים של נתיב שם קובץ.'
    },
    version: {
      part1: 'קובץ ההגדרות שלך ',
      part2: 'יש גרסה',
      part3: 'שהיא חדשה יותר מגרסת התוסף הנוכחית',
      part4: 'התוסף עלול לא לעבוד כצפוי. אנא עדכן את התוסף לגרסה האחרונה או וודא שההגדרות נכונות.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'כאשר מצרפים קבצים:'
      },
      name: 'מצב שינוי שם קבצים מצורפים'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'כאשר הקובץ המצורף שנאסף משמש מספר רשימות:'
      },
      name: 'מצב איסוף קובץ מצורף המשמש מספר רשימות'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'ראה',
        part2: 'טוקנים זמינים',
        part3: 'השאר ריק לשימוש בהגדרת',
        part4: 'במקום.'
      },
      name: 'שם קובץ מצורף שנאסף'
    },
    customTokens: {
      description: {
        part1: 'טוקנים מותאמים אישיים לשימוש.',
        part2: 'ראה',
        part3: 'תיעוד',
        part4: 'למידע נוסף.',
        part5: '⚠️ טוקנים מותאמים אישיים יכולים להיות קוד JavaScript שרירותי. אם הם כתובים בצורה גרועה, הם עלולים לגרום לאובדן נתונים. השתמש בהם על אחריותך.'
      },
      name: 'טוקנים מותאמים אישיים'
    },
    defaultImageSize: {
      description: {
        part1: 'גודל התמונה ברירת המחדל.',
        part2: 'ניתן לציין בפיקסלים',
        part3: 'או באחוז מגודל התמונה המלא',
        part4: 'השאר ריק כדי להשתמש בגודל המקורי.'
      },
      name: 'גודל התמונה ברירת המחדל'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'כאשר אתה מדביק/גורר קובץ עם אותו שם כמו קובץ קיים, המפריד הזה יתווסף לשם הקובץ.',
        part2: 'לדוגמה, כאשר אתה גורר קובץ',
        part3: ', הוא יקבל שם חדש ל',
        part4: ', וכו, לקבלת השם הראשון הזמין.'
      },
      name: 'מפריד שמות כפולים'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'כאשר תיקיית הקבצים המצורפים הופכת ריקה:'
      },
      name: 'התנהגות תיקיית קבצים מצורפים ריקה'
    },
    excludePaths: {
      description: {
        part1: 'הדר רשימות מהנתיבים הבאים.',
        part2: 'הכנס כל נתיב בשורה חדשה.',
        part3: 'אתה יכול להשתמש במחרוזת נתיב או',
        part4: 'אם ההגדרה ריקה, אף רשימה לא מודרת.'
      },
      name: 'הדר נתיבים'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'הדר קבצים מצורפים מהנתיבים הבאים כאשר',
        part2: 'אסוף קבצים מצורפים',
        part3: 'הפקודה מבוצעת.',
        part4: 'הכנס כל נתיב בשורה חדשה.',
        part5: 'אתה יכול להשתמש במחרוזת נתיב או',
        part6: 'אם ההגדרה ריקה, אף נתיב לא מודר מאיסוף קבצים מצורפים.'
      },
      name: 'הדר נתיבים מאיסוף קבצים מצורפים'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'ראה',
        part2: 'טוקנים זמינים'
      },
      name: 'שם קובץ מצורף שנוצר'
    },
    includePaths: {
      description: {
        part1: 'כלול רשימות מהנתיבים הבאים.',
        part2: 'הכנס כל נתיב בשורה חדשה.',
        part3: 'אתה יכול להשתמש במחרוזת נתיב או',
        part4: 'אם ההגדרה ריקה, כל הרשימות כלולות.'
      },
      name: 'כלול נתיבים'
    },
    jpegQuality: {
      description: 'ככל שהאיכות קטנה יותר, יחס הדחיסה גדול יותר.',
      name: 'איכות JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'התחל עם',
        part2: 'לשימוש בנתיב יחסי.',
        part3: 'ראה',
        part4: 'טוקנים זמינים',
        part5: 'תיקיות נקודה כמו',
        part6: 'לא מומלצות, כי Obsidian לא עוקב אחריהן. ייתכן שתצטרך להשתמש ב',
        part7: 'תוסף לניהול אותן.'
      },
      name: 'מיקום לקבצים מצורפים חדשים'
    },
    markdownUrlFormat: {
      description: {
        part1: 'פורמט עבור ה-URL שיוכנס ל-Markdown.',
        part2: 'ראה',
        part3: 'טוקנים זמינים',
        part4: 'השאר ריק לשימוש בפורמט ברירת המחדל.'
      },
      name: 'פורמט URL Markdown'
    },
    renameAttachmentsToLowerCase: 'שנה שמות קבצים מצורפים לאותיות קטנות',
    renamedAttachmentFileName: {
      description: {
        part1: 'ראה',
        part2: 'טוקנים זמינים',
        part3: 'השאר ריק לשימוש בהגדרת',
        part4: 'במקום.'
      },
      name: 'שם קובץ מצורף ששמו שונה'
    },
    resetToSampleCustomTokens: {
      message: 'האם אתה בטוח שברצונך לאפס את הטוקנים המותאמים אישיים לטוקנים המותאמים אישיים לדוגמה? השינויים שלך יאבדו.',
      title: 'אפס לטוקנים מותאמים אישיים לדוגמה'
    },
    shouldConvertPastedImagesToJpeg: {
      description: 'האם להמיר תמונות שהודבקו ל-JPEG. חל רק כאשר תוכן תמונת PNG מודבק ישירות מהלוח. בדרך כלל, להדבקת צילומי מסך.',
      name: 'האם להמיר תמונות שהודבקו ל-JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'אם מופעל, כאשר הרשימה נמחקת, הקבצים המצורפים היתומים שלה נמחקים גם כן.',
      name: 'האם למחוק קבצים מצורפים יתומים'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'אם מופעל, כאשר רשימה מקבלת שם חדש או מועברת, קבצי המצורפים שלה יקבלו שמות חדשים לפי הגדרת',
        part2: '.'
      },
      name: 'האם לשנות שמות קבצים מצורפים'
    },
    shouldRenameAttachmentFolders: {
      description: 'האם לשנות שמות תיקיות קבצים מצורפים כאשר רשימה מקבלת שם חדש או מועברת.',
      name: 'האם לשנות שמות תיקיות קבצים מצורפים'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'אם מופעל, קבצים מצורפים המעובדים דרך',
        part2: 'אסוף קבצים מצורפים',
        part3: 'פקודות יקבלו שמות חדשים לפי',
        part4: 'ההגדרה.'
      },
      name: 'האם לשנות שמות קבצים מצורפים שנאספו'
    },
    specialCharacters: {
      description: {
        part1: 'תווים מיוחדים בתיקיית קבצים מצורפים ושם קובץ להחלפה או הסרה.',
        part2: 'השאר ריק לשימור תווים מיוחדים.'
      },
      name: 'תווים מיוחדים'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'מחרוזת החלפה עבור תווים מיוחדים בתיקיית קבצים מצורפים ושם קובץ.',
        part2: 'השאר ריק להסרת תווים מיוחדים.'
      },
      name: 'החלפת תווים מיוחדים'
    },
    timeoutInSeconds: {
      description: {
        part1: 'הזמן הקצוב בשניות עבור כל הפעולות.',
        part2: 'אם',
        part3: 'מוגדר, זמן הקצוב לביצוע פעולות מבוטל.'
      },
      name: 'זמן קצוב בשניות'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'התייחס לקבצים עם הסיומות האלה כקבצים מצורפים.',
        part2: 'ברירת מחדל',
        part3: 'ו',
        part4: 'קבצים מקושרים לא מטופלים כקבצים מצורפים ולא מועברים עם הרשימה.',
        part5: 'אתה יכול להוסיף סיומות מותאמות אישית, למשל',
        part6: ', כדי לעקוף התנהגות זו.'
      },
      name: 'התייחס כסיומות קבצים מצורפים'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'תצוגה מקדימה של קובץ מצורף \'{{fullFileName}}\''
    },
    title: 'ספק ערך עבור טוקן ההנחיה'
  },
  regularExpression: '/ביטוי רגולרי/'
};
