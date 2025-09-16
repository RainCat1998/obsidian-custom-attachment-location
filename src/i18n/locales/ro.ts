import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const ro: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Doriți să colectați atașamentele pentru toate notițele din dosarul:',
      part2: 'și toate subdosarele acestuia?',
      part3: 'Această operațiune nu poate fi anulată.'
    },
    progressBar: {
      message: 'Colectez atașamente {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Colectez atașamente...'
    }
  },
  buttons: {
    copy: 'Copiază',
    move: 'Mută',
    previewAttachmentFile: 'Previzualizează fișierul atașat',
    skip: 'Sari peste'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Atașamentul',
      part2: 'este folosit de mai multe notițe.'
    },
    heading: 'Colectez atașamentul folosit de multiple notițe',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Folosește aceeași acțiune pentru alte atașamente problematice'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Colectează atașamentele din dosarul curent',
    collectAttachmentsCurrentNote: 'Colectează atașamentele din notița curentă',
    collectAttachmentsEntireVault: 'Colectează atașamentele din întregul seif'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Colectează atașamentele din dosar'
  },
  notice: {
    collectingAttachments: 'Colectez atașamentele pentru \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Colectarea atașamentelor a fost anulată. Verifică consola pentru detalii.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Numele fișierului atașat generat \'{{path}}\' este invalid.\n{{validationMessage}}\nVerifică-ți',
      part2: 'setările.'
    },
    notePathIsIgnored: 'Calea notiței a fost ignorată'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Anulează',
      ok: 'OK'
    },
    dataview: {
      itemsPerPage: 'Elemente pe pagină:',
      jumpToPage: 'Sari la pagina:'
    },
    notices: {
      attachmentIsStillUsed: 'Atașamentul {{attachmentPath}} este încă folosit de alte notițe. Nu va fi șters.',
      unhandledError: 'A apărut o eroare neprevăzută. Verifică consola pentru mai multe informații.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'toate fișierele sunt redenumite.',
        displayText: 'Toate'
      },
      none: {
        description: 'numele lor sunt păstrate.',
        displayText: 'Niciunul'
      },
      onlyPastedImages: {
        description:
          'doar imaginile lipite sunt redenumite. Se aplică doar când conținutul imaginii PNG este lipit direct din clipboard. De obicei, pentru capturi de ecran.',
        displayText: 'Doar imaginile lipite'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'anulează colectarea atașamentelor.',
        displayText: 'Anulează'
      },
      copy: {
        description: 'copiază atașamentul în noua locație.',
        displayText: 'Copiază'
      },
      move: {
        description: 'mută atașamentul în noua locație.',
        displayText: 'Mută'
      },
      prompt: {
        description: 'cere utilizatorului să aleagă acțiunea.',
        displayText: 'Solicită'
      },
      skip: {
        description: 'sari peste atașament și continuă cu următorul.',
        displayText: 'Sari peste'
      }
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'va șterge dosarul de atașamente gol.',
        displayText: 'Șterge'
      },
      deleteWithEmptyParents: {
        description: 'va șterge dosarul de atașamente gol și dosarele-părinte goale.',
        displayText: 'Șterge cu părinți goi'
      },
      keep: {
        description: 'va păstra dosarul de atașamente gol.',
        displayText: 'Păstrează'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Tokenurile personalizate au fost comentate deoarece trebuie actualizate la noul format introdus în versiunea 9.0.0 a pluginului.\n// Consultă documentația (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) pentru mai multe informații.',
      deprecated: {
        part1:
          'În versiunea 9.0.0 a pluginului, formatul de înregistrare a tokenurilor personalizate s-a schimbat. Actualizează tokenurile corespunzător. Consultă',
        part2: 'documentația',
        part3: 'pentru mai multe informații'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'În versiunea 9.0.0 a pluginului, această',
      part2: 'setare este depreciată. Folosește ',
      part3: 'formatul în schimb. Vezi',
      part4: 'documentația',
      part5: 'pentru mai multe informații'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Aveți o valoare potențial incorectă setată pentru',
        part2: 'format. Consultați',
        part3: 'documentația',
        part4: 'pentru mai multe informații.',
        part5: 'Acest mesaj nu va mai fi afișat.'
      }
    },
    specialCharacters: {
      part1: 'În versiunea 9.16.0 a pluginului,',
      part2: 'valoarea implicită a setării a fost schimbată. Valoarea voastră a fost actualizată la noua valoare implicită.'
    },
    validation: {
      invalidCustomTokensCode: 'Cod de token personalizat invalid',
      invalidRegularExpression: 'Expresie regulată invalidă {{regExp}}',
      specialCharactersMustNotContainSlash: 'Caracterele speciale nu trebuie să conțină /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'Înlocuirea caracterelor speciale nu trebuie să conțină caractere invalide de cale de fișier.'
    },
    version: {
      part1: 'Fișierul dvs. de setări ',
      part2: 'are versiunea',
      part3: 'care este mai nouă decât versiunea actuală a pluginului',
      part4: 'Pluginul ar putea să nu funcționeze corect. Actualizați pluginul la ultima versiune sau verificați dacă setările sunt corecte.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Când atașați fișiere:'
      },
      name: 'Mod de redenumire atașamente'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Când atașamentul colectat este folosit de mai multe notițe:'
      },
      name: 'Mod colectare atașamente folosite de mai multe notițe'
    },
    customTokens: {
      description: {
        part1: 'Tokenuri personalizate de utilizat.',
        part2: 'Vezi',
        part3: 'documentația',
        part4: 'pentru mai multe informații.',
        part5:
          '⚠️ Tokenurile personalizate pot conține cod JavaScript arbitrar. Dacă sunt scrise greșit, pot cauza pierderi de date. Folosiți-le pe propria răspundere.'
      },
      name: 'Tokenuri personalizate'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Când lipiți/tractați un fișier cu același nume ca un fișier existent, acest separator va fi adăugat la nume.',
        part2: 'De exemplu, când trageți fișierul',
        part3: ', va fi redenumit în ',
        part4: ', etc., folosind primul nume disponibil.'
      },
      name: 'Separator pentru nume duplicate'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Când dosarul de atașamente devine gol:'
      },
      name: 'Comportamentul dosarului de atașamente gol'
    },
    excludePaths: {
      description: {
        part1: 'Excludeți notițe din următoarele căi.',
        part2: 'Introduceți fiecare cale pe o linie nouă.',
        part3: 'Puteți folosi șir de cale sau',
        part4: 'Dacă setarea este goală, nicio notiță nu este exclusă.'
      },
      name: 'Excludere căi'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Excludeți atașamentele din următoarele căi când se execută comanda',
        part2: 'Colectează atașamente',
        part3: '.',
        part4: 'Introduceți fiecare cale pe o linie nouă.',
        part5: 'Puteți folosi șir de cale sau',
        part6: 'Dacă setarea este goală, nu se exclud căi din colectarea atașamentelor.'
      },
      name: 'Excludere căi pentru colectarea atașamentelor'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Vezi',
        part2: 'tokenuri disponibile'
      },
      name: 'Nume fișier atașament generat'
    },
    includePaths: {
      description: {
        part1: 'Includeți notițe din următoarele căi.',
        part2: 'Introduceți fiecare cale pe o linie nouă.',
        part3: 'Puteți folosi șir de cale sau',
        part4: 'Dacă setarea este goală, toate notițele sunt incluse.'
      },
      name: 'Includeți căi'
    },
    jpegQuality: {
      description: 'Cu cât calitatea este mai mică, cu atât rata de compresie este mai mare.',
      name: 'Calitate JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Începeți cu',
        part2: 'pentru a folosi cale relativă.',
        part3: 'Vezi',
        part4: 'tokenurile disponibile',
        part5: 'Dosare cu punct precum',
        part6: 'nu sunt recomandate, deoarece Obsidian nu le urmărește. Este posibil să fie nevoie să folosiți un',
        part7: 'plugin pentru a le gestiona.'
      },
      name: 'Locația pentru atașamente noi'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Formatul URL-ului care va fi inserat în Markdown.',
        part2: 'Vezi',
        part3: 'tokenurile disponibile',
        part4: 'Lăsați necompletat pentru a folosi formatul implicit.'
      },
      name: 'Format URL Markdown'
    },
    renameAttachmentsToLowerCase: 'Redenumește atașamentele cu litere mici',
    resetToSampleCustomTokens: {
      message: 'Sigur doriți să resetați tokenurile personalizate la tokenurile exemplu? Modificările dvs. vor fi pierdute.',
      title: 'Resetează la tokenuri exemplu'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Stabilește dacă imaginile lipite să fie convertite în JPEG. Se aplică numai când conținutul unei imagini PNG este lipit direct din clipboard. De obicei, pentru capturi de ecran.',
      name: 'Convertiți imaginile lipite în JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Dacă este activat, atunci când notița este ștearsă, atașamentele orfane vor fi și ele șterse.',
      name: 'Șterge atașamentele orfane'
    },
    shouldRenameAttachmentFiles: {
      description: 'Stabilește dacă fișierele atașament vor fi redenumite când o notiță este redenumită sau mutată.',
      name: 'Redenumește fișierele atașament'
    },
    shouldRenameAttachmentFolders: {
      description: 'Stabilește dacă dosarele de atașamente vor fi redenumite când o notiță este redenumită sau mutată.',
      name: 'Redenumește dosarele de atașament'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Dacă este activat, atașamentele procesate prin comenzile',
        part2: 'Colectează atașamente',
        part3: 'vor fi redenumite conform',
        part4: 'setării.'
      },
      name: 'Redenumește atașamentele colectate'
    },
    specialCharacters: {
      description: {
        part1: 'Caractere speciale în numele dosarului sau fișierului atașament care vor fi înlocuite sau eliminate.',
        part2: 'Lăsați gol pentru a le păstra.'
      },
      name: 'Caractere speciale'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Șir de înlocuire pentru caractere speciale în numele dosarului sau fișierului atașament.',
        part2: 'Lăsați gol pentru a elimina caracterele speciale.'
      },
      name: 'Înlocuire caractere speciale'
    },
    timeoutInSeconds: {
      description: {
        part1: 'Timpul limită în secunde pentru toate operațiile.',
        part2: 'Dacă',
        part3: 'este setat, timpul limită va fi dezactivat.'
      },
      name: 'Timp limită (secunde)'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Tratați fișierele cu aceste extensii ca atașamente.',
        part2: 'Implicit',
        part3: 'și',
        part4: 'fișierele legate nu sunt considerate atașamente și nu sunt mutate odată cu notița.',
        part5: 'Puteți adăuga extensii personalizate, de ex.',
        part6: ', pentru a înlocui acest comportament.'
      },
      name: 'Tratați ca extensii de atașamente'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Previzualizează fișierul atașat \'{{fullFileName}}\''
    },
    title: 'Furnizați o valoare pentru tokenul de prompt'
  },
  regularExpression: '/expresie regulată/'
};
