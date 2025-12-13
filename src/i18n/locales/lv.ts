import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const lv: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Vai vēlaties rekursīvi savākt pielikumus visām piezīmēm mapēs?',
      part2: 'Šo darbību nevar atsaukt.'
    },
    progressBar: {
      message: 'Apkopoju pielikumus {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Apkopoju pielikumus...'
    }
  },
  buttons: {
    copy: 'Kopēt',
    move: 'Pārvietot',
    previewAttachmentFile: 'Pielikuma faila priekšskatījums',
    skip: 'Izlaist'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Pielikums',
      part2: 'tiek atsaucēts no vairākām piezimēm.'
    },
    heading: 'Apkopoju pielikumu, kuru lieto vairākas piezimes',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Izmantot to pašu darbību citiem problēmatiskajiem pielikumiem'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Apkopot pielikumus pšreizējā mappē',
    collectAttachmentsCurrentNote: 'Apkopot pielikumus pšreizējā piezimē',
    collectAttachmentsEntireVault: 'Apkopot pielikumus visā glabatavā'
  },
  menuItems: {
    collectAttachmentsInFile: 'Savākt pielikumus failā',
    collectAttachmentsInFiles: 'Savākt pielikumus failos'
  },
  notice: {
    collectingAttachments: 'Apkopoju pielikumus priekš \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Pielikumu apkopošana atcelta. Skatiet konsoli detalām.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Ģenerētais pielikuma faila nosaukums \'{{path}}\' nav derīgs.\n{{validationMessage}}\nPārbaudiet savu',
      part2: 'iestatījumu.'
    },
    notePathIsIgnored: 'Piezimes ceļš tiek ignorēts'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Atcelt',
      ok: 'Labi'
    },
    dataview: {
      itemsPerPage: 'Vienumi lapā:',
      jumpToPage: 'Pāriet uz lapu:'
    },
    notices: {
      attachmentIsStillUsed: 'Pielikums {{attachmentPath}} joprojām tiek izmantots citās piezimēs. Tas netiks dzēsts.',
      unhandledError: 'Radās neapstrādāta kļūda. Lūdzu, pārbaudiet konsoli, lai iegūtu vairāk informācijas.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'visi faili tiek pārdēvēti.',
        displayText: 'Visi'
      },
      none: {
        description: 'to nosaukumi tiek saglabāti.',
        displayText: 'Neviens'
      },
      onlyPastedImages: {
        description:
          'tikai ielīmētās attēli tiek pārdēvēti. Attiecas tikai tad, kad PNG attēla saturs tiek ielīmēts tieši no starpliktuvnes. Parasti ekrānuzņēmumu ielīmēšanai.',
        displayText: 'Tikai ielīmētie attēli'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'atcelt pielikumu apkopošanu.',
        displayText: 'Atcelt'
      },
      copy: {
        description: 'kopēt pielikumu uz jauno atrašanās vietu.',
        displayText: 'Kopēt'
      },
      move: {
        description: 'pārvietot pielikumu uz jauno atrašanās vietu.',
        displayText: 'Pārvietot'
      },
      prompt: {
        description: 'prasīt lietotājam izvēlēties darbību.',
        displayText: 'Prasīt'
      },
      skip: {
        description: 'izlaist pielikumu un turpināt ar nākamo.',
        displayText: 'Izlaist'
      }
    },
    defaultImageSizeDimension: {
      height: 'Augstums',
      width: 'Platums'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'dzēsīs tukšo pielikumu mapi.',
        displayText: 'Dzēst'
      },
      deleteWithEmptyParents: {
        description: 'dzēsīs tukšo pielikumu mapi un tās tukšās vecāku mapes.',
        displayText: 'Dzēst ar tukšiem vecākiem'
      },
      keep: {
        description: 'saglabās tukšo pielikumu mapi.',
        displayText: 'Saglabāt'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Pielāgotie tokeni tika komentēti, jo tie ir jāatjaunina uz jauno formātu, kas ieviests spraudņa versijā 9.0.0.\n// Sīkāku informāciju skatiet dokumentācijā (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens).',
      deprecated: {
        part1: 'Spraudņa versijā 9.0.0 pielāgoto tokenu reģistrācijas formāts mainījās. Lūdzu, atjauniniet savus tokenus attiecīgi. Sīkāku informāciju skatiet',
        part2: 'dokumentācijā',
        part3: '.'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'Spraudņa versijā 9.0.0',
      part2: 'iestatījums ir novecojis. Izmantojiet',
      part3: 'formātu. Sīkāku informāciju skatiet',
      part4: 'dokumentācijā',
      part5: '.'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Jums ir potenciāli nepareiza vērtība',
        part2: 'formātam. Lūdzu, skatiet',
        part3: 'dokumentāciju',
        part4: 'sīkākai informācijai',
        part5: 'Šis ziņojums vairs netiks parādīts.'
      }
    },
    specialCharacters: {
      part1: 'Spraudņa versijā 9.16.0',
      part2: 'noklusējuma iestatījuma vērtība mainījās. Jūsu iestatījuma vērtība tika atjaunināta uz jauno noklusējuma vērtību.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'Noklusējuma attēla izmēram jābūt pikseļos vai procentos',
      invalidCustomTokensCode: 'Nederīgs pielāgoto tokenu kods',
      invalidRegularExpression: 'Nederīga regulārā izteiksme {{regExp}}',
      specialCharactersMustNotContainSlash: 'Īpašajos rakstzīmēs nedrīkst būt /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'Īpašo rakstzīmju aizstāšana nedrīkst saturēt nederīgus faila nosaukuma ceļa rakstzīmes.'
    },
    version: {
      part1: 'Jūsu iestatījumu fails ',
      part2: 'ir versija',
      part3: ', kas ir jaunāka par pašreizējo spraudņa versiju',
      part4: 'Spraudnis var nedarboties kā paredzēts. Lūdzu, atjauniniet spraudni uz jaunāko versiju vai pārliecinieties, ka iestatījumi ir pareizi.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Pievienojot failus:'
      },
      name: 'Pielikuma pārdēvēšanas režīms'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Kad apkopotais pielikums tiek izmantots vairākās piezimēs:'
      },
      name: 'Vairākās piezimēs izmantoto pielikumu apkopošanas režīms'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'Skatiet pieejamos',
        part2: 'tokenus'
      },
      name: 'Apkopotais pielikuma faila nosaukums'
    },
    customTokens: {
      description: {
        part1: 'Izmantojamie pielāgotie tokeni.',
        part2: 'Skatiet',
        part3: 'dokumentāciju',
        part4: 'sīkākai informācijai.',
        part5: '⚠️ Pielāgotie tokeni var būt patvaļīgs JavaScript kods. Ja slikti uzrakstīts, tas var izraisīt datu zudumu. Izmantojiet uz savu risku.'
      },
      name: 'Pielāgotie tokeni'
    },
    defaultImageSize: {
      description: {
        part1: 'Noklusējuma attēla izmērs.',
        part2: 'Var norādīt pikseļos',
        part3: 'vai procentos no pilnā attēla izmēra',
        part4: 'Atstājiet tukšu, lai izmantotu oriģinālo izmēru.'
      },
      name: 'Noklusējuma attēla izmērs'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Kad ielīmējat/vilkat failu ar tādu pašu nosaukumu kā esošam failam, šis atdalītājs tiks pievienots faila nosaukumam.',
        part2: 'Piemēram, vilkot failu',
        part3: ', tas tiks pārdēvēts uz',
        part4: ', utt., iegūstot pirmo pieejamo nosaukumu.'
      },
      name: 'Dublēto nosaukumu atdalītājs'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Kad pielikumu mape kļūst tukša:'
      },
      name: 'Tukšas pielikumu mapes uzvedība'
    },
    excludePaths: {
      description: {
        part1: 'Izslēgt piezimes no šādiem ceļiem.',
        part2: 'Ievadiet katru ceļu jaunā rindā.',
        part3: 'Varat izmantot ceļa virkni vai',
        part4: 'Ja iestatījums ir tukšs, piezimes netiek izslēgtas.'
      },
      name: 'Izslēgt ceļus'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Izslēgt pielikumus no šādiem ceļiem, kad',
        part2: 'Apkopot pielikumus',
        part3: 'komanda tiek izpildīta.',
        part4: 'Ievadiet katru ceļu jaunā rindā.',
        part5: 'Varat izmantot ceļa virkni vai',
        part6: 'Ja iestatījums ir tukšs, ceļi netiek izslēgti no pielikumu apkopošanas.'
      },
      name: 'Izslēgt ceļus no pielikumu apkopošanas'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Skatiet pieejamos',
        part2: 'tokenus'
      },
      name: 'Ģenerētais pielikuma faila nosaukums'
    },
    includePaths: {
      description: {
        part1: 'Iekļaut piezimes no šādiem ceļiem.',
        part2: 'Ievadiet katru ceļu jaunā rindā.',
        part3: 'Varat izmantot ceļa virkni vai',
        part4: 'Ja iestatījums ir tukšs, visas piezimes tiek iekļautas.'
      },
      name: 'Iekļaut ceļus'
    },
    jpegQuality: {
      description: 'Jo mazāka kvalitāte, jo lielāks saspiešanas koeficients.',
      name: 'JPEG kvalitāte'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Sāciet ar',
        part2: ', lai izmantotu relatīvo ceļu.',
        part3: 'Skatiet pieejamos',
        part4: 'tokenus',
        part5: 'Punktu mapes, piemēram',
        part6: ', nav ieteicamas, jo Obsidian tās neuzrauga. Var būt nepieciešams izmantot',
        part7: 'spraudni, lai tās pārvaldītu.'
      },
      name: 'Jauno pielikumu atrašanās vieta'
    },
    markdownUrlFormat: {
      description: {
        part1: 'URL formāts, kas tiks ievietots Markdown.',
        part2: 'Skatiet pieejamos',
        part3: 'tokenus',
        part4: 'Atstājiet tukšu, lai izmantotu noklusējuma formātu.'
      },
      name: 'Markdown URL formāts'
    },
    renameAttachmentsToLowerCase: 'Pārdēvēt pielikumus uz mazajiem burtiem',
    renamedAttachmentFileName: {
      description: {
        part1: 'Skatiet pieejamos',
        part2: 'tokenus'
      },
      name: 'Pārdēvētais pielikuma faila nosaukums'
    },
    resetToSampleCustomTokens: {
      message: 'Vai tiešām vēlaties atiestatīt pielāgotos tokenus uz parauga pielāgotajiem tokeniem? Jūsu izmaiņas tiks zaudētas.',
      title: 'Atiestatīt uz parauga pielāgotajiem tokeniem'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Vai konvertēt ielīmētos attēlus uz JPEG. Attiecas tikai tad, kad PNG attēla saturs tiek ielīmēts tieši no starpliktuvnes. Parasti ekrānuzņēmumu ielīmēšanai.',
      name: 'Vai konvertēt ielīmētos attēlus uz JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Ja iespējots, kad piezime tiek dzēsta, tās bāreņu pielikumi arī tiek dzēsti.',
      name: 'Vai dzēst bāreņu pielikumus'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'Ja iespējots, kad piezime tiek pārdēvēta vai pārvietota, tās pielikumi tiks pārdēvēti saskaņā ar',
        part2: 'iestatījumu.'
      },
      name: 'Vai pārdēvēt pielikumu failus'
    },
    shouldRenameAttachmentFolders: {
      description: 'Vai pārdēvēt pielikumu mapes, kad piezime tiek pārdēvēta vai pārvietota.',
      name: 'Vai pārdēvēt pielikumu mapes'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Ja iespējots, pielikumi, kas apstrādāti caur',
        part2: 'Apkopot pielikumus',
        part3: 'komandām, tiks pārdēvēti saskaņā ar',
        part4: 'iestatījumu.'
      },
      name: 'Vai pārdēvēt apkopotos pielikumus'
    },
    specialCharacters: {
      description: {
        part1: 'Īpašās rakstzīmes pielikumu mapē un faila nosaukumā, kas jāaizstāj vai jānoņem.',
        part2: 'Atstājiet tukšu, lai saglabātu īpašās rakstzīmes.'
      },
      name: 'Īpašās rakstzīmes'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Aizstāšanas virkne īpašajām rakstzīmēm pielikumu mapē un faila nosaukumā.',
        part2: 'Atstājiet tukšu, lai noņemtu īpašās rakstzīmes.'
      },
      name: 'Īpašo rakstzīmju aizstāšana'
    },
    timeoutInSeconds: {
      description: {
        part1: 'Laika ierobežojums sekundēs visām operācijām.',
        part2: 'Ja',
        part3: 'ir iestatīts, operāciju izpildes laika ierobežojums ir atspējots.'
      },
      name: 'Laika ierobežojums sekundēs'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Uzskatīt failus ar šādiem paplašinājumiem par pielikumiem.',
        part2: 'Pēc noklusējuma',
        part3: 'un',
        part4: 'saistītie faili netiek uzskatīti par pielikumiem un netiek pārvietoti kopā ar piezimi.',
        part5: 'Varat pievienot pielāgotus paplašinājumus, piemēram',
        part6: ', lai ignorētu šo uzvedību.'
      },
      name: 'Uzskatīt par pielikumu paplašinājumiem'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Pielikuma faila priekšskatījums \'{{fullFileName}}\''
    },
    title: 'Norādiet vērtību prompt tokenam'
  },
  regularExpression: '/regulārā izteiksme/'
};
