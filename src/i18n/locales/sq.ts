import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const sq: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'A doni të mblidhni bashkëngjitjet për të gjitha shënimet në dosjen:',
      part2: 'dhe të gjitha nëndosjet e saj?',
      part3: 'Ky veprim nuk mund të zhbëhet.'
    },
    progressBar: {
      message: 'Duke mbledhur bashkëngjitjet {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Duke mbledhur bashkëngjitjet...'
    }
  },
  buttons: {
    copy: 'Kopjo',
    move: 'Lëviz',
    previewAttachmentFile: 'Parashiko skedarin e bashkëngjitur',
    skip: 'Kalo'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Bashkëngjitja',
      part2: 'është e referuar nga disa shënime.'
    },
    heading: 'Duke mbledhur bashkëngjitjen e përdorur nga disa shënime',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Përdor të njëjtin veprim për bashkëngjitje të tjera problematike'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Mblidh bashkëngjitjet në dosjen aktuale',
    collectAttachmentsCurrentNote: 'Mblidh bashkëngjitjet në shënimin aktual',
    collectAttachmentsEntireVault: 'Mblidh bashkëngjitjet në gjithë depozitën'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Mblidh bashkëngjitjet në dosje'
  },
  notice: {
    collectingAttachments: 'Duke mbledhur bashkëngjitjet për \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Mbledhja e bashkëngjitjeve u anulua. Kontrolloni konsolën për detaje.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Emri i gjeneruar i skedarit të bashkëngjitur \'{{path}}\' është i pavlefshëm.\n{{validationMessage}}\nKontrolloni',
      part2: 'cilësimet tuaja.'
    },
    notePathIsIgnored: 'Shtegu i shënimit është injoruar'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Anulo',
      ok: 'OK'
    },
    dataview: {
      itemsPerPage: 'Artikuj për faqe:',
      jumpToPage: 'Shko te faqja:'
    },
    notices: {
      attachmentIsStillUsed: 'Bashkëngjitja {{attachmentPath}} ende po përdoret nga shënime të tjera. Nuk do të fshihet.',
      unhandledError: 'Ndodhi një gabim i papritur. Ju lutemi kontrolloni konsolën për më shumë informacione.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'të gjithë skedarët riemërtohen.',
        displayText: 'Të gjitha'
      },
      none: {
        description: 'emrat e tyre ruhen.',
        displayText: 'Asnjë'
      },
      onlyPastedImages: {
        description:
          'vetëm imazhet e ngjitura riemërtohen. Aplikohet vetëm kur një imazh PNG ngjitet drejtpërdrejt nga clipboard. Zakonisht përdoret për pamjet e ekranit.',
        displayText: 'Vetëm imazhet e ngjitura'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'anulo mbledhjen e bashkëngjitjeve.',
        displayText: 'Anulo'
      },
      copy: {
        description: 'kopjo bashkëngjitjen në vendndodhjen e re.',
        displayText: 'Kopjo'
      },
      move: {
        description: 'lëviz bashkëngjitjen në vendndodhjen e re.',
        displayText: 'Lëviz'
      },
      prompt: {
        description: 'kërko nga përdoruesi të zgjedhë veprimin.',
        displayText: 'Kërko'
      },
      skip: {
        description: 'anashkalo bashkëngjitjen dhe vazhdo me tjetrën.',
        displayText: 'Anashkalo'
      }
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'do të fshijë dosjen e zbrazët të bashkëngjitjeve.',
        displayText: 'Fshi'
      },
      deleteWithEmptyParents: {
        description: 'do të fshijë dosjen e zbrazët të bashkëngjitjeve dhe dosjet prind të zbrazëta.',
        displayText: 'Fshi me prindër të zbrazët'
      },
      keep: {
        description: 'do të mbajë dosjen e zbrazët të bashkëngjitjeve.',
        displayText: 'Mbaj'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Tokenat e personalizuar u komentuan pasi duhet të përditësohen me formatin e ri të prezantuar në versionin 9.0.0 të shtesës.\n// Referojuni dokumentacionit (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) për më shumë informacione.',
      deprecated: {
        part1:
          'Në versionin 9.0.0 të shtesës formati i regjistrimit të tokenave të personalizuar ndryshoi. Ju lutemi përditësoni tokenat tuaj siç duhet. Referojuni',
        part2: 'dokumentacionit',
        part3: 'për më shumë informacione'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'Në versionin 9.0.0 të shtesës, kjo',
      part2: 'cilësim është i vjetruar. Përdorni',
      part3: 'formatin në vend të saj. Shihni',
      part4: 'dokumentacionin',
      part5: 'për më shumë informacione'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Keni një vlerë potencialisht të gabuar të vendosur për',
        part2: 'formatin. Ju lutemi referojuni',
        part3: 'dokumentacionit',
        part4: 'për më shumë informacione.',
        part5: 'Ky mesazh nuk do të shfaqet më.'
      }
    },
    specialCharacters: {
      part1: 'Në versionin 9.16.0 të shtesës,',
      part2: 'vlera e parazgjedhur e cilësimit u ndryshua. Vlera juaj u përditësua me atë të re.'
    },
    validation: {
      invalidCustomTokensCode: 'Kod i pavlefshëm i tokenave të personalizuar',
      invalidRegularExpression: 'Shprehje e rregullt e pavlefshme {{regExp}}',
      specialCharactersMustNotContainSlash: 'Karaketret specialë nuk duhet të përmbajnë /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'Zëvendësimi i karaktereve specialë nuk duhet të përmbajë karaktere të pavlefshëm për shtegun e skedarit.'
    },
    version: {
      part1: 'Skedari juaj i cilësimeve ',
      part2: 'ka versionin',
      part3: 'që është më i ri se versioni aktual i shtesës',
      part4: 'Shtesa mund të mos funksionojë siç pritet. Përditësoni shtesën në versionin më të fundit ose sigurohuni që cilësimet të jenë të sakta.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Kur bashkëngjitni skedarë:'
      },
      name: 'Mënyra e riemërtimit të bashkëngjitjeve'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Kur bashkëngjitja e mbledhur përdoret nga disa shënime:'
      },
      name: 'Mënyra e mbledhjes së bashkëngjitjeve të përdorura nga disa shënime'
    },
    customTokens: {
      description: {
        part1: 'Tokena të personalizuar që do të përdoren.',
        part2: 'Shih',
        part3: 'dokumentacionin',
        part4: 'për më shumë informacione.',
        part5:
          '⚠️ Tokenat e personalizuar mund të përmbajnë kod arbitrar JavaScript. Nëse shkruhen gabim, mund të shkaktojnë humbje të të dhënave. Përdoreni me kujdes.'
      },
      name: 'Tokena të personalizuar'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Kur ngjisni ose tërhiqni një skedar me të njëjtin emër si një ekzistues, ky ndarës do të shtohet në emër.',
        part2: 'P.sh., kur tërhiqni skedarin',
        part3: ', do të riemërtohet në ',
        part4: ', etj., duke marrë emrin e parë të lirë.'
      },
      name: 'Ndarës për emra të dyfishtë'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Kur dosja e bashkëngjitjeve bëhet e zbrazët:'
      },
      name: 'Sjellja e dosjes së zbrazët të bashkëngjitjeve'
    },
    excludePaths: {
      description: {
        part1: 'Përjashto shënime nga shtegu në vijim.',
        part2: 'Futni çdo shteg në një rresht të ri.',
        part3: 'Mund të përdorni vargun e shtegut ose',
        part4: 'Nëse cilësimi është bosh, asnjë shënim nuk përjashtohet.'
      },
      name: 'Përjashto shtigjet'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Përjashto bashkëngjitjet nga këto shtigje kur komanda',
        part2: 'Mblidh bashkëngjitjet',
        part3: 'ekzekutohet.',
        part4: 'Futni çdo shteg në një rresht të ri.',
        part5: 'Mund të përdorni vargun e shtegut ose',
        part6: 'Nëse cilësimi është bosh, asnjë shteg nuk përjashtohet nga mbledhja.'
      },
      name: 'Përjashto shtigje nga mbledhja e bashkëngjitjeve'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Shih',
        part2: 'tokenat e disponueshëm'
      },
      name: 'Emri i gjeneruar i skedarit të bashkëngjitur'
    },
    includePaths: {
      description: {
        part1: 'Përfshi shënime nga shtigjet e mëposhtme.',
        part2: 'Futni çdo shteg në një rresht të ri.',
        part3: 'Mund të përdorni vargun e shtegut ose',
        part4: 'Nëse cilësimi është bosh, të gjitha shënimet përfshihen.'
      },
      name: 'Përfshi shtigje'
    },
    jpegQuality: {
      description: 'Sa më e vogël të jetë cilësia, aq më e madhe është shkalla e kompresimit.',
      name: 'Cilësia JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Filloni me',
        part2: 'për të përdorur një shteg relativ.',
        part3: 'Shih',
        part4: 'tokenat e disponueshëm',
        part5: 'Dosjet me pikë si',
        part6: 'nuk rekomandohen, sepse Obsidian nuk i ndjek ato. Mund t’ju duhet të përdorni një',
        part7: 'shtesë për t’i menaxhuar ato.'
      },
      name: 'Vendndodhja për bashkëngjitje të reja'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Formati i URL-së që do të futet në Markdown.',
        part2: 'Shih',
        part3: 'tokenat e disponueshëm',
        part4: 'Lëreni bosh për të përdorur formatin parazgjedhur.'
      },
      name: 'Formati i URL-së Markdown'
    },
    renameAttachmentsToLowerCase: 'Riemërto bashkëngjitjet me shkronja të vogla',
    resetToSampleCustomTokens: {
      message: 'Jeni i sigurt që doni të rivendosni tokenat e personalizuar në tokenat shembullorë? Ndryshimet tuaja do të humbasin.',
      title: 'Rivendos tek tokenat shembullorë'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Nëse imazhet e ngjitura duhet të konvertohen në JPEG. Aplikohet vetëm kur përmbajtja e një PNG ngjitet nga clipboard. Zakonisht për pamjet e ekranit.',
      name: 'Konverto imazhet e ngjitura në JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Nëse aktivizohet, kur fshihet shënimi, fshihen edhe bashkëngjitjet jetim.',
      name: 'Fshi bashkëngjitjet jetim'
    },
    shouldRenameAttachmentFiles: {
      description: 'Nëse skedarët e bashkëngjitjes do të riemërtohen kur një shënim riemërtohet ose zhvendoset.',
      name: 'Riemërto skedarët e bashkëngjitjes'
    },
    shouldRenameAttachmentFolders: {
      description: 'Nëse dosjet e bashkëngjitjes do të riemërtohen kur një shënim riemërtohet ose zhvendoset.',
      name: 'Riemërto dosjet e bashkëngjitjes'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Nëse aktivizohet, bashkëngjitjet e përpunuara nga komanda',
        part2: 'Mblidh bashkëngjitjet',
        part3: 'do të riemërtohen sipas',
        part4: 'cilësimeve.'
      },
      name: 'Riemërto bashkëngjitjet e mbledhura'
    },
    specialCharacters: {
      description: {
        part1: 'Karakteret speciale në emrin e dosjes ose skedarit të bashkëngjitjes që do të zëvendësohen ose hiqen.',
        part2: 'Lëreni bosh për të ruajtur karakteret speciale.'
      },
      name: 'Karaktere speciale'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Vargu i zëvendësimit për karakteret speciale në dosje ose në emrin e skedarit të bashkëngjitur.',
        part2: 'Lëreni bosh për t’i hequr karakteret speciale.'
      },
      name: 'Zëvendësim i karaktereve speciale'
    },
    timeoutInSeconds: {
      description: {
        part1: 'Koha në sekonda për të gjitha operacionet.',
        part2: 'Nëse',
        part3: 'është i vendosur, koha e operacionit është e çaktivizuar.'
      },
      name: 'Kufiri i kohës në sekonda'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Trajtoni skedarët me këto zgjerime si bashkëngjitje.',
        part2: 'Si parazgjedhje',
        part3: 'dhe',
        part4: 'skedarët e lidhur nuk trajtohen si bashkëngjitje dhe nuk zhvendosen me shënimin.',
        part5: 'Mund të shtoni zgjerime të personalizuara, p.sh.',
        part6: ', për të anashkaluar këtë sjellje.'
      },
      name: 'Trajto si zgjerime bashkëngjitjesh'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Parashiko skedarin e bashkëngjitur \'{{fullFileName}}\''
    },
    title: 'Jepni një vlerë për tokenin e kërkesës'
  },
  regularExpression: '/shprehje e rregullt/'
};
