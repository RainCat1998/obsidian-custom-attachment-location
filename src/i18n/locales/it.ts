import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const it: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Vuoi raccogliere gli allegati per tutte le note nella cartella:',
      part2: 'e tutte le sue sottocartelle?',
      part3: 'Questa operazione non può essere annullata.'
    },
    progressBar: {
      message: 'Raccolta allegati {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Raccolta allegati...'
    }
  },
  buttons: {
    copy: 'Copia',
    move: 'Sposta',
    previewAttachmentFile: 'Anteprima file allegato',
    skip: 'Salta'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'L\'allegato',
      part2: 'è referenziato da più note.'
    },
    heading: 'Raccolta allegato usato da più note',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Dovresti usare la stessa azione per altri allegati problematici'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Raccogli allegati nella cartella corrente',
    collectAttachmentsCurrentNote: 'Raccogli allegati nella nota corrente',
    collectAttachmentsEntireVault: 'Raccogli allegati nell\'intero vault'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Raccogli allegati nella cartella'
  },
  notice: {
    collectingAttachments: 'Raccolta allegati per \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Raccolta allegati annullata. Consulta la console per i dettagli.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Il nome file allegato generato \'{{path}}\' non è valido.\n{{validationMessage}}\nControlla le tue',
      part2: 'impostazioni.'
    },
    notePathIsIgnored: 'Il percorso della nota è ignorato'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Annulla',
      ok: 'OK'
    },
    dataview: {
      itemsPerPage: 'Elementi per pagina:',
      jumpToPage: 'Vai alla pagina:'
    },
    notices: {
      attachmentIsStillUsed: 'L\'allegato {{attachmentPath}} è ancora in uso da altre note. Non sarà eliminato.',
      unhandledError: 'Si è verificato un errore non gestito. Controlla la console per ulteriori informazioni.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'tutti i file vengono rinominati.',
        displayText: 'Tutti'
      },
      none: {
        description: 'i loro nomi vengono preservati.',
        displayText: 'Nessuno'
      },
      onlyPastedImages: {
        description:
          'solo le immagini incollate vengono rinominate. Si applica solo quando il contenuto dell\'immagine PNG viene incollato direttamente dagli appunti. Tipicamente, per incollare screenshot.',
        displayText: 'Solo immagini incollate'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'annulla la raccolta allegati.',
        displayText: 'Annulla'
      },
      copy: {
        description: 'copia l\'allegato nella nuova posizione.',
        displayText: 'Copia'
      },
      move: {
        description: 'sposta l\'allegato nella nuova posizione.',
        displayText: 'Sposta'
      },
      prompt: {
        description: 'chiedi all\'utente di scegliere l\'azione.',
        displayText: 'Richiedi'
      },
      skip: {
        description: 'salta l\'allegato e procedi al successivo.',
        displayText: 'Salta'
      }
    },
    defaultImageSizeDimension: {
      height: 'Altezza',
      width: 'Larghezza'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'eliminerà la cartella allegati vuota.',
        displayText: 'Elimina'
      },
      deleteWithEmptyParents: {
        description: 'eliminerà la cartella allegati vuota e le sue cartelle padre vuote.',
        displayText: 'Elimina con genitori vuoti'
      },
      keep: {
        description: 'manterrà la cartella allegati vuota.',
        displayText: 'Mantieni'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// I token personalizzati sono stati commentati poiché devono essere aggiornati al nuovo formato introdotto nella versione 9.0.0 del plugin.\n// Consulta la documentazione (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) per maggiori informazioni.',
      deprecated: {
        part1:
          'Nella versione 9.0.0 del plugin, il formato di registrazione dei token personalizzati è cambiato. Aggiorna i tuoi token di conseguenza. Consulta la',
        part2: 'documentazione',
        part3: 'per maggiori informazioni'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'Nella versione 9.0.0 del plugin, l\'impostazione',
      part2: 'è deprecata. Usa il',
      part3: 'formato invece. Vedi la',
      part4: 'documentazione',
      part5: 'per maggiori informazioni'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Hai potenzialmente impostato un valore errato per il',
        part2: 'formato. Consulta la',
        part3: 'documentazione',
        part4: 'per maggiori informazioni',
        part5: 'Questo messaggio non verrà più mostrato.'
      }
    },
    specialCharacters: {
      part1: 'Nella versione 9.16.0 del plugin, il',
      part2: 'valore predefinito dell\'impostazione è stato modificato. Il tuo valore è stato aggiornato al nuovo valore predefinito.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'La dimensione predefinita dell\'immagine deve essere in pixel o percentuale',
      invalidCustomTokensCode: 'Codice token personalizzati non valido',
      invalidRegularExpression: 'Espressione regolare non valida {{regExp}}',
      specialCharactersMustNotContainSlash: 'I caratteri speciali non devono contenere /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'La sostituzione dei caratteri speciali non deve contenere caratteri di percorso nome file non validi.'
    },
    version: {
      part1: 'Il tuo file delle impostazioni ',
      part2: 'ha la versione',
      part3: 'che è più recente della versione corrente del plugin',
      part4: 'Il plugin potrebbe non funzionare come previsto. Aggiorna il plugin all\'ultima versione o assicurati che le impostazioni siano corrette.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Quando si allegano file:'
      },
      name: 'Modalità rinomina allegati'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Quando l\'allegato raccolto è usato da più note:'
      },
      name: 'Modalità raccolta allegato usato da più note'
    },
    customTokens: {
      description: {
        part1: 'Token personalizzati da utilizzare.',
        part2: 'Vedi',
        part3: 'documentazione',
        part4: 'per maggiori informazioni.',
        part5: '⚠️ I token personalizzati possono essere codice JavaScript arbitrario. Se scritti male, possono causare perdita di dati. Usali a tuo rischio.'
      },
      name: 'Token personalizzati'
    },
    defaultImageSize: {
      description: {
        part1: 'Dimensione predefinita dell\'immagine.',
        part2: 'Può essere specificata in pixel',
        part3: 'o come percentuale della dimensione totale dell\'immagine',
        part4: 'Lasciare vuoto per usare la dimensione originale.'
      },
      name: 'Dimensione immagine predefinita'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Quando incolli/trascini un file con lo stesso nome di un file esistente, questo separatore verrà aggiunto al nome del file.',
        part2: 'Ad es., quando trascini il file',
        part3: ', verrà rinominato in ',
        part4: ', ecc, ottenendo il primo nome disponibile.'
      },
      name: 'Separatore nome duplicato'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Quando la cartella allegati diventa vuota:'
      },
      name: 'Comportamento cartella allegati vuota'
    },
    excludePaths: {
      description: {
        part1: 'Escludi note dai seguenti percorsi.',
        part2: 'Inserisci ogni percorso su una nuova riga.',
        part3: 'Puoi usare stringa percorso o',
        part4: 'Se l\'impostazione è vuota, nessuna nota viene esclusa.'
      },
      name: 'Percorsi esclusi'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Escludi allegati dai seguenti percorsi quando il comando',
        part2: 'Raccogli allegati',
        part3: 'viene eseguito.',
        part4: 'Inserisci ogni percorso su una nuova riga.',
        part5: 'Puoi usare stringa percorso o',
        part6: 'Se l\'impostazione è vuota, nessun percorso viene escluso dalla raccolta allegati.'
      },
      name: 'Percorsi esclusi dalla raccolta allegati'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Vedi',
        part2: 'token disponibili'
      },
      name: 'Nome file allegato generato'
    },
    includePaths: {
      description: {
        part1: 'Includi note dai seguenti percorsi.',
        part2: 'Inserisci ogni percorso su una nuova riga.',
        part3: 'Puoi usare stringa percorso o',
        part4: 'Se l\'impostazione è vuota, tutte le note vengono incluse.'
      },
      name: 'Percorsi inclusi'
    },
    jpegQuality: {
      description: 'Più piccola è la qualità, maggiore è il rapporto di compressione.',
      name: 'Qualità JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Inizia con',
        part2: 'per usare percorso relativo.',
        part3: 'Vedi',
        part4: 'token disponibili',
        part5: 'Cartelle punto come',
        part6: 'non sono raccomandate, perché Obsidian non le traccia. Potresti aver bisogno di usare',
        part7: 'Plugin per gestirle.'
      },
      name: 'Posizione per nuovi allegati'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Formato per l\'URL che sarà inserito in Markdown.',
        part2: 'Vedi',
        part3: 'token disponibili',
        part4: 'Lascia vuoto per usare il formato predefinito.'
      },
      name: 'Formato URL Markdown'
    },
    renameAttachmentsToLowerCase: 'Rinomina allegati in minuscolo',
    resetToSampleCustomTokens: {
      message: 'Sei sicuro di voler ripristinare i token personalizzati ai token personalizzati di esempio? Le tue modifiche andranno perse.',
      title: 'Ripristina ai token personalizzati di esempio'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Se convertire le immagini incollate in JPEG. Si applica solo quando il contenuto dell\'immagine PNG viene incollato direttamente dagli appunti. Tipicamente, per incollare screenshot.',
      name: 'Converti immagini incollate in JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Se abilitato, quando la nota viene eliminata, anche i suoi allegati orfani vengono eliminati.',
      name: 'Elimina allegati orfani'
    },
    shouldRenameAttachmentFiles: {
      description: 'Se rinominare i file allegati quando una nota viene rinominata o spostata.',
      name: 'Rinomina file allegati'
    },
    shouldRenameAttachmentFolders: {
      description: 'Se rinominare le cartelle allegati quando una nota viene rinominata o spostata.',
      name: 'Rinomina cartelle allegati'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Se abilitato, gli allegati elaborati tramite',
        part2: 'Raccogli allegati',
        part3: 'verranno rinominati secondo l\'impostazione',
        part4: '.'
      },
      name: 'Rinomina allegati raccolti'
    },
    specialCharacters: {
      description: {
        part1: 'Caratteri speciali nel nome cartella e file allegato da sostituire o rimuovere.',
        part2: 'Lascia vuoto per preservare i caratteri speciali.'
      },
      name: 'Caratteri speciali'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Stringa di sostituzione per caratteri speciali nel nome cartella e file allegato.',
        part2: 'Lascia vuoto per rimuovere i caratteri speciali.'
      },
      name: 'Sostituzione caratteri speciali'
    },
    timeoutInSeconds: {
      description: {
        part1: 'Il timeout in secondi per tutte le operazioni.',
        part2: 'Se',
        part3: 'è impostato, il timeout di esecuzione delle operazioni è disabilitato.'
      },
      name: 'Timeout in secondi'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Tratta i file con queste estensioni come allegati.',
        part2: 'Per impostazione predefinita',
        part3: 'e',
        part4: 'i file collegati non sono trattati come allegati e non vengono spostati con la nota.',
        part5: 'Puoi aggiungere estensioni personalizzate, ad es.',
        part6: ', per sovrascrivere questo comportamento.'
      },
      name: 'Tratta come estensioni allegati'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Anteprima file allegato \'{{fullFileName}}\''
    },
    title: 'Fornisci un valore per il token prompt'
  },
  regularExpression: '/espressione regolare/'
};
