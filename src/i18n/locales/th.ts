import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const th: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'คุณต้องการรวบรวมไฟล์แนบสำหรับโน้ตทั้งหมดในโฟลเดอร์:',
      part2: 'และโฟลเดอร์ย่อยทั้งหมดหรือไม่?',
      part3: 'การดำเนินการนี้ไม่สามารถย้อนกลับได้'
    },
    progressBar: {
      message: 'กำลังรวบรวมไฟล์แนบ {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'กำลังรวบรวมไฟล์แนบ...'
    }
  },
  buttons: {
    copy: 'คัดลอก',
    move: 'ย้าย',
    previewAttachmentFile: 'ดูตัวอย่างไฟล์แนบ',
    skip: 'ข้าม'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'ไฟล์แนบ',
      part2: 'ถูกอ้างอิงโดยหลายโน้ต'
    },
    heading: 'กำลังรวบรวมไฟล์แนบที่ใช้โดยหลายโน้ต',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'ใช้การดำเนินการเดียวกันสำหรับไฟล์แนบที่มีปัญหาอื่น ๆ'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'รวบรวมไฟล์แนบในโฟลเดอร์ปัจจุบัน',
    collectAttachmentsCurrentNote: 'รวบรวมไฟล์แนบในโน้ตปัจจุบัน',
    collectAttachmentsEntireVault: 'รวบรวมไฟล์แนบในคลังข้อมูลทั้งหมด'
  },
  menuItems: {
    collectAttachmentsInFolder: 'รวบรวมไฟล์แนบในโฟลเดอร์'
  },
  notice: {
    collectingAttachments: 'กำลังรวบรวมไฟล์แนบสำหรับ \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'การรวบรวมไฟล์แนบถูกยกเลิก ดูรายละเอียดในคอนโซล',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'ชื่อไฟล์แนบที่สร้างขึ้น \'{{path}}\' ไม่ถูกต้อง\n{{validationMessage}}\nตรวจสอบ',
      part2: 'การตั้งค่าของคุณ'
    },
    notePathIsIgnored: 'เส้นทางโน้ตถูกข้าม'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'ยกเลิก',
      ok: 'ตกลง'
    },
    dataview: {
      itemsPerPage: 'รายการต่อหน้า:',
      jumpToPage: 'ไปที่หน้า:'
    },
    notices: {
      attachmentIsStillUsed: 'ไฟล์แนบ {{attachmentPath}} ยังคงถูกใช้โดยโน้ตอื่น ๆ จะไม่ถูกลบ',
      unhandledError: 'เกิดข้อผิดพลาดที่ไม่ได้รับการจัดการ กรุณาตรวจสอบคอนโซลสำหรับข้อมูลเพิ่มเติม'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'ไฟล์ทั้งหมดจะถูกเปลี่ยนชื่อ',
        displayText: 'ทั้งหมด'
      },
      none: {
        description: 'เก็บชื่อไฟล์เดิมไว้',
        displayText: 'ไม่มี'
      },
      onlyPastedImages: {
        description: 'เฉพาะภาพที่วางจะถูกเปลี่ยนชื่อ ใช้ได้เฉพาะเมื่อวางไฟล์ PNG จากคลิปบอร์ดโดยตรง โดยทั่วไปใช้สำหรับการวางภาพหน้าจอ',
        displayText: 'เฉพาะภาพที่วาง'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'ยกเลิกการรวบรวมไฟล์แนบ',
        displayText: 'ยกเลิก'
      },
      copy: {
        description: 'คัดลอกไฟล์แนบไปยังตำแหน่งใหม่',
        displayText: 'คัดลอก'
      },
      move: {
        description: 'ย้ายไฟล์แนบไปยังตำแหน่งใหม่',
        displayText: 'ย้าย'
      },
      prompt: {
        description: 'ให้ผู้ใช้เลือกการดำเนินการ',
        displayText: 'ถาม'
      },
      skip: {
        description: 'ข้ามไฟล์แนบและดำเนินการต่อไป',
        displayText: 'ข้าม'
      }
    },
    defaultImageSizeDimension: {
      height: 'ความสูง',
      width: 'ความกว้าง'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'จะลบโฟลเดอร์ไฟล์แนบที่ว่างเปล่า',
        displayText: 'ลบ'
      },
      deleteWithEmptyParents: {
        description: 'จะลบโฟลเดอร์ไฟล์แนบที่ว่างเปล่าและโฟลเดอร์แม่ที่ว่างทั้งหมด',
        displayText: 'ลบพร้อมโฟลเดอร์แม่ที่ว่าง'
      },
      keep: {
        description: 'จะเก็บโฟลเดอร์ไฟล์แนบที่ว่างเปล่าไว้',
        displayText: 'เก็บไว้'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// โทเคนที่กำหนดเองถูกคอมเมนต์ไว้ เนื่องจากต้องอัปเดตเป็นรูปแบบใหม่ที่ถูกเพิ่มในปลั๊กอินเวอร์ชัน 9.0.0\n// ดูรายละเอียดในเอกสารประกอบ (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens)',
      deprecated: {
        part1: 'ในปลั๊กอินเวอร์ชัน 9.0.0 รูปแบบการลงทะเบียนโทเคนที่กำหนดเองได้เปลี่ยนไป กรุณาอัปเดตโทเคนของคุณ ดูเพิ่มเติมที่',
        part2: 'เอกสาร',
        part3: 'สำหรับข้อมูลเพิ่มเติม'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'ในปลั๊กอินเวอร์ชัน 9.0.0',
      part2: 'การตั้งค่านี้เลิกใช้แล้ว กรุณาใช้',
      part3: 'รูปแบบแทน ดูเพิ่มเติมที่',
      part4: 'เอกสาร',
      part5: 'สำหรับข้อมูลเพิ่มเติม'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'คุณอาจตั้งค่าที่ไม่ถูกต้องสำหรับ',
        part2: 'รูปแบบ กรุณาดู',
        part3: 'เอกสาร',
        part4: 'สำหรับข้อมูลเพิ่มเติม',
        part5: 'ข้อความนี้จะไม่แสดงอีก'
      }
    },
    specialCharacters: {
      part1: 'ในปลั๊กอินเวอร์ชัน 9.16.0',
      part2: 'ค่าเริ่มต้นของการตั้งค่านี้ถูกเปลี่ยนไป และค่าของคุณจึงถูกอัปเดตตามค่าใหม่'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'ขนาดภาพเริ่มต้นต้องเป็นพิกเซลหรือเปอร์เซ็นต์',
      invalidCustomTokensCode: 'โค้ดโทเคนที่กำหนดเองไม่ถูกต้อง',
      invalidRegularExpression: 'นิพจน์ปกติไม่ถูกต้อง {{regExp}}',
      specialCharactersMustNotContainSlash: 'อักขระพิเศษต้องไม่มีเครื่องหมาย /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters: 'การแทนที่อักขระพิเศษต้องไม่มีอักขระที่ไม่ถูกต้องสำหรับชื่อไฟล์หรือเส้นทาง'
    },
    version: {
      part1: 'ไฟล์การตั้งค่าของคุณ ',
      part2: 'มีเวอร์ชัน',
      part3: 'ซึ่งใหม่กว่าส่วนขยายปัจจุบัน',
      part4: 'ปลั๊กอินอาจไม่ทำงานตามที่คาดไว้ กรุณาอัปเดตปลั๊กอินเป็นเวอร์ชันล่าสุด หรือยืนยันว่าการตั้งค่าถูกต้อง'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'เมื่อแนบไฟล์:'
      },
      name: 'โหมดเปลี่ยนชื่อไฟล์แนบ'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'เมื่อไฟล์แนบที่รวบรวมถูกใช้โดยหลายโน้ต:'
      },
      name: 'โหมดรวบรวมไฟล์แนบที่ใช้หลายโน้ต'
    },
    customTokens: {
      description: {
        part1: 'โทเคนที่กำหนดเองที่ใช้',
        part2: 'ดู',
        part3: 'เอกสาร',
        part4: 'สำหรับข้อมูลเพิ่มเติม',
        part5: '⚠️ โทเคนที่กำหนดเองสามารถเป็นโค้ด JavaScript ใดก็ได้ ถ้าเขียนผิด อาจทำให้ข้อมูลสูญหาย ใช้ด้วยความระมัดระวัง'
      },
      name: 'โทเคนที่กำหนดเอง'
    },
    defaultImageSize: {
      description: {
        part1: 'ขนาดภาพเริ่มต้น',
        part2: 'สามารถกำหนดเป็นพิกเซลได้',
        part3: 'หรือตามเปอร์เซ็นต์ของขนาดภาพเต็ม',
        part4: 'ปล่อยว่างเพื่อใช้ขนาดภาพต้นฉบับ'
      },
      name: 'ขนาดภาพเริ่มต้น'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'เมื่อคุณวาง/ลากไฟล์ที่มีชื่อเหมือนไฟล์ที่มีอยู่ ตัวคั่นนี้จะถูกเพิ่มไปที่ชื่อไฟล์',
        part2: 'เช่น เมื่อคุณลากไฟล์',
        part3: ', จะถูกเปลี่ยนชื่อเป็น ',
        part4: 'เป็นต้น ไปจนกว่าจะพบชื่อที่ใช้ได้'
      },
      name: 'ตัวคั่นสำหรับชื่อซ้ำ'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'เมื่อโฟลเดอร์ไฟล์แนบว่างเปล่า:'
      },
      name: 'พฤติกรรมของโฟลเดอร์ไฟล์แนบที่ว่างเปล่า'
    },
    excludePaths: {
      description: {
        part1: 'ยกเว้นโน้ตจากเส้นทางต่อไปนี้',
        part2: 'ใส่แต่ละเส้นทางในบรรทัดใหม่',
        part3: 'คุณสามารถใช้สตริงเส้นทางหรือ',
        part4: 'หากเว้นว่างไว้ จะไม่มีโน้ตใดถูกยกเว้น'
      },
      name: 'ยกเว้นเส้นทาง'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'ยกเว้นไฟล์แนบจากเส้นทางต่อไปนี้เมื่อเรียกใช้คำสั่ง',
        part2: 'รวบรวมไฟล์แนบ',
        part3: '',
        part4: 'ใส่แต่ละเส้นทางในบรรทัดใหม่',
        part5: 'คุณสามารถใช้สตริงเส้นทางหรือ',
        part6: 'หากเว้นว่าง จะไม่มีเส้นทางใดถูกยกเว้น'
      },
      name: 'ยกเว้นเส้นทางจากการรวบรวมไฟล์แนบ'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'ดู',
        part2: 'โทเคนที่มีให้'
      },
      name: 'ชื่อไฟล์แนบที่สร้างขึ้น'
    },
    includePaths: {
      description: {
        part1: 'รวมโน้ตจากเส้นทางต่อไปนี้',
        part2: 'ใส่แต่ละเส้นทางในบรรทัดใหม่',
        part3: 'คุณสามารถใช้สตริงเส้นทางหรือ',
        part4: 'หากเว้นว่างไว้ โน้ตทั้งหมดจะถูกรวม'
      },
      name: 'รวมเส้นทาง'
    },
    jpegQuality: {
      description: 'คุณภาพยิ่งต่ำ อัตราส่วนการบีบอัดจะยิ่งสูง',
      name: 'คุณภาพ JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'เริ่มต้นด้วย',
        part2: 'เพื่อใช้เส้นทางสัมพัทธ์',
        part3: 'ดู',
        part4: 'โทเคนที่มีให้',
        part5: 'โฟลเดอร์ที่ขึ้นต้นด้วยจุด เช่น',
        part6: 'ไม่แนะนำ เพราะ Obsidian จะไม่ติดตาม คุณอาจต้องใช้',
        part7: 'ปลั๊กอินเพื่อจัดการ'
      },
      name: 'ตำแหน่งไฟล์แนบใหม่'
    },
    markdownUrlFormat: {
      description: {
        part1: 'รูปแบบของ URL ที่จะแทรกลงใน Markdown',
        part2: 'ดู',
        part3: 'โทเคนที่มีให้',
        part4: 'เว้นว่างเพื่อใช้ค่าเริ่มต้น'
      },
      name: 'รูปแบบ URL ของ Markdown'
    },
    renameAttachmentsToLowerCase: 'เปลี่ยนชื่อไฟล์แนบเป็นตัวพิมพ์เล็ก',
    resetToSampleCustomTokens: {
      message: 'แน่ใจหรือไม่ว่าต้องการรีเซ็ตโทเคนที่กำหนดเองไปยังโทเคนตัวอย่าง? การเปลี่ยนแปลงทั้งหมดจะสูญหาย',
      title: 'รีเซ็ตเป็นโทเคนตัวอย่าง'
    },
    shouldConvertPastedImagesToJpeg: {
      description: 'กำหนดว่าจะเปลี่ยนรูปภาพที่วางเป็น JPEG หรือไม่ ใช้ได้กับ PNG ที่วางจากคลิปบอร์ดโดยตรง เหมาะสำหรับภาพหน้าจอ',
      name: 'แปลงรูปภาพที่วางเป็น JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'หากเปิดใช้งาน เมื่อโน้ตถูกลบ ไฟล์แนบที่เหลืออยู่จะถูกลบด้วย',
      name: 'ลบไฟล์แนบที่ถูกทิ้ง'
    },
    shouldRenameAttachmentFiles: {
      description: 'กำหนดว่าจะเปลี่ยนชื่อไฟล์แนบเมื่อโน้ตถูกเปลี่ยนชื่อหรือย้ายหรือไม่',
      name: 'เปลี่ยนชื่อไฟล์แนบ'
    },
    shouldRenameAttachmentFolders: {
      description: 'กำหนดว่าจะเปลี่ยนชื่อโฟลเดอร์ไฟล์แนบเมื่อโน้ตถูกเปลี่ยนชื่อหรือย้ายหรือไม่',
      name: 'เปลี่ยนชื่อโฟลเดอร์ไฟล์แนบ'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'หากเปิดใช้งาน ไฟล์แนบที่ประมวลผลผ่านคำสั่ง',
        part2: 'รวบรวมไฟล์แนบ',
        part3: 'จะถูกเปลี่ยนชื่อตาม',
        part4: 'การตั้งค่า'
      },
      name: 'เปลี่ยนชื่อไฟล์แนบที่รวบรวมมา'
    },
    specialCharacters: {
      description: {
        part1: 'อักขระพิเศษในชื่อโฟลเดอร์และไฟล์แนบที่จะถูกแทนที่หรือเอาออก',
        part2: 'เว้นว่างไว้เพื่อเก็บอักขระพิเศษ'
      },
      name: 'อักขระพิเศษ'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'สตริงสำหรับแทนที่อักขระพิเศษในโฟลเดอร์หรือไฟล์แนบ',
        part2: 'เว้นว่างไว้เพื่อลบอักขระพิเศษ'
      },
      name: 'ค่าที่แทนอักขระพิเศษ'
    },
    timeoutInSeconds: {
      description: {
        part1: 'เวลาจำกัด (วินาที) สำหรับทุกการดำเนินการ',
        part2: 'หาก',
        part3: 'ถูกกำหนด เวลาจำกัดจะถูกปิดใช้งาน'
      },
      name: 'เวลาจำกัดเป็นวินาที'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'พิจารณาไฟล์ที่มีส่วนขยายเหล่านี้เป็นไฟล์แนบ',
        part2: 'ตามค่าเริ่มต้น',
        part3: 'และ',
        part4: 'ไฟล์เชื่อมโยงจะไม่ถูกพิจารณาเป็นไฟล์แนบและจะไม่ย้ายไปกับโน้ต',
        part5: 'คุณสามารถเพิ่มส่วนขยายเอง เช่น',
        part6: ', เพื่อแทนที่พฤติกรรมนี้'
      },
      name: 'พิจารณาส่วนขยายของไฟล์แนบ'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'ดูตัวอย่างไฟล์แนบ \'{{fullFileName}}\''
    },
    title: 'กรุณาใส่ค่าของโทเคนที่ร้องขอ'
  },
  regularExpression: '/นิพจน์ปกติ/'
};
