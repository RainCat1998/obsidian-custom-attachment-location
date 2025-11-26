import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const nl: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Wil je bijlagen verzamelen voor alle notities in de map:',
      part2: 'en al zijn submappen?',
      part3: 'Deze bewerking kan niet ongedaan worden gemaakt.'
    },
    progressBar: {
      message: 'Bijlagen verzamelen {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Bijlagen verzamelen...'
    }
  },
  buttons: {
    copy: 'Kopiëren',
    move: 'Verplaatsen',
    previewAttachmentFile: 'Voorvertoning bijlagebestand',
    skip: 'Overslaan'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Bijlage',
      part2: 'wordt gebruikt door meerdere notities.'
    },
    heading: 'Bijlage verzamelen die door meerdere notities wordt gebruikt',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Dezelfde actie gebruiken voor andere problematische bijlagen'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Bijlagen verzamelen in huidige map',
    collectAttachmentsCurrentNote: 'Bijlagen verzamelen in huidige notitie',
    collectAttachmentsEntireVault: 'Bijlagen verzamelen in hele kluis'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Bijlagen verzamelen in map'
  },
  notice: {
    collectingAttachments: 'Bijlagen verzamelen voor \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Bijlagen verzamelen geannuleerd. Zie console voor details.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Gegenereerde bijlage bestandsnaam \'{{path}}\' is ongeldig.\n{{validationMessage}}\nControleer je',
      part2: 'instellingen.'
    },
    notePathIsIgnored: 'Notitie pad wordt genegeerd'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Annuleren',
      ok: 'OK'
    },
    dataview: {
      itemsPerPage: 'Items per pagina:',
      jumpToPage: 'Ga naar pagina:'
    },
    notices: {
      attachmentIsStillUsed: 'Bijlage {{attachmentPath}} wordt nog steeds gebruikt door andere notities. Deze wordt niet verwijderd.',
      unhandledError: 'Er is een onverwerkte fout opgetreden. Controleer de console voor meer informatie.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'alle bestanden worden hernoemd.',
        displayText: 'Alle'
      },
      none: {
        description: 'hun namen worden behouden.',
        displayText: 'Geen'
      },
      onlyPastedImages: {
        description:
          'alleen geplakte afbeeldingen worden hernoemd. Geldt alleen wanneer PNG afbeeldingsinhoud direct vanuit het klembord wordt geplakt. Meestal voor het plakken van screenshots.',
        displayText: 'Alleen geplakte afbeeldingen'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'annuleer het verzamelen van bijlagen.',
        displayText: 'Annuleren'
      },
      copy: {
        description: 'kopieer de bijlage naar de nieuwe locatie.',
        displayText: 'Kopiëren'
      },
      move: {
        description: 'verplaats de bijlage naar de nieuwe locatie.',
        displayText: 'Verplaatsen'
      },
      prompt: {
        description: 'vraag de gebruiker om de actie te kiezen.',
        displayText: 'Vragen'
      },
      skip: {
        description: 'sla de bijlage over en ga door naar de volgende.',
        displayText: 'Overslaan'
      }
    },
    defaultImageSizeDimension: {
      height: 'Hoogte',
      width: 'Breedte'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'zal de lege bijlagenmap verwijderen.',
        displayText: 'Verwijderen'
      },
      deleteWithEmptyParents: {
        description: 'zal de lege bijlagenmap en zijn lege bovenliggende mappen verwijderen.',
        displayText: 'Verwijderen met lege bovenliggende mappen'
      },
      keep: {
        description: 'zal de lege bijlagenmap behouden.',
        displayText: 'Behouden'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Aangepaste tokens zijn uitgecommentarieerd omdat ze moeten worden bijgewerkt naar het nieuwe formaat geïntroduceerd in plugin versie 9.0.0.\n// Raadpleeg de documentatie (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) voor meer informatie.',
      deprecated: {
        part1: 'In plugin versie 9.0.0 is het formaat van aangepaste token registratie veranderd. Werk je tokens dienovereenkomstig bij. Raadpleeg de',
        part2: 'documentatie',
        part3: 'voor meer informatie'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'In plugin versie 9.0.0 is de',
      part2: 'instelling verouderd. Gebruik in plaats daarvan het',
      part3: 'formaat. Zie de',
      part4: 'documentatie',
      part5: 'voor meer informatie'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Je hebt mogelijk een onjuiste waarde ingesteld voor het',
        part2: 'formaat. Raadpleeg de',
        part3: 'documentatie',
        part4: 'voor meer informatie.',
        part5: 'Dit bericht wordt niet meer getoond.'
      }
    },
    specialCharacters: {
      part1: 'In plugin versie 9.16.0 is de',
      part2: 'standaard instellingswaarde veranderd. Je instellingswaarde is bijgewerkt naar de nieuwe standaardwaarde.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'De standaardafmeting van de afbeelding moet in pixels of procenten zijn',
      invalidCustomTokensCode: 'Ongeldige aangepaste tokens code',
      invalidRegularExpression: 'Ongeldige reguliere expressie {{regExp}}',
      specialCharactersMustNotContainSlash: 'Speciale karakters mogen geen / bevatten',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'Speciale karakter vervanging mag geen ongeldige bestandsnaam pad karakters bevatten.'
    },
    version: {
      part1: 'Je instellingenbestand ',
      part2: 'heeft versie',
      part3: 'wat nieuwer is dan de huidige plugin versie',
      part4: 'De plugin werkt mogelijk niet zoals verwacht. Werk de plugin bij naar de nieuwste versie of zorg ervoor dat de instellingen correct zijn.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Bij het bijvoegen van bestanden:'
      },
      name: 'Bijlage hernoem modus'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Wanneer de verzamelde bijlage wordt gebruikt door meerdere notities:'
      },
      name: 'Verzamel bijlage gebruikt door meerdere notities modus'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'Zie beschikbare',
        part2: 'tokens'
      },
      name: 'Verzamelde bijlage bestandsnaam'
    },
    customTokens: {
      description: {
        part1: 'Aangepaste tokens om te gebruiken.',
        part2: 'Zie de',
        part3: 'documentatie',
        part4: 'voor meer informatie.',
        part5:
          '⚠️ Aangepaste tokens kunnen willekeurige JavaScript code zijn. Als ze slecht geschreven zijn, kunnen ze gegevensverlies veroorzaken. Gebruik ze op eigen risico.'
      },
      name: 'Aangepaste tokens'
    },
    defaultImageSize: {
      description: {
        part1: 'De standaardafmeting van de afbeelding.',
        part2: 'Kan worden opgegeven in pixels',
        part3: 'of als percentage van de volledige afbeeldingsgrootte',
        part4: 'Laat leeg om de originele afbeeldingsgrootte te gebruiken.'
      },
      name: 'Standaardafmeting afbeelding'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Wanneer je een bestand plakt/sleept met dezelfde naam als een bestaand bestand, wordt deze scheidingsteken toegevoegd aan de bestandsnaam.',
        part2: 'Bijv., wanneer je bestand sleept',
        part3: ', wordt het hernoemd naar ',
        part4: ', etc., waarbij de eerste beschikbare naam wordt gebruikt.'
      },
      name: 'Dubbele naam scheidingsteken'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Wanneer de bijlagenmap leeg wordt:'
      },
      name: 'Lege bijlagenmap gedrag'
    },
    excludePaths: {
      description: {
        part1: 'Sluit notities uit van de volgende paden.',
        part2: 'Voeg elk pad toe op een nieuwe regel.',
        part3: 'Je kunt pad string of',
        part4: 'gebruiken. Als de instelling leeg is, worden geen notities uitgesloten.'
      },
      name: 'Uitgesloten paden'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Sluit bijlagen uit van de volgende paden wanneer het',
        part2: 'Verzamel bijlagen',
        part3: 'commando wordt uitgevoerd.',
        part4: 'Voeg elk pad toe op een nieuwe regel.',
        part5: 'Je kunt pad string of',
        part6: 'gebruiken. Als de instelling leeg is, worden geen paden uitgesloten van bijlage verzamelen.'
      },
      name: 'Uitgesloten paden van bijlage verzamelen'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Zie beschikbare',
        part2: 'tokens'
      },
      name: 'Gegenereerde bijlage bestandsnaam'
    },
    includePaths: {
      description: {
        part1: 'Voeg notities toe van de volgende paden.',
        part2: 'Voeg elk pad toe op een nieuwe regel.',
        part3: 'Je kunt pad string of',
        part4: 'gebruiken. Als de instelling leeg is, worden alle notities opgenomen.'
      },
      name: 'Opgenomen paden'
    },
    jpegQuality: {
      description: 'Hoe kleiner de kwaliteit, hoe groter de compressieverhouding.',
      name: 'JPEG Kwaliteit'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Begin met',
        part2: 'om relatief pad te gebruiken.',
        part3: 'Zie beschikbare',
        part4: 'tokens.',
        part5: 'Dot-mappen zoals',
        part6: 'worden niet aanbevolen, omdat Obsidian ze niet volgt. Je moet mogelijk de',
        part7: 'Plugin gebruiken om ze te beheren.'
      },
      name: 'Locatie voor nieuwe bijlagen'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Formaat voor de URL die in Markdown wordt ingevoegd.',
        part2: 'Zie beschikbare',
        part3: 'tokens.',
        part4: 'Laat leeg om het standaard formaat te gebruiken.'
      },
      name: 'Markdown URL formaat'
    },
    renameAttachmentsToLowerCase: 'Hernoem bijlagen naar kleine letters',
    renamedAttachmentFileName: {
      description: {
        part1: 'Zie beschikbare',
        part2: 'tokens'
      },
      name: 'Hernoemde bijlage bestandsnaam'
    },
    resetToSampleCustomTokens: {
      message: 'Weet je zeker dat je de aangepaste tokens wilt resetten naar de voorbeeld aangepaste tokens? Je wijzigingen gaan verloren.',
      title: 'Reset naar voorbeeld aangepaste tokens'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Of geplakte afbeeldingen moeten worden geconverteerd naar JPEG. Geldt alleen wanneer PNG afbeeldingsinhoud direct vanuit het klembord wordt geplakt. Meestal voor het plakken van screenshots.',
      name: 'Moet geplakte afbeeldingen converteren naar JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Indien ingeschakeld, wanneer de notitie wordt verwijderd, worden ook de wees bijlagen verwijderd.',
      name: 'Moet wees bijlagen verwijderen'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'Indien ingeschakeld, wanneer een notitie wordt hernoemd of verplaatst, worden de bijlagen hernoemd volgens de',
        part2: 'instelling.'
      },
      name: 'Moet bijlage bestanden hernoemen'
    },
    shouldRenameAttachmentFolders: {
      description: 'Of bijlage mappen moeten worden hernoemd wanneer een notitie wordt hernoemd of verplaatst.',
      name: 'Moet bijlage mappen hernoemen'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Indien ingeschakeld, bijlagen verwerkt via',
        part2: 'Verzamel bijlagen',
        part3: 'commando\'s worden hernoemd volgens de',
        part4: 'instelling.'
      },
      name: 'Moet verzamelde bijlagen hernoemen'
    },
    specialCharacters: {
      description: {
        part1: 'Speciale karakters in bijlage map en bestandsnaam die moeten worden vervangen of verwijderd.',
        part2: 'Laat leeg om speciale karakters te behouden.'
      },
      name: 'Speciale karakters'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Vervangingsstring voor speciale karakters in bijlage map en bestandsnaam.',
        part2: 'Laat leeg om speciale karakters te verwijderen.'
      },
      name: 'Speciale karakters vervanging'
    },
    timeoutInSeconds: {
      description: {
        part1: 'De timeout in seconden voor alle bewerkingen.',
        part2: 'Als',
        part3: 'is ingesteld, is de uitvoeringstimeout van bewerkingen uitgeschakeld.'
      },
      name: 'Timeout in seconden'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Behandel bestanden met deze extensies als bijlagen.',
        part2: 'Standaard worden',
        part3: 'en',
        part4: 'gelinkte bestanden niet behandeld als bijlagen en worden niet verplaatst met de notitie.',
        part5: 'Je kunt aangepaste extensies toevoegen, bijv.',
        part6: ', om dit gedrag te overschrijven.'
      },
      name: 'Behandel als bijlage extensies'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Voorvertoning bijlage bestand \'{{fullFileName}}\''
    },
    title: 'Geef een waarde voor de prompt token'
  },
  regularExpression: '/reguliere expressie/'
};
