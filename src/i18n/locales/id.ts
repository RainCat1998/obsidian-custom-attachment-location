import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const id: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Apakah Anda ingin mengumpulkan lampiran untuk semua catatan di folder:',
      part2: 'dan semua subfoldernya?',
      part3: 'Operasi ini tidak dapat dibatalkan.'
    },
    progressBar: {
      message: 'Mengumpulkan lampiran {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Mengumpulkan lampiran...'
    }
  },
  buttons: {
    copy: 'Salin',
    move: 'Pindah',
    previewAttachmentFile: 'Pratinjau file lampiran',
    skip: 'Lewati'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Lampiran',
      part2: 'dirujuk oleh beberapa catatan.'
    },
    heading: 'Mengumpulkan lampiran yang digunakan oleh beberapa catatan',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Harus menggunakan tindakan yang sama untuk lampiran bermasalah lainnya'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Kumpulkan lampiran di folder saat ini',
    collectAttachmentsCurrentNote: 'Kumpulkan lampiran di catatan saat ini',
    collectAttachmentsEntireVault: 'Kumpulkan lampiran di seluruh vault'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Kumpulkan lampiran di folder'
  },
  notice: {
    collectingAttachments: 'Mengumpulkan lampiran untuk \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Pengumpulan lampiran dibatalkan. Lihat konsol untuk detail.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Nama file lampiran yang dihasilkan \'{{path}}\' tidak valid.\n{{validationMessage}}\nPeriksa',
      part2: 'pengaturan Anda.'
    },
    notePathIsIgnored: 'Jalur catatan diabaikan'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Batal',
      ok: 'OK'
    },
    dataview: {
      itemsPerPage: 'Item per halaman:',
      jumpToPage: 'Lompat ke halaman:'
    },
    notices: {
      attachmentIsStillUsed: 'Lampiran {{attachmentPath}} masih digunakan oleh catatan lain. Tidak akan dihapus.',
      unhandledError: 'Terjadi kesalahan yang tidak tertangani. Silakan periksa konsol untuk informasi lebih lanjut.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'semua file akan diubah namanya.',
        displayText: 'Semua'
      },
      none: {
        description: 'nama mereka dipertahankan.',
        displayText: 'Tidak ada'
      },
      onlyPastedImages: {
        description:
          'hanya gambar yang ditempel yang akan diubah namanya. Berlaku hanya ketika konten gambar PNG ditempel langsung dari clipboard. Biasanya, untuk menempel screenshot.',
        displayText: 'Hanya gambar yang ditempel'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'batalkan pengumpulan lampiran.',
        displayText: 'Batal'
      },
      copy: {
        description: 'salin lampiran ke lokasi baru.',
        displayText: 'Salin'
      },
      move: {
        description: 'pindahkan lampiran ke lokasi baru.',
        displayText: 'Pindah'
      },
      prompt: {
        description: 'minta pengguna untuk memilih tindakan.',
        displayText: 'Permintaan'
      },
      skip: {
        description: 'lewati lampiran dan lanjutkan ke yang berikutnya.',
        displayText: 'Lewati'
      }
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'akan menghapus folder lampiran yang kosong.',
        displayText: 'Hapus'
      },
      deleteWithEmptyParents: {
        description: 'akan menghapus folder lampiran yang kosong dan folder induk kosongnya.',
        displayText: 'Hapus dengan induk kosong'
      },
      keep: {
        description: 'akan mempertahankan folder lampiran yang kosong.',
        displayText: 'Simpan'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Token kustom dikomentari karena harus diperbarui ke format baru yang diperkenalkan di versi plugin 9.0.0.\n// Lihat dokumentasi (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) untuk informasi lebih lanjut.',
      deprecated: {
        part1: 'Di versi plugin 9.0.0, format registrasi token kustom berubah. Silakan perbarui token Anda sesuai. Lihat',
        part2: 'dokumentasi',
        part3: 'untuk informasi lebih lanjut'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'Di versi plugin 9.0.0, pengaturan',
      part2: 'sudah tidak digunakan lagi. Gunakan format',
      part3: 'sebagai gantinya. Lihat',
      part4: 'dokumentasi',
      part5: 'untuk informasi lebih lanjut'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Anda mungkin memiliki nilai yang salah untuk format',
        part2: '. Silakan lihat',
        part3: 'dokumentasi',
        part4: 'untuk informasi lebih lanjut',
        part5: 'Pesan ini tidak akan ditampilkan lagi.'
      }
    },
    specialCharacters: {
      part1: 'Di versi plugin 9.16.0, nilai pengaturan default',
      part2: 'berubah. Nilai pengaturan Anda diperbarui ke nilai default baru.'
    },
    validation: {
      invalidCustomTokensCode: 'Kode token kustom tidak valid',
      invalidRegularExpression: 'Ekspresi reguler tidak valid {{regExp}}',
      specialCharactersMustNotContainSlash: 'Karakter khusus tidak boleh mengandung /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'Penggantian karakter khusus tidak boleh mengandung karakter jalur nama file yang tidak valid.'
    },
    version: {
      part1: 'File pengaturan Anda ',
      part2: 'memiliki versi',
      part3: 'yang lebih baru dari versi plugin saat ini',
      part4: 'Plugin mungkin tidak berfungsi seperti yang diharapkan. Silakan perbarui plugin ke versi terbaru atau pastikan pengaturannya benar.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Saat melampirkan file:'
      },
      name: 'Mode penggantian nama lampiran'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Ketika lampiran yang dikumpulkan digunakan oleh beberapa catatan:'
      },
      name: 'Mode pengumpulan lampiran yang digunakan oleh beberapa catatan'
    },
    customTokens: {
      description: {
        part1: 'Token kustom yang akan digunakan.',
        part2: 'Lihat',
        part3: 'dokumentasi',
        part4: 'untuk informasi lebih lanjut.',
        part5:
          '⚠️ Token kustom dapat berupa kode JavaScript arbitrer. Jika ditulis dengan buruk, dapat menyebabkan kehilangan data. Gunakan dengan risiko sendiri.'
      },
      name: 'Token kustom'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Ketika Anda menempel/menyeret file dengan nama yang sama dengan file yang ada, pemisah ini akan ditambahkan ke nama file.',
        part2: 'Misalnya, ketika Anda menyeret file',
        part3: ', itu akan diubah namanya menjadi',
        part4: ', dll, mendapatkan nama pertama yang tersedia.'
      },
      name: 'Pemisah nama duplikat'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Ketika folder lampiran menjadi kosong:'
      },
      name: 'Perilaku folder lampiran kosong'
    },
    excludePaths: {
      description: {
        part1: 'Kecualikan catatan dari jalur berikut.',
        part2: 'Masukkan setiap jalur pada baris baru.',
        part3: 'Anda dapat menggunakan string jalur atau',
        part4: 'Jika pengaturan kosong, tidak ada catatan yang dikecualikan.'
      },
      name: 'Kecualikan jalur'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Kecualikan lampiran dari jalur berikut ketika',
        part2: 'Kumpulkan lampiran',
        part3: 'perintah dijalankan.',
        part4: 'Masukkan setiap jalur pada baris baru.',
        part5: 'Anda dapat menggunakan string jalur atau',
        part6: 'Jika pengaturan kosong, tidak ada jalur yang dikecualikan dari pengumpulan lampiran.'
      },
      name: 'Kecualikan jalur dari pengumpulan lampiran'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Lihat',
        part2: 'token yang tersedia'
      },
      name: 'Nama file lampiran yang dihasilkan'
    },
    includePaths: {
      description: {
        part1: 'Sertakan catatan dari jalur berikut.',
        part2: 'Masukkan setiap jalur pada baris baru.',
        part3: 'Anda dapat menggunakan string jalur atau',
        part4: 'Jika pengaturan kosong, semua catatan disertakan.'
      },
      name: 'Sertakan jalur'
    },
    jpegQuality: {
      description: 'Semakin kecil kualitasnya, semakin besar rasio kompresi.',
      name: 'Kualitas JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Mulai dengan',
        part2: 'untuk menggunakan jalur relatif.',
        part3: 'Lihat',
        part4: 'token yang tersedia',
        part5: 'Folder titik seperti',
        part6: 'tidak direkomendasikan, karena Obsidian tidak melacaknya. Anda mungkin perlu menggunakan',
        part7: 'Plugin untuk mengelolanya.'
      },
      name: 'Lokasi untuk lampiran baru'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Format untuk URL yang akan dimasukkan ke Markdown.',
        part2: 'Lihat',
        part3: 'token yang tersedia',
        part4: 'Biarkan kosong untuk menggunakan format default.'
      },
      name: 'Format URL Markdown'
    },
    renameAttachmentsToLowerCase: 'Ubah nama lampiran menjadi huruf kecil',
    resetToSampleCustomTokens: {
      message: 'Apakah Anda yakin ingin mengatur ulang token kustom ke token kustom sampel? Perubahan Anda akan hilang.',
      title: 'Atur ulang ke token kustom sampel'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Apakah akan mengkonversi gambar yang ditempel ke JPEG. Berlaku hanya ketika konten gambar PNG ditempel langsung dari clipboard. Biasanya, untuk menempel screenshot.',
      name: 'Haruskah mengkonversi gambar yang ditempel ke JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Jika diaktifkan, ketika catatan dihapus, lampiran yatimnya juga akan dihapus.',
      name: 'Haruskah menghapus lampiran yatim'
    },
    shouldRenameAttachmentFiles: {
      description: 'Apakah akan mengubah nama file lampiran ketika catatan diubah namanya atau dipindahkan.',
      name: 'Haruskah mengubah nama file lampiran'
    },
    shouldRenameAttachmentFolders: {
      description: 'Apakah akan mengubah nama folder lampiran ketika catatan diubah namanya atau dipindahkan.',
      name: 'Haruskah mengubah nama folder lampiran'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Jika diaktifkan, lampiran yang diproses melalui',
        part2: 'Kumpulkan lampiran',
        part3: 'perintah akan diubah namanya sesuai dengan',
        part4: 'pengaturan.'
      },
      name: 'Haruskah mengubah nama lampiran yang dikumpulkan'
    },
    specialCharacters: {
      description: {
        part1: 'Karakter khusus dalam folder lampiran dan nama file yang akan diganti atau dihapus.',
        part2: 'Biarkan kosong untuk mempertahankan karakter khusus.'
      },
      name: 'Karakter khusus'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'String pengganti untuk karakter khusus dalam folder lampiran dan nama file.',
        part2: 'Biarkan kosong untuk menghapus karakter khusus.'
      },
      name: 'Penggantian karakter khusus'
    },
    timeoutInSeconds: {
      description: {
        part1: 'Timeout dalam detik untuk semua operasi.',
        part2: 'Jika',
        part3: 'diatur, timeout eksekusi operasi dinonaktifkan.'
      },
      name: 'Timeout dalam detik'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Perlakukan file dengan ekstensi ini sebagai lampiran.',
        part2: 'Secara default',
        part3: 'dan',
        part4: 'file yang ditautkan tidak diperlakukan sebagai lampiran dan tidak dipindahkan dengan catatan.',
        part5: 'Anda dapat menambahkan ekstensi kustom, misalnya',
        part6: ', untuk menimpa perilaku ini.'
      },
      name: 'Perlakukan sebagai ekstensi lampiran'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Pratinjau file lampiran \'{{fullFileName}}\''
    },
    title: 'Berikan nilai untuk token prompt'
  },
  regularExpression: '/ekspresi reguler/'
};
