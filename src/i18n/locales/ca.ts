import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const ca: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Voleu recollir adjunts per a totes les notes de la carpeta:',
      part2: 'i totes les seves subcarpetes?',
      part3: 'Aquesta operació no es pot desfer.'
    },
    progressBar: {
      message: 'Recollint adjunts {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Recollint adjunts...'
    }
  },
  buttons: {
    copy: 'Copiar',
    move: 'Moure',
    previewAttachmentFile: 'Previsualitzar fitxer adjunt',
    skip: 'Ometre'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'L\'adjunt',
      part2: 'és referenciat per múltiples notes.'
    },
    heading: 'Recollint adjunt utilitzat per múltiples notes',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Ha d\'utilitzar la mateixa acció per a altres adjunts problemàtics'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Recollir adjunts a la carpeta actual',
    collectAttachmentsCurrentNote: 'Recollir adjunts a la nota actual',
    collectAttachmentsEntireVault: 'Recollir adjunts a tot el dipòsit'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Recollir adjunts a la carpeta'
  },
  notice: {
    collectingAttachments: 'Recollint adjunts per a \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Recollida d\'adjunts cancel·lada. Vegeu la consola per a detalls.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'El nom del fitxer adjunt generat \'{{path}}\' no és vàlid.\n{{validationMessage}}\nComproveu la vostra',
      part2: 'configuració.'
    },
    notePathIsIgnored: 'El camí de la nota s\'ignora'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Cancel·lar',
      ok: 'D\'acord'
    },
    dataview: {
      itemsPerPage: 'Elements per pàgina:',
      jumpToPage: 'Saltar a la pàgina:'
    },
    notices: {
      attachmentIsStillUsed: 'L\'adjunt {{attachmentPath}} encara s\'utilitza per altres notes. No s\'esborrarà.',
      unhandledError: 'S\'ha produït un error no gestionat. Si us plau, comproveu la consola per a més informació.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'tots els fitxers es reanomenen.',
        displayText: 'Tots'
      },
      none: {
        description: 'els seus noms es preserven.',
        displayText: 'Cap'
      },
      onlyPastedImages: {
        description:
          'només les imatges enganxades es reanomenen. S\'aplica només quan el contingut de la imatge PNG s\'enganxa directament des del porta-retalls. Típicament, per enganxar captures de pantalla.',
        displayText: 'Només imatges enganxades'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'cancel·lar la recollida d\'adjunts.',
        displayText: 'Cancel·lar'
      },
      copy: {
        description: 'copiar l\'adjunt a la nova ubicació.',
        displayText: 'Copiar'
      },
      move: {
        description: 'moure l\'adjunt a la nova ubicació.',
        displayText: 'Moure'
      },
      prompt: {
        description: 'preguntar a l\'usuari per triar l\'acció.',
        displayText: 'Preguntar'
      },
      skip: {
        description: 'ometre l\'adjunt i procedir al següent.',
        displayText: 'Ometre'
      }
    },
    defaultImageSizeDimension: {
      height: 'Alçada',
      width: 'Amplada'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'esborrarà la carpeta d\'adjunts buida.',
        displayText: 'Esborrar'
      },
      deleteWithEmptyParents: {
        description: 'esborrarà la carpeta d\'adjunts buida i les seves carpetes pare buides.',
        displayText: 'Esborrar amb pares buits'
      },
      keep: {
        description: 'mantindrà la carpeta d\'adjunts buida.',
        displayText: 'Mantenir'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Els tokens personalitzats van ser comentats ja que han de ser actualitzats al nou format introduït a la versió del plugin 9.0.0.\n// Consulteu la documentació (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) per a més informació.',
      deprecated: {
        part1:
          'A la versió del plugin 9.0.0, el format de registre de tokens personalitzats va canviar. Si us plau, actualitzeu els vostres tokens en conseqüència. Consulteu la',
        part2: 'documentació',
        part3: 'per a més informació'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'A la versió del plugin 9.0.0, la',
      part2: 'configuració està obsoleta. Utilitzeu el',
      part3: 'format en lloc d\'això. Vegeu la',
      part4: 'documentació',
      part5: 'per a més informació'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Teniu un valor potencialment incorrecte establert per al',
        part2: 'format. Si us plau, consulteu la',
        part3: 'documentació',
        part4: 'per a més informació',
        part5: 'Aquest missatge no es mostrarà de nou.'
      }
    },
    specialCharacters: {
      part1: 'A la versió del plugin 9.16.0, el',
      part2: 'valor de configuració per defecte va canviar. El vostre valor de configuració va ser actualitzat al nou valor per defecte.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'La mida predeterminada de la imatge s\'ha d\'expressar en píxels o percentatge',
      invalidCustomTokensCode: 'Codi de tokens personalitzats no vàlid',
      invalidRegularExpression: 'Expressió regular no vàlida {{regExp}}',
      specialCharactersMustNotContainSlash: 'Els caràcters especials no han de contenir /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'El reemplaçament de caràcters especials no ha de contenir caràcters de camí de nom de fitxer no vàlids.'
    },
    version: {
      part1: 'El vostre fitxer de configuració ',
      part2: 'té la versió',
      part3: 'que és més nova que la versió actual del plugin',
      part4:
        'El plugin podria no funcionar com s\'espera. Si us plau, actualitzeu el plugin a la darrera versió o assegureu-vos que les configuracions siguin correctes.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Quan s\'adjunten fitxers:'
      },
      name: 'Mode de reanomenament d\'adjunts'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Quan l\'adjunt recollit és utilitzat per múltiples notes:'
      },
      name: 'Mode de recollida d\'adjunt utilitzat per múltiples notes'
    },
    customTokens: {
      description: {
        part1: 'Tokens personalitzats a utilitzar.',
        part2: 'Vegeu la',
        part3: 'documentació',
        part4: 'per a més informació.',
        part5:
          '⚠️ Els tokens personalitzats poden ser codi JavaScript arbitrari. Si estan mal escrits, poden causar pèrdua de dades. Utilitzeu-los sota la vostra responsabilitat.'
      },
      name: 'Tokens personalitzats'
    },
    defaultImageSize: {
      description: {
        part1: 'La mida predeterminada de la imatge.',
        part2: 'Es pot especificar en píxels',
        part3: 'o en percentatge de la mida completa de la imatge',
        part4: 'Deixa-ho en blanc per utilitzar la mida original de la imatge.'
      },
      name: 'Mida predeterminada de la imatge'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Quan enganxeu/arrossegueu un fitxer amb el mateix nom que un fitxer existent, aquest separador s\'afegirà al nom del fitxer.',
        part2: 'Per exemple, quan arrossegueu el fitxer',
        part3: ', es reanomenarà a',
        part4: ', etc., obtenint el primer nom disponible.'
      },
      name: 'Separador de noms duplicats'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Quan la carpeta d\'adjunts es buida:'
      },
      name: 'Comportament de carpeta d\'adjunts buida'
    },
    excludePaths: {
      description: {
        part1: 'Excloure notes dels següents camins.',
        part2: 'Inseriu cada camí en una línia nova.',
        part3: 'Podeu utilitzar cadena de camí o',
        part4: 'Si la configuració està buida, cap nota no s\'exclou.'
      },
      name: 'Excloure camins'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Excloure adjunts dels següents camins quan',
        part2: 'Recollir adjunts',
        part3: 's\'executa la comanda.',
        part4: 'Inseriu cada camí en una línia nova.',
        part5: 'Podeu utilitzar cadena de camí o',
        part6: 'Si la configuració està buida, cap camí no s\'exclou de la recollida d\'adjunts.'
      },
      name: 'Excloure camins de la recollida d\'adjunts'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Vegeu els',
        part2: 'tokens disponibles'
      },
      name: 'Nom de fitxer adjunt generat'
    },
    includePaths: {
      description: {
        part1: 'Incloure notes dels següents camins.',
        part2: 'Inseriu cada camí en una línia nova.',
        part3: 'Podeu utilitzar cadena de camí o',
        part4: 'Si la configuració està buida, totes les notes s\'inclouen.'
      },
      name: 'Incloure camins'
    },
    jpegQuality: {
      description: 'Com més petita la qualitat, més gran la relació de compressió.',
      name: 'Qualitat JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Començar amb',
        part2: 'per utilitzar camí relatiu.',
        part3: 'Vegeu els',
        part4: 'tokens disponibles',
        part5: 'Les carpetes amb punt com',
        part6: 'no es recomanen, perquè Obsidian no les rastreja. Potser necessiteu utilitzar un',
        part7: 'Plugin per gestionar-les.'
      },
      name: 'Ubicació per a nous adjunts'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Format per a l\'URL que s\'inserirà a Markdown.',
        part2: 'Vegeu els',
        part3: 'tokens disponibles',
        part4: 'Deixeu buit per utilitzar el format per defecte.'
      },
      name: 'Format URL Markdown'
    },
    renameAttachmentsToLowerCase: 'Reanomenar adjunts a minúscules',
    resetToSampleCustomTokens: {
      message: 'Esteu segurs que voleu restablir els tokens personalitzats als tokens personalitzats de mostra? Les vostres canvis es perdran.',
      title: 'Restablir als tokens personalitzats de mostra'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Si convertir les imatges enganxades a JPEG. S\'aplica només quan el contingut de la imatge PNG s\'enganxa directament des del porta-retalls. Típicament, per enganxar captures de pantalla.',
      name: 'Si convertir les imatges enganxades a JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Si està habilitat, quan la nota s\'esborra, els seus adjunts òrfes també s\'esborren.',
      name: 'Si esborrar adjunts òrfes'
    },
    shouldRenameAttachmentFiles: {
      description: 'Si reanomenar fitxers adjunts quan una nota es reanomena o es mou.',
      name: 'Si reanomenar fitxers adjunts'
    },
    shouldRenameAttachmentFolders: {
      description: 'Si reanomenar carpetes adjunts quan una nota es reanomena o es mou.',
      name: 'Si reanomenar carpetes adjunts'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Si està habilitat, els adjunts processats via',
        part2: 'Recollir adjunts',
        part3: 'les comandes es reanomenaran segons la',
        part4: 'configuració.'
      },
      name: 'Si reanomenar adjunts recollits'
    },
    specialCharacters: {
      description: {
        part1: 'Caràcters especials a la carpeta d\'adjunts i nom del fitxer per ser reemplaçats o eliminats.',
        part2: 'Deixeu buit per preservar caràcters especials.'
      },
      name: 'Caràcters especials'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Cadena de reemplaçament per caràcters especials a la carpeta d\'adjunts i nom del fitxer.',
        part2: 'Deixeu buit per eliminar caràcters especials.'
      },
      name: 'Reemplaçament de caràcters especials'
    },
    timeoutInSeconds: {
      description: {
        part1: 'El temps d\'espera en segons per a totes les operacions.',
        part2: 'Si',
        part3: 'està establert, el temps d\'espera d\'execució d\'operacions està deshabilitat.'
      },
      name: 'Temps d\'espera en segons'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Tractar fitxers amb aquestes extensions com adjunts.',
        part2: 'Per defecte',
        part3: 'i',
        part4: 'els fitxers enllaçats no es tracten com adjunts i no es mouen amb la nota.',
        part5: 'Podeu afegir extensions personalitzades, p. ex.',
        part6: ', per sobreescriure aquest comportament.'
      },
      name: 'Tractar com extensions d\'adjunts'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Previsualitzar fitxer adjunt \'{{fullFileName}}\''
    },
    title: 'Proporcioneu un valor per al token de sol·licitud'
  },
  regularExpression: '/expressió regular/'
};
