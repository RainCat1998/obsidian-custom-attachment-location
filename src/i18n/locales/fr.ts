import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const fr: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Voulez-vous collecter les pièces jointes pour toutes les notes du dossier :',
      part2: 'et tous ses sous-dossiers ?',
      part3: 'Cette opération ne peut pas être annulée.'
    },
    progressBar: {
      message: 'Collecte des pièces jointes {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Collecte des pièces jointes...'
    }
  },
  buttons: {
    copy: 'Copier',
    move: 'Déplacer',
    previewAttachmentFile: 'Aperçu du fichier joint',
    skip: 'Ignorer'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'La pièce jointe',
      part2: 'est référencée par plusieurs notes.'
    },
    heading: 'Collecte de pièce jointe utilisée par plusieurs notes',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Utiliser la même action pour les autres pièces jointes problématiques'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Collecter les pièces jointes dans le dossier actuel',
    collectAttachmentsCurrentNote: 'Collecter les pièces jointes dans la note actuelle',
    collectAttachmentsEntireVault: 'Collecter les pièces jointes dans tout le coffre'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Collecter les pièces jointes dans le dossier'
  },
  notice: {
    collectingAttachments: 'Collecte des pièces jointes pour \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Collecte des pièces jointes annulée. Voir la console pour plus de détails.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Le nom de fichier de pièce jointe généré \'{{path}}\' est invalide.\n{{validationMessage}}\nVérifiez votre',
      part2: 'paramètre.'
    },
    notePathIsIgnored: 'Le chemin de la note est ignoré'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Annuler',
      ok: 'OK'
    },
    dataview: {
      itemsPerPage: 'Éléments par page :',
      jumpToPage: 'Aller à la page :'
    },
    notices: {
      attachmentIsStillUsed: 'La pièce jointe {{attachmentPath}} est encore utilisée par d\'autres notes. Elle ne sera pas supprimée.',
      unhandledError: 'Une erreur non gérée s\'est produite. Veuillez vérifier la console pour plus d\'informations.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'tous les fichiers sont renommés.',
        displayText: 'Tous'
      },
      none: {
        description: 'leurs noms sont préservés.',
        displayText: 'Aucun'
      },
      onlyPastedImages: {
        description:
          'seules les images collées sont renommées. S\'applique uniquement lorsque le contenu d\'image PNG est collé directement depuis le presse-papiers. Typiquement, pour coller des captures d\'\u00e9cran.',
        displayText: 'Images collées uniquement'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'annuler la collecte de pièces jointes.',
        displayText: 'Annuler'
      },
      copy: {
        description: 'copier la pièce jointe vers le nouvel emplacement.',
        displayText: 'Copier'
      },
      move: {
        description: 'déplacer la pièce jointe vers le nouvel emplacement.',
        displayText: 'Déplacer'
      },
      prompt: {
        description: 'demander à l\'utilisateur de choisir l\'action.',
        displayText: 'Demander'
      },
      skip: {
        description: 'ignorer la pièce jointe et passer à la suivante.',
        displayText: 'Ignorer'
      }
    },
    defaultImageSizeDimension: {
      height: 'Hauteur',
      width: 'Largeur'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'supprimera le dossier de pièces jointes vide.',
        displayText: 'Supprimer'
      },
      deleteWithEmptyParents: {
        description: 'supprimera le dossier de pièces jointes vide et ses dossiers parents vides.',
        displayText: 'Supprimer avec parents vides'
      },
      keep: {
        description: 'conservera le dossier de pièces jointes vide.',
        displayText: 'Conserver'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Les jetons personnalisés ont été commentés car ils doivent être mis à jour vers le nouveau format introduit dans la version 9.0.0 du plugin.\n// Consultez la documentation (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) pour plus d\'informations.',
      deprecated: {
        part1:
          'Dans la version 9.0.0 du plugin, le format d\'enregistrement des jetons personnalisés a changé. Veuillez mettre à jour vos jetons en conséquence. Consultez la',
        part2: 'documentation',
        part3: 'pour plus d\'informations'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'Dans la version 9.0.0 du plugin, le paramètre',
      part2: 'est obsolète. Utilisez le',
      part3: 'format à la place. Voir la',
      part4: 'documentation',
      part5: 'pour plus d\'informations'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Vous avez potentiellement une valeur incorrecte définie pour le',
        part2: 'format. Veuillez vous référer à la',
        part3: 'documentation',
        part4: 'pour plus d\'informations',
        part5: 'Ce message ne sera plus affiché.'
      }
    },
    specialCharacters: {
      part1: 'Dans la version 9.16.0 du plugin, la',
      part2: 'valeur de paramètre par défaut a été modifiée. Votre valeur de paramètre a été mise à jour vers la nouvelle valeur par défaut.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'La taille d\'image par défaut doit être en pixels ou en pourcentage',
      invalidCustomTokensCode: 'Code de jetons personnalisés invalide',
      invalidRegularExpression: 'Expression régulière invalide {{regExp}}',
      specialCharactersMustNotContainSlash: 'Les caractères spéciaux ne doivent pas contenir /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'Le remplacement des caractères spéciaux ne doit pas contenir de caractères de chemin de fichier invalides.'
    },
    version: {
      part1: 'Votre fichier de paramètres ',
      part2: 'a la version',
      part3: 'qui est plus récente que la version actuelle du plugin',
      part4:
        'Le plugin pourrait ne pas fonctionner comme attendu. Veuillez mettre à jour le plugin vers la dernière version ou vous assurer que les paramètres sont corrects.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Lors de l\'ajout de fichiers :'
      },
      name: 'Mode de renommage des pièces jointes'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Lorsque la pièce jointe collectée est utilisée par plusieurs notes :'
      },
      name: 'Mode de collecte de pièce jointe utilisée par plusieurs notes'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'Voir les',
        part2: 'jetons disponibles',
        part3: 'Laisser vide pour utiliser le paramètre',
        part4: 'à la place.'
      },
      name: 'Nom de fichier de pièce jointe collectée'
    },
    customTokens: {
      description: {
        part1: 'Jetons personnalisés à utiliser.',
        part2: 'Voir la',
        part3: 'documentation',
        part4: 'pour plus d\'informations.',
        part5:
          '⚠️ Les jetons personnalisés peuvent être du code JavaScript arbitraire. S\'ils sont mal écrits, ils peuvent causer une perte de données. Utilisez-les à vos propres risques.'
      },
      name: 'Jetons personnalisés'
    },
    defaultImageSize: {
      description: {
        part1: 'La taille d\'image par défaut.',
        part2: 'Peut être spécifiée en pixels',
        part3: 'ou en pourcentage de la taille totale de l\'image',
        part4: 'Laissez vide pour utiliser la taille originale.'
      },
      name: 'Taille d\'image par défaut'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Lorsque vous collez/glissez un fichier avec le même nom qu\'un fichier existant, ce séparateur sera ajouté au nom du fichier.',
        part2: 'Par exemple, lorsque vous glissez le fichier',
        part3: ', il sera renommé en ',
        part4: ', etc, obtenant le premier nom disponible.'
      },
      name: 'Séparateur de nom dupliqué'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Lorsque le dossier de pièces jointes devient vide :'
      },
      name: 'Comportement du dossier de pièces jointes vide'
    },
    excludePaths: {
      description: {
        part1: 'Exclure les notes des chemins suivants.',
        part2: 'Insérez chaque chemin sur une nouvelle ligne.',
        part3: 'Vous pouvez utiliser une chaîne de chemin ou',
        part4: 'Si le paramètre est vide, aucune note n\'est exclue.'
      },
      name: 'Chemins exclus'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Exclure les pièces jointes des chemins suivants lorsque la commande',
        part2: 'Collecter les pièces jointes',
        part3: 'est exécutée.',
        part4: 'Insérez chaque chemin sur une nouvelle ligne.',
        part5: 'Vous pouvez utiliser une chaîne de chemin ou',
        part6: 'Si le paramètre est vide, aucun chemin n\'est exclu de la collecte de pièces jointes.'
      },
      name: 'Chemins exclus de la collecte de pièces jointes'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Voir les',
        part2: 'jetons disponibles'
      },
      name: 'Nom de fichier de pièce jointe généré'
    },
    includePaths: {
      description: {
        part1: 'Inclure les notes des chemins suivants.',
        part2: 'Insérez chaque chemin sur une nouvelle ligne.',
        part3: 'Vous pouvez utiliser une chaîne de chemin ou',
        part4: 'Si le paramètre est vide, toutes les notes sont incluses.'
      },
      name: 'Chemins inclus'
    },
    jpegQuality: {
      description: 'Plus la qualité est faible, plus le taux de compression est élevé.',
      name: 'Qualité JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Commencer par',
        part2: 'pour utiliser un chemin relatif.',
        part3: 'Voir les',
        part4: 'jetons disponibles',
        part5: 'Les dossiers point comme',
        part6: 'ne sont pas recommandés, car Obsidian ne les suit pas. Vous pourriez avoir besoin d\'utiliser le',
        part7: 'Plugin pour les gérer.'
      },
      name: 'Emplacement des nouvelles pièces jointes'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Format pour l\'URL qui sera insérée dans Markdown.',
        part2: 'Voir les',
        part3: 'jetons disponibles',
        part4: 'Laisser vide pour utiliser le format par défaut.'
      },
      name: 'Format d\'URL Markdown'
    },
    renameAttachmentsToLowerCase: 'Renommer les pièces jointes en minuscules',
    renamedAttachmentFileName: {
      description: {
        part1: 'Voir les',
        part2: 'jetons disponibles',
        part3: 'Laisser vide pour utiliser le paramètre',
        part4: 'à la place.'
      },
      name: 'Nom de fichier de pièce jointe renommée'
    },
    resetToSampleCustomTokens: {
      message: 'Êtes-vous sûr de vouloir réinitialiser les jetons personnalisés aux jetons personnalisés d\'exemple ? Vos modifications seront perdues.',
      title: 'Réinitialiser aux jetons personnalisés d\'exemple'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Convertir les images collées en JPEG. S\'applique uniquement lorsque le contenu d\'image PNG est collé directement depuis le presse-papiers. Typiquement, pour coller des captures d\'écran.',
      name: 'Convertir les images collées en JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Si activé, lorsque la note est supprimée, ses pièces jointes orphelines sont également supprimées.',
      name: 'Supprimer les pièces jointes orphelines'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'Si activé, lorsqu\'une note est renommée ou déplacée, ses fichiers de pièces jointes seront renommés selon le paramètre',
        part2: '.'
      },
      name: 'Renommer les fichiers de pièces jointes'
    },
    shouldRenameAttachmentFolders: {
      description: 'Renommer les dossiers de pièces jointes lorsqu\'une note est renommée ou déplacée.',
      name: 'Renommer les dossiers de pièces jointes'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Si activé, les pièces jointes traitées via les commandes',
        part2: 'Collecter les pièces jointes',
        part3: 'seront renommées selon le paramètre',
        part4: '.'
      },
      name: 'Renommer les pièces jointes collectées'
    },
    specialCharacters: {
      description: {
        part1: 'Caractères spéciaux dans le dossier de pièces jointes et le nom de fichier à remplacer ou supprimer.',
        part2: 'Laisser vide pour préserver les caractères spéciaux.'
      },
      name: 'Caractères spéciaux'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Chaîne de remplacement pour les caractères spéciaux dans le dossier de pièces jointes et le nom de fichier.',
        part2: 'Laisser vide pour supprimer les caractères spéciaux.'
      },
      name: 'Remplacement des caractères spéciaux'
    },
    timeoutInSeconds: {
      description: {
        part1: 'Le délai d\'expiration en secondes pour toutes les opérations.',
        part2: 'Si',
        part3: 'est défini, le délai d\'expiration de l\'exécution des opérations est désactivé.'
      },
      name: 'Délai d\'expiration en secondes'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Traiter les fichiers avec ces extensions comme des pièces jointes.',
        part2: 'Par défaut',
        part3: 'et',
        part4: 'les fichiers liés ne sont pas traités comme des pièces jointes et ne sont pas déplacés avec la note.',
        part5: 'Vous pouvez ajouter des extensions personnalisées, par ex.',
        part6: ', pour remplacer ce comportement.'
      },
      name: 'Extensions traitées comme pièces jointes'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Aperçu du fichier de pièce jointe \'{{fullFileName}}\''
    },
    title: 'Fournir une valeur pour le jeton de saisie'
  },
  regularExpression: '/expression régulière/'
};
