import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const tr: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Klasördeki tüm notlar için ekleri toplamak istiyor musunuz:',
      part2: 've tüm alt klasörlerinde?',
      part3: 'Bu işlem geri alınamaz.'
    },
    progressBar: {
      message: 'Ekler toplanıyor {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Ekler toplanıyor...'
    }
  },
  buttons: {
    copy: 'Kopyala',
    move: 'Taşı',
    previewAttachmentFile: 'Ek dosyasını önizle',
    skip: 'Geç'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Ek',
      part2: 'birden fazla not tarafından referans alınıyor.'
    },
    heading: 'Birden fazla not tarafından kullanılan ek toplama',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Diğer sorunlu ekler için aynı eylemi kullanılmalı'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Mevcut klasördeki ekleri topla',
    collectAttachmentsCurrentNote: 'Mevcut nottaki ekleri topla',
    collectAttachmentsEntireVault: 'Tüm kasadaki ekleri topla'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Klasördeki ekleri topla'
  },
  notice: {
    collectingAttachments: '\'{{noteFilePath}}\' için ekler toplanıyor',
    collectingAttachmentsCancelled: 'Ek toplama işlemi iptal edildi. Ayrıntılar için konsola bakın.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Oluşturulan ek dosya adı \'{{path}}\' geçersiz.\n{{validationMessage}}\nAyarlarınızı',
      part2: 'kontrol edin.'
    },
    notePathIsIgnored: 'Not yolu yok sayıldı'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'İptal',
      ok: 'Tamam'
    },
    dataview: {
      itemsPerPage: 'Sayfa başına öğe:',
      jumpToPage: 'Sayfaya git:'
    },
    notices: {
      attachmentIsStillUsed: 'Ek {{attachmentPath}} hala diğer notlar tarafından kullanılıyor. Silinmeyecek.',
      unhandledError: 'İşlenmemiş bir hata oluştu. Lütfen detaylar için konsolu kontrol edin.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'Tüm dosyaların adı değiştirilecek.',
        displayText: 'Tümü'
      },
      none: {
        description: 'Dosya isimleri korunacak.',
        displayText: 'Hiçbiri'
      },
      onlyPastedImages: {
        description: 'Yalnızca yapıştırılan PNG görüntülerinin isimleri değiştirilecek. Genellikle ekran görüntüsü yapıştırmak için kullanılır.',
        displayText: 'Yalnızca yapıştırılan görüntüler'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'Ek toplama işlemini iptal et.',
        displayText: 'İptal'
      },
      copy: {
        description: 'Eki yeni konuma kopyala.',
        displayText: 'Kopyala'
      },
      move: {
        description: 'Eki yeni konuma taşı.',
        displayText: 'Taşı'
      },
      prompt: {
        description: 'Kullanıcıdan işlem seçmesini iste.',
        displayText: 'İste'
      },
      skip: {
        description: 'Eki atla ve sonraki ekleme geç.',
        displayText: 'Atla'
      }
    },
    defaultImageSizeDimension: {
      height: 'Yükseklik',
      width: 'Genişlik'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'Boş eki klasörünü silecek.',
        displayText: 'Sil'
      },
      deleteWithEmptyParents: {
        description: 'Boş eki klasörü ve boş üst klasörlerini silecek.',
        displayText: 'Boş ebeveynlerle sil'
      },
      keep: {
        description: 'Boş eki klasörünü koruyacak.',
        displayText: 'Koru'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Özel tokenler yorum satırı yapıldı, 9.0.0 sürümünde değişen formata güncellenmesi gerekiyor.\n// Daha fazla bilgi için dokümantasyona bakınız.',
      deprecated: {
        part1: '9.0.0 sürümünde özel token kayıt formatı değişti. Lütfen tokenlerinizi güncelleyin. Detaylar için',
        part2: 'dokümantasyona',
        part3: 'bakınız.'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: '9.0.0 sürümünde bu',
      part2: 'ayar kullanım dışı bırakıldı. Bunun yerine',
      part3: 'formatını kullanın. Detaylar için',
      part4: 'dokümantasyona',
      part5: 'bakınız.'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Potansiyel olarak hatalı bir değer ayarlandı:',
        part2: 'format. Lütfen',
        part3: 'dokümantasyona',
        part4: 'bakınız.',
        part5: 'Bu mesaj tekrar gösterilmeyecek.'
      }
    },
    specialCharacters: {
      part1: '9.16.0 sürümünde,',
      part2: 'varsayılan ayar değiştirildi. Ayarınız yeni varsayılan olarak güncellendi.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'Varsayılan resim boyutu piksel veya yüzde olmalıdır',
      invalidCustomTokensCode: 'Geçersiz özel token kodu',
      invalidRegularExpression: 'Geçersiz düzenli ifade {{regExp}}',
      specialCharactersMustNotContainSlash: 'Özel karakterler / içermemelidir',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters: 'Özel karakterler geçersiz dosya adı veya yol karakterleri içermemelidir'
    },
    version: {
      part1: 'Ayarlar dosyanız ',
      part2: 'şu sürüme sahip: ',
      part3: 'Bu sürüm, mevcut eklenti sürümünden daha yenidir.',
      part4: 'Eklenti beklendiği gibi çalışmayabilir. Lütfen eklentiyi en son sürüme güncelleyin veya ayarların doğru olduğundan emin olun.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Dosya eklerken:'
      },
      name: 'Ek dosya yeniden adlandırma modu'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Toplanan ek birden fazla notta kullanıldığında:'
      },
      name: 'Birden fazla notta kullanılan ek toplama modu'
    },
    customTokens: {
      description: {
        part1: 'Kullanılacak özel tokenlar.',
        part2: 'Bakınız',
        part3: 'dokümantasyon',
        part4: 'daha fazla bilgi için.',
        part5: '⚠️ Özel tokenlar herhangi bir JavaScript kodu olabilir. Hatalı yazılırsa veri kaybına yol açabilir. Kendi sorumluluğunuzda kullanın.'
      },
      name: 'Özel tokenlar'
    },
    defaultImageSize: {
      description: {
        part1: 'Varsayılan resim boyutu.',
        part2: 'Piksel olarak belirtilebilir',
        part3: 'Tam resim boyutunun yüzdesi olarak',
        part4: 'Orijinal resim boyutunu kullanmak için boş bırakın.'
      },
      name: 'Varsayılan resim boyutu'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Mevcut bir dosya adıyla aynı olan dosya yapıştırılır/taşınırsa, bu ayırıcı dosya adına eklenir.',
        part2: 'Örneğin, dosya sürüklendiğinde',
        part3: 'şuna yeniden adlandırılır ',
        part4: ', vb., ilk uygun ad bulunana kadar.'
      },
      name: 'Yinelenen ad ayırıcı'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Ek klasörü boş olduğunda:'
      },
      name: 'Boş ek klasörü davranışı'
    },
    excludePaths: {
      description: {
        part1: 'Aşağıdaki yollardaki notları hariç tut.',
        part2: 'Her yolu yeni satıra yazın.',
        part3: 'Yol dizisi veya',
        part4: 'Eğer ayar boşsa, hiç bir not hariç tutulmaz.'
      },
      name: 'Hariç tutulan yollar'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Aşağıdaki yollardan ekler hariç tutulur,',
        part2: 'Ekleri topla',
        part3: 'komutu çalıştırıldığında.',
        part4: 'Her yolu yeni satıra yazın.',
        part5: 'Yol dizisi veya',
        part6: 'Eğer ayar boşsa, hiç bir yol hariç tutulmaz.'
      },
      name: 'Ek toplarken hariç tutulan yollar'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Mevcut',
        part2: 'tokenlara bakınız'
      },
      name: 'Oluşturulan ek dosya adı'
    },
    includePaths: {
      description: {
        part1: 'Aşağıdaki yollardan notlar dahil edilir.',
        part2: 'Her yolu yeni satıra yazın.',
        part3: 'Yol dizisi veya',
        part4: 'Eğer ayar boşsa, tüm notlar dahil edilir.'
      },
      name: 'Dahil edilen yollar'
    },
    jpegQuality: {
      description: 'Kalite ne kadar düşükse, sıkıştırma oranı o kadar yüksek olur.',
      name: 'JPEG Kalitesi'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Göreceli yol kullanmak için',
        part2: 'ile başlayın.',
        part3: 'Mevcut',
        part4: 'tokenlara bakınız',
        part5: 'Nokta ile başlayan klasörler gibi',
        part6: 'Obsidian tarafından takip edilmez, yönetmek için eklenti gerekebilir.',
        part7: 'Kullanmanız gerekebilir.'
      },
      name: 'Yeni ekler için konum'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Markdown içine eklenecek URL formatı.',
        part2: 'Mevcut',
        part3: 'tokenlara bakınız',
        part4: 'Varsayılan format için boş bırakın.'
      },
      name: 'Markdown URL formatı'
    },
    renameAttachmentsToLowerCase: 'Eklerin dosya adlarını küçük harfe çevir',
    resetToSampleCustomTokens: {
      message: 'Özel tokenları örnek tokenlara sıfırlamak istediğinize emin misiniz? Değişiklikleriniz kaybolacak.',
      title: 'Örnek tokenlara sıfırla'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Yapıştırılan görüntülerin JPEG\'e dönüştürülüp dönüştürülmeyeceği. Sadece PNG içeriği direkt olarak pano’dan yapıştırıldığında geçerlidir. Genellikle ekran görüntüleri için.',
      name: 'Yapıştırılan görüntüleri JPEG\'e dönüştür'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Etkinleştirilirse, not silindiğinde yetim ekler de silinir.',
      name: 'Yetim ekleri sil'
    },
    shouldRenameAttachmentFiles: {
      description: 'Bir not yeniden adlandırıldığında veya taşındığında ek dosyaları yeniden adlandırılsın mı?',
      name: 'Ek dosyalarını yeniden adlandır'
    },
    shouldRenameAttachmentFolders: {
      description: 'Bir not yeniden adlandırıldığında veya taşındığında ek klasörleri yeniden adlandırılsın mı?',
      name: 'Ek klasörlerini yeniden adlandır'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Aktifse,',
        part2: 'Ekleri topla',
        part3: 'komutları ile işlenen ekler',
        part4: 'ayarına göre yeniden adlandırılır.'
      },
      name: 'Toplanan ek dosyalarını yeniden adlandır'
    },
    specialCharacters: {
      description: {
        part1: 'Ek klasörü ve dosya adındaki özel karakterler değiştirilir veya kaldırılır.',
        part2: 'Korumak için boş bırakın.'
      },
      name: 'Özel karakterler'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Ek klasörü ve dosya adındaki özel karakterler için değiştirme dizisi.',
        part2: 'Özel karakterleri kaldırmak için boş bırakın.'
      },
      name: 'Özel karakterler için değiştirme'
    },
    timeoutInSeconds: {
      description: {
        part1: 'Tüm işlemler için zaman aşımı süresi (saniye).',
        part2: 'Eğer',
        part3: 'ayarlanırsa, zaman aşımı devre dışı bırakılır.'
      },
      name: 'Zaman aşımı (saniye)'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Bu uzantılara sahip dosyalar ek olarak kabul edilir.',
        part2: 'Varsayılan olarak',
        part3: 've',
        part4: 'bağlı dosyalar ek olarak kabul edilmez ve not ile taşınmaz.',
        part5: 'Özel uzantılar ekleyebilirsiniz, örn.',
        part6: ', bu davranışı değiştirmek için.'
      },
      name: 'Ek uzantıları olarak işle'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Ek dosyasını önizle \'{{fullFileName}}\''
    },
    title: 'İstem tokenı için bir değer girin'
  },
  regularExpression: '/düzenli ifade/'
};
