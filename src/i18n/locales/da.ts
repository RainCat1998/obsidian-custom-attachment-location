import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const da: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Vil du samle vedhæftninger for alle noter i mappen:',
      part2: 'og alle dens undermapper?',
      part3: 'Denne operation kan ikke fortrydes.'
    },
    progressBar: {
      message: 'Samler vedhæftninger {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Samler vedhæftninger...'
    }
  },
  buttons: {
    copy: 'Kopier',
    move: 'Flyt',
    previewAttachmentFile: 'Forhåndsvis vedhæftningsfil',
    skip: 'Spring over'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Vedhæftning',
      part2: 'refereres af flere noter.'
    },
    heading: 'Samler vedhæftning brugt af flere noter',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Skal bruge samme handling for andre problematiske vedhæftninger'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Saml vedhæftninger i nuværende mappe',
    collectAttachmentsCurrentNote: 'Saml vedhæftninger i nuværende note',
    collectAttachmentsEntireVault: 'Saml vedhæftninger i hele vault'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Saml vedhæftninger i mappe'
  },
  notice: {
    collectingAttachments: 'Samler vedhæftninger for \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Samling af vedhæftninger annulleret. Se konsol for detaljer.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Genereret vedhæftningsfilnavn \'{{path}}\' er ugyldigt.\n{{validationMessage}}\nTjek din',
      part2: 'indstilling.'
    },
    notePathIsIgnored: 'Notesti er ignoreret'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Annuller',
      ok: 'OK'
    },
    dataview: {
      itemsPerPage: 'Elementer per side:',
      jumpToPage: 'Hop til side:'
    },
    notices: {
      attachmentIsStillUsed: 'Vedhæftning {{attachmentPath}} bruges stadig af andre noter. Den vil ikke blive slettet.',
      unhandledError: 'Der opstod en ubehandlet fejl. Tjek venligst konsollen for flere oplysninger.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'alle filer omdøbes.',
        displayText: 'Alle'
      },
      none: {
        description: 'deres navne bevares.',
        displayText: 'Ingen'
      },
      onlyPastedImages: {
        description:
          'kun indsatte billeder omdøbes. Gælder kun når PNG-billedindholdet indsættes direkte fra udklipsholderen. Typisk til indsættelse af skærmbilleder.',
        displayText: 'Kun indsatte billeder'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'annuller samling af vedhæftninger.',
        displayText: 'Annuller'
      },
      copy: {
        description: 'kopier vedhæftningen til den nye placering.',
        displayText: 'Kopier'
      },
      move: {
        description: 'flyt vedhæftningen til den nye placering.',
        displayText: 'Flyt'
      },
      prompt: {
        description: 'bed brugeren om at vælge handlingen.',
        displayText: 'Anmodning'
      },
      skip: {
        description: 'spring vedhæftningen over og fortsæt til den næste.',
        displayText: 'Spring over'
      }
    },
    defaultImageSizeDimension: {
      height: 'Højde',
      width: 'Bredde'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'vil slette den tomme vedhæftningsmappe.',
        displayText: 'Slet'
      },
      deleteWithEmptyParents: {
        description: 'vil slette den tomme vedhæftningsmappe og dens tomme overordnede mapper.',
        displayText: 'Slet med tomme overordnede'
      },
      keep: {
        description: 'vil bevare den tomme vedhæftningsmappe.',
        displayText: 'Bevar'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Brugerdefinerede tokens blev kommenteret ud, da de skal opdateres til det nye format introduceret i plugin version 9.0.0.\n// Se dokumentationen (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) for flere oplysninger.',
      deprecated: {
        part1: 'I plugin version 9.0.0 ændrede formatet for brugerdefineret token-registrering sig. Opdater venligst dine tokens i overensstemmelse hermed. Se',
        part2: 'dokumentationen',
        part3: 'for flere oplysninger'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'I plugin version 9.0.0 er',
      part2: 'indstillingen forældet. Brug',
      part3: 'format i stedet. Se',
      part4: 'dokumentationen',
      part5: 'for flere oplysninger'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Du har potentielt forkert værdi sat for',
        part2: 'formatet. Se venligst',
        part3: 'dokumentationen',
        part4: 'for flere oplysninger',
        part5: 'Denne besked vil ikke blive vist igen.'
      }
    },
    specialCharacters: {
      part1: 'I plugin version 9.16.0 blev',
      part2: 'standardindstillingsværdien ændret. Din indstillingsværdi blev opdateret til den nye standardværdi.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'Standardbilledstørrelsen skal angives i pixels eller procent',
      invalidCustomTokensCode: 'Ugyldig brugerdefineret tokens-kode',
      invalidRegularExpression: 'Ugyldigt regulært udtryk {{regExp}}',
      specialCharactersMustNotContainSlash: 'Særlige tegn må ikke indeholde /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters: 'Erstatning af særlige tegn må ikke indeholde ugyldige filnavnsti-tegn.'
    },
    version: {
      part1: 'Din indstillingsfil ',
      part2: 'har version',
      part3: 'som er nyere end den nuværende plugin-version',
      part4: 'Pluginet fungerer muligvis ikke som forventet. Opdater venligst pluginet til den seneste version eller sørg for, at indstillingerne er korrekte.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Når der vedhæftes filer:'
      },
      name: 'Vedhæftningsomdøbningstilstand'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Når den samlede vedhæftning bruges af flere noter:'
      },
      name: 'Saml vedhæftning brugt af flere noter tilstand'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'Se tilgængelige',
        part2: 'tokens',
        part3: 'Lad stå tomt for at bruge',
        part4: 'indstillingen i stedet.'
      },
      name: 'Samlet vedhæftningsfilnavn'
    },
    customTokens: {
      description: {
        part1: 'Brugerdefinerede tokens der skal bruges.',
        part2: 'Se',
        part3: 'dokumentationen',
        part4: 'for flere oplysninger.',
        part5: '⚠️ Brugerdefinerede tokens kan være vilkårlig JavaScript-kode. Hvis de er dårligt skrevet, kan de forårsage datatab. Brug dem på egen risiko.'
      },
      name: 'Brugerdefinerede tokens'
    },
    defaultImageSize: {
      description: {
        part1: 'Standardbilledstørrelsen.',
        part2: 'Kan angives i pixels',
        part3: 'eller i procent af den fulde billedstørrelse',
        part4: 'Lad stå tomt for at bruge den originale billedstørrelse.'
      },
      name: 'Standardbilledstørrelse'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Når du indsætter/trækker en fil med samme navn som en eksisterende fil, vil denne separator blive tilføjet til filnavnet.',
        part2: 'F.eks., når du trækker fil',
        part3: ', vil den blive omdøbt til',
        part4: ', osv., og få det første tilgængelige navn.'
      },
      name: 'Duplikatnavnseparator'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Når vedhæftningsmappen bliver tom:'
      },
      name: 'Tom vedhæftningsmappeadfærd'
    },
    excludePaths: {
      description: {
        part1: 'Udeluk noter fra følgende stier.',
        part2: 'Indsæt hver sti på en ny linje.',
        part3: 'Du kan bruge stistreng eller',
        part4: 'Hvis indstillingen er tom, udelukkes ingen noter.'
      },
      name: 'Udeluk stier'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Udeluk vedhæftninger fra følgende stier når',
        part2: 'Saml vedhæftninger',
        part3: 'kommandoen udføres.',
        part4: 'Indsæt hver sti på en ny linje.',
        part5: 'Du kan bruge stistreng eller',
        part6: 'Hvis indstillingen er tom, udelukkes ingen stier fra vedhæftningssamling.'
      },
      name: 'Udeluk stier fra vedhæftningssamling'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Se tilgængelige',
        part2: 'tokens'
      },
      name: 'Genereret vedhæftningsfilnavn'
    },
    includePaths: {
      description: {
        part1: 'Inkluder noter fra følgende stier.',
        part2: 'Indsæt hver sti på en ny linje.',
        part3: 'Du kan bruge stistreng eller',
        part4: 'Hvis indstillingen er tom, inkluderes alle noter.'
      },
      name: 'Inkluder stier'
    },
    jpegQuality: {
      description: 'Jo mindre kvaliteten, jo større kompressionsforhold.',
      name: 'JPEG-kvalitet'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Start med',
        part2: 'for at bruge relativ sti.',
        part3: 'Se tilgængelige',
        part4: 'tokens',
        part5: 'Punktmapper som',
        part6: 'anbefales ikke, fordi Obsidian ikke sporer dem. Du skal muligvis bruge et',
        part7: 'Plugin til at administrere dem.'
      },
      name: 'Placering for nye vedhæftninger'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Format for URL\'en der vil blive indsat i Markdown.',
        part2: 'Se tilgængelige',
        part3: 'tokens',
        part4: 'Lad stå tomt for at bruge standardformatet.'
      },
      name: 'Markdown URL-format'
    },
    renameAttachmentsToLowerCase: 'Omdøb vedhæftninger til små bogstaver',
    renamedAttachmentFileName: {
      description: {
        part1: 'Se tilgængelige',
        part2: 'tokens',
        part3: 'Lad stå tomt for at bruge',
        part4: 'indstillingen i stedet.'
      },
      name: 'Omdøbt vedhæftningsfilnavn'
    },
    resetToSampleCustomTokens: {
      message: 'Er du sikker på, at du vil nulstille de brugerdefinerede tokens til de eksempel-brugerdefinerede tokens? Dine ændringer vil gå tabt.',
      title: 'Nulstil til eksempel-brugerdefinerede tokens'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Om indsatte billeder skal konverteres til JPEG. Gælder kun når PNG-billedindholdet indsættes direkte fra udklipsholderen. Typisk til indsættelse af skærmbilleder.',
      name: 'Skal konvertere indsatte billeder til JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Hvis aktiveret, når noten slettes, slettes dens forældreløse vedhæftninger også.',
      name: 'Skal slette forældreløse vedhæftninger'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'Hvis aktiveret, når en note omdøbes eller flyttes, vil dens vedhæftninger blive omdøbt i henhold til',
        part2: 'indstillingen.'
      },
      name: 'Skal omdøbe vedhæftningsfiler'
    },
    shouldRenameAttachmentFolders: {
      description: 'Om vedhæftningsmapper skal omdøbes når en note omdøbes eller flyttes.',
      name: 'Skal omdøbe vedhæftningsmapper'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Hvis aktiveret, vedhæftninger behandlet via',
        part2: 'Saml vedhæftninger',
        part3: 'kommandoer vil blive omdøbt i henhold til',
        part4: 'indstillingen.'
      },
      name: 'Skal omdøbe samlede vedhæftninger'
    },
    specialCharacters: {
      description: {
        part1: 'Særlige tegn i vedhæftningsmappe og filnavn der skal erstattes eller fjernes.',
        part2: 'Lad stå tomt for at bevare særlige tegn.'
      },
      name: 'Særlige tegn'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Erstatningsstreng for særlige tegn i vedhæftningsmappe og filnavn.',
        part2: 'Lad stå tomt for at fjerne særlige tegn.'
      },
      name: 'Særlige tegn-erstatning'
    },
    timeoutInSeconds: {
      description: {
        part1: 'Timeout i sekunder for alle operationer.',
        part2: 'Hvis',
        part3: 'er sat, er operationernes udførelsestimeout deaktiveret.'
      },
      name: 'Timeout i sekunder'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Behandl filer med disse udvidelser som vedhæftninger.',
        part2: 'Som standard',
        part3: 'og',
        part4: 'linkede filer behandles ikke som vedhæftninger og flyttes ikke med noten.',
        part5: 'Du kan tilføje brugerdefinerede udvidelser, f.eks.',
        part6: ', for at tilsidesætte denne adfærd.'
      },
      name: 'Behandl som vedhæftningsudvidelser'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Forhåndsvis vedhæftningsfil \'{{fullFileName}}\''
    },
    title: 'Angiv en værdi for prompt-tokenet'
  },
  regularExpression: '/regulært udtryk/'
};
