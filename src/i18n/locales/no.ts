import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const no: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Ønsker du å samle vedlegg for alle notater i mappen:',
      part2: 'og alle undermappene?',
      part3: 'Denne operasjonen kan ikke angres.'
    },
    progressBar: {
      message: 'Samler vedlegg {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Samler vedlegg...'
    }
  },
  buttons: {
    copy: 'Kopier',
    move: 'Flytt',
    previewAttachmentFile: 'Forhåndsvisning av vedleggsfil',
    skip: 'Hopp over'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Vedlegg',
      part2: 'refereres av flere notater.'
    },
    heading: 'Samler vedlegg brukt av flere notater',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Bør bruke samme handling for andre problematiske vedlegg'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Samle vedlegg i gjeldende mappe',
    collectAttachmentsCurrentNote: 'Samle vedlegg i gjeldende notat',
    collectAttachmentsEntireVault: 'Samle vedlegg i hele krypteret'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Samle vedlegg i mappe'
  },
  notice: {
    collectingAttachments: 'Samler vedlegg for \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Innsamling av vedlegg avbrutt. Se konsoll for detaljer.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Generert vedleggsfilnavn \'{{path}}\' er ugyldig.\n{{validationMessage}}\nSjekk din',
      part2: 'innstilling.'
    },
    notePathIsIgnored: 'Notatbane ignoreres'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Avbryt',
      ok: 'OK'
    },
    dataview: {
      itemsPerPage: 'Elementer per side:',
      jumpToPage: 'Gå til side:'
    },
    notices: {
      attachmentIsStillUsed: 'Vedlegg {{attachmentPath}} brukes fortsatt av andre notater. Det vil ikke bli slettet.',
      unhandledError: 'En uhåndtert feil oppstod. Vennligst sjekk konsollen for mer informasjon.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'alle filer omdøpes.',
        displayText: 'Alle'
      },
      none: {
        description: 'navnene deres bevares.',
        displayText: 'Ingen'
      },
      onlyPastedImages: {
        description:
          'bare innlimte bilder omdøpes. Gjelder bare når PNG-bildeinnhold limes inn fra utklippstavlen direkte. Vanligvis for å lime inn skjermbilder.',
        displayText: 'Bare innlimte bilder'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'avbryt vedleggsinnsamlingen.',
        displayText: 'Avbryt'
      },
      copy: {
        description: 'kopier vedlegget til den nye plasseringen.',
        displayText: 'Kopier'
      },
      move: {
        description: 'flytt vedlegget til den nye plasseringen.',
        displayText: 'Flytt'
      },
      prompt: {
        description: 'spør brukeren om å velge handlingen.',
        displayText: 'Spør'
      },
      skip: {
        description: 'hopp over vedlegget og gå videre til neste.',
        displayText: 'Hopp over'
      }
    },
    defaultImageSizeDimension: {
      height: 'Høyde',
      width: 'Bredde'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'vil slette den tomme vedleggsmappen.',
        displayText: 'Slett'
      },
      deleteWithEmptyParents: {
        description: 'vil slette den tomme vedleggsmappen og dens tomme overordnede mapper.',
        displayText: 'Slett med tomme overordnede'
      },
      keep: {
        description: 'vil beholde den tomme vedleggsmappen.',
        displayText: 'Behold'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Tilpassede tokens ble kommentert ut da de må oppdateres til det nye formatet introdusert i plugin versjon 9.0.0.\n// Se dokumentasjonen (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) for mer informasjon.',
      deprecated: {
        part1: 'I plugin versjon 9.0.0 endret formatet for tilpasset token-registrering. Vennligst oppdater tokens dine tilsvarende. Se',
        part2: 'dokumentasjonen',
        part3: 'for mer informasjon'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'I plugin versjon 9.0.0 er',
      part2: 'innstillingen utdatert. Bruk',
      part3: 'format i stedet. Se',
      part4: 'dokumentasjonen',
      part5: 'for mer informasjon'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Du har potensielt feil verdi satt for',
        part2: 'formatet. Vennligst se',
        part3: 'dokumentasjonen',
        part4: 'for mer informasjon.',
        part5: 'Denne meldingen vil ikke vises igjen.'
      }
    },
    specialCharacters: {
      part1: 'I plugin versjon 9.16.0 ble',
      part2: 'standard innstillingsverdi endret. Din innstillingsverdi ble oppdatert til den nye standardverdien.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'Standard bildestørrelse må være i piksler eller prosent',
      invalidCustomTokensCode: 'Ugyldig tilpasset tokens kode',
      invalidRegularExpression: 'Ugyldig regulært uttrykk {{regExp}}',
      specialCharactersMustNotContainSlash: 'Spesialtegn må ikke inneholde /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters: 'Spesialtegnerstatning må ikke inneholde ugyldige filnavn stibokstaver.'
    },
    version: {
      part1: 'Din innstillingsfil ',
      part2: 'har versjon',
      part3: 'som er nyere enn gjeldende plugin versjon',
      part4: 'Plugin-en fungerer kanskje ikke som forventet. Vennligst oppdater plugin-en til den nyeste versjonen eller sikre at innstillingene er korrekte.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Når du legger ved filer:'
      },
      name: 'Vedlegg omdøpingsmodus'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Når det innsamlede vedlegget brukes av flere notater:'
      },
      name: 'Samle vedlegg brukt av flere notater modus'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'Se tilgjengelige',
        part2: 'tokens'
      },
      name: 'Samlet vedleggsfilnavn'
    },
    customTokens: {
      description: {
        part1: 'Tilpassede tokens som skal brukes.',
        part2: 'Se',
        part3: 'dokumentasjonen',
        part4: 'for mer informasjon.',
        part5: '⚠️ Tilpassede tokens kan være vilkårlig JavaScript-kode. Hvis dårlig skrevet, kan det føre til tap av data. Bruk det på egen risiko.'
      },
      name: 'Tilpassede tokens'
    },
    defaultImageSize: {
      description: {
        part1: 'Standard bildestørrelse.',
        part2: 'Kan spesifiseres i piksler',
        part3: 'eller prosent av hele bildestørrelsen',
        part4: 'La stå tomt for å bruke original bildestørrelse.'
      },
      name: 'Standard bildestørrelse'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Når du limer inn/drar en fil med samme navn som en eksisterende fil, vil denne separatoren legges til filnavnet.',
        part2: 'F.eks., når du drar fil',
        part3: ', vil den omdøpes til ',
        part4: ', osv., og få det første tilgjengelige navnet.'
      },
      name: 'Duplikat navn separator'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Når vedleggsmappen blir tom:'
      },
      name: 'Tom vedleggsmappe oppførsel'
    },
    excludePaths: {
      description: {
        part1: 'Ekskluder notater fra følgende stier.',
        part2: 'Sett inn hver sti på en ny linje.',
        part3: 'Du kan bruke stistreng eller',
        part4: 'Hvis innstillingen er tom, ekskluderes ingen notater.'
      },
      name: 'Ekskluderte stier'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Ekskluder vedlegg fra følgende stier når',
        part2: 'Samle vedlegg',
        part3: 'kommando utføres.',
        part4: 'Sett inn hver sti på en ny linje.',
        part5: 'Du kan bruke stistreng eller',
        part6: 'Hvis innstillingen er tom, ekskluderes ingen stier fra vedleggsinnsamling.'
      },
      name: 'Ekskluder stier fra vedleggsinnsamling'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Se tilgjengelige',
        part2: 'tokens'
      },
      name: 'Generert vedleggsfilnavn'
    },
    includePaths: {
      description: {
        part1: 'Inkluder notater fra følgende stier.',
        part2: 'Sett inn hver sti på en ny linje.',
        part3: 'Du kan bruke stistreng eller',
        part4: 'Hvis innstillingen er tom, inkluderes alle notater.'
      },
      name: 'Inkluderte stier'
    },
    jpegQuality: {
      description: 'Jo mindre kvalitet, jo større komprimeringsforhold.',
      name: 'JPEG Kvalitet'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Start med',
        part2: 'for å bruke relativ sti.',
        part3: 'Se tilgjengelige',
        part4: 'tokens.',
        part5: 'Punktmapper som',
        part6: 'anbefales ikke, fordi Obsidian ikke sporer dem. Du må kanskje bruke',
        part7: 'Plugin for å administrere dem.'
      },
      name: 'Plassering for nye vedlegg'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Format for URL-en som vil bli satt inn i Markdown.',
        part2: 'Se tilgjengelige',
        part3: 'tokens.',
        part4: 'La stå tom for å bruke standardformatet.'
      },
      name: 'Markdown URL format'
    },
    renameAttachmentsToLowerCase: 'Omdøp vedlegg til små bokstaver',
    renamedAttachmentFileName: {
      description: {
        part1: 'Se tilgjengelige',
        part2: 'tokens'
      },
      name: 'Omdøpt vedleggsfilnavn'
    },
    resetToSampleCustomTokens: {
      message: 'Er du sikker på at du vil tilbakestille de tilpassede tokens til eksempel tilpassede tokens? Endringene dine vil gå tapt.',
      title: 'Tilbakestill til eksempel tilpassede tokens'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Om innlimte bilder skal konverteres til JPEG. Gjelder bare når PNG-bildeinnhold limes inn fra utklippstavlen direkte. Vanligvis for å lime inn skjermbilder.',
      name: 'Skal konvertere innlimte bilder til JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Hvis aktivert, når notatet slettes, slettes også dets forældreløse vedlegg.',
      name: 'Skal slette forældreløse vedlegg'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'Hvis aktivert, når et notat omdøpes eller flyttes, vil vedleggene bli omdøpt i henhold til',
        part2: 'innstillingen.'
      },
      name: 'Skal omdøpe vedleggsfiler'
    },
    shouldRenameAttachmentFolders: {
      description: 'Om vedleggsmapper skal omdøpes når et notat omdøpes eller flyttes.',
      name: 'Skal omdøpe vedleggsmapper'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Hvis aktivert, vedlegg behandlet via',
        part2: 'Samle vedlegg',
        part3: 'kommandoer vil omdøpes i henhold til',
        part4: 'innstillingen.'
      },
      name: 'Skal omdøpe innsamlede vedlegg'
    },
    specialCharacters: {
      description: {
        part1: 'Spesialtegn i vedleggsmappe og filnavn som skal erstattes eller fjernes.',
        part2: 'La stå tom for å bevare spesialtegn.'
      },
      name: 'Spesialtegn'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Erstatningsstreng for spesialtegn i vedleggsmappe og filnavn.',
        part2: 'La stå tom for å fjerne spesialtegn.'
      },
      name: 'Spesialtegnerstatning'
    },
    timeoutInSeconds: {
      description: {
        part1: 'Tidsavbrudd i sekunder for alle operasjoner.',
        part2: 'Hvis',
        part3: 'er satt, er tidsavbrudd for operasjonsutførelse deaktivert.'
      },
      name: 'Tidsavbrudd i sekunder'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Behandle filer med disse utvidelsene som vedlegg.',
        part2: 'Som standard',
        part3: 'og',
        part4: 'lenkede filer behandles ikke som vedlegg og flyttes ikke med notatet.',
        part5: 'Du kan legge til tilpassede utvidelser, f.eks.',
        part6: ', for å overstyre denne oppførselen.'
      },
      name: 'Behandle som vedleggsutvidelser'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Forhåndsvisning av vedleggsfil \'{{fullFileName}}\''
    },
    title: 'Oppgi en verdi for prompt token'
  },
  regularExpression: '/regulært uttrykk/'
};
