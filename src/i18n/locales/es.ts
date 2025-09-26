import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const es: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: '¿Quieres recopilar archivos adjuntos para todas las notas en la carpeta:',
      part2: 'y todas sus subcarpetas?',
      part3: 'Esta operación no se puede deshacer.'
    },
    progressBar: {
      message: 'Recopilando archivos adjuntos {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Recopilando archivos adjuntos...'
    }
  },
  buttons: {
    copy: 'Copiar',
    move: 'Mover',
    previewAttachmentFile: 'Vista previa del archivo adjunto',
    skip: 'Omitir'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'El archivo adjunto',
      part2: 'es referenciado por múltiples notas.'
    },
    heading: 'Recopilando archivo adjunto usado por múltiples notas',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Debería usar la misma acción para otros archivos adjuntos problemáticos'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Recopilar archivos adjuntos en la carpeta actual',
    collectAttachmentsCurrentNote: 'Recopilar archivos adjuntos en la nota actual',
    collectAttachmentsEntireVault: 'Recopilar archivos adjuntos en toda la bóveda'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Recopilar archivos adjuntos en la carpeta'
  },
  notice: {
    collectingAttachments: 'Recopilando archivos adjuntos para \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Recopilación de archivos adjuntos cancelada. Ver consola para detalles.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'El nombre del archivo adjunto generado \'{{path}}\' es inválido.\n{{validationMessage}}\nRevisa tu',
      part2: 'configuración.'
    },
    notePathIsIgnored: 'La ruta de la nota es ignorada'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Cancelar',
      ok: 'OK'
    },
    dataview: {
      itemsPerPage: 'Elementos por página:',
      jumpToPage: 'Ir a página:'
    },
    notices: {
      attachmentIsStillUsed: 'El archivo adjunto {{attachmentPath}} aún es usado por otras notas. No será eliminado.',
      unhandledError: 'Ocurrió un error no manejado. Por favor revisa la consola para más información.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'todos los archivos son renombrados.',
        displayText: 'Todos'
      },
      none: {
        description: 'sus nombres son preservados.',
        displayText: 'Ninguno'
      },
      onlyPastedImages: {
        description:
          'solo las imágenes pegadas son renombradas. Se aplica solo cuando el contenido de imagen PNG se pega directamente desde el portapapeles. Típicamente, para pegar capturas de pantalla.',
        displayText: 'Solo imágenes pegadas'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'cancelar la recopilación de archivos adjuntos.',
        displayText: 'Cancelar'
      },
      copy: {
        description: 'copiar el archivo adjunto a la nueva ubicación.',
        displayText: 'Copiar'
      },
      move: {
        description: 'mover el archivo adjunto a la nueva ubicación.',
        displayText: 'Mover'
      },
      prompt: {
        description: 'solicitar al usuario que elija la acción.',
        displayText: 'Solicitar'
      },
      skip: {
        description: 'omitir el archivo adjunto y proceder al siguiente.',
        displayText: 'Omitir'
      }
    },
    defaultImageSizeDimension: {
      height: 'Altura',
      width: 'Ancho'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'eliminará la carpeta de archivos adjuntos vacía.',
        displayText: 'Eliminar'
      },
      deleteWithEmptyParents: {
        description: 'eliminará la carpeta de archivos adjuntos vacía y sus carpetas padre vacías.',
        displayText: 'Eliminar con padres vacíos'
      },
      keep: {
        description: 'mantendrá la carpeta de archivos adjuntos vacía.',
        displayText: 'Mantener'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Los tokens personalizados fueron comentados ya que deben ser actualizados al nuevo formato introducido en la versión del plugin 9.0.0.\n// Consulta la documentación (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) para más información.',
      deprecated: {
        part1:
          'En la versión del plugin 9.0.0, el formato de registro de tokens personalizados cambió. Por favor actualiza tus tokens en consecuencia. Consulta la',
        part2: 'documentación',
        part3: 'para más información'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'En la versión del plugin 9.0.0, la',
      part2: 'configuración está obsoleta. Usa el',
      part3: 'formato en su lugar. Ver',
      part4: 'documentación',
      part5: 'para más información'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Tienes un valor potencialmente incorrecto establecido para el',
        part2: 'formato. Por favor consulta la',
        part3: 'documentación',
        part4: 'para más información',
        part5: 'Este mensaje no se mostrará de nuevo.'
      }
    },
    specialCharacters: {
      part1: 'En la versión del plugin 9.16.0, el',
      part2: 'valor de configuración por defecto fue cambiado. Tu valor de configuración fue actualizado al nuevo valor por defecto.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'El tamaño de imagen predeterminado debe estar en píxeles o porcentaje',
      invalidCustomTokensCode: 'Código de tokens personalizados inválido',
      invalidRegularExpression: 'Expresión regular inválida {{regExp}}',
      specialCharactersMustNotContainSlash: 'Los caracteres especiales no deben contener /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'El reemplazo de caracteres especiales no debe contener caracteres de ruta de nombre de archivo inválidos.'
    },
    version: {
      part1: 'Tu archivo de configuración ',
      part2: 'tiene la versión',
      part3: 'que es más nueva que la versión actual del plugin',
      part4: 'El plugin podría no funcionar como se espera. Por favor actualiza el plugin a la última versión o asegúrate de que la configuración sea correcta.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Al adjuntar archivos:'
      },
      name: 'Modo de renombrado de archivos adjuntos'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Cuando el archivo adjunto recopilado es usado por múltiples notas:'
      },
      name: 'Modo de recopilar archivo adjunto usado por múltiples notas'
    },
    customTokens: {
      description: {
        part1: 'Tokens personalizados a usar.',
        part2: 'Ver',
        part3: 'documentación',
        part4: 'para más información.',
        part5:
          '⚠️ Los tokens personalizados pueden ser código JavaScript arbitrario. Si están mal escritos, pueden causar pérdida de datos. Úsalos bajo tu propio riesgo.'
      },
      name: 'Tokens personalizados'
    },
    defaultImageSize: {
      description: {
        part1: 'El tamaño de imagen predeterminado.',
        part2: 'Puede especificarse en píxeles',
        part3: 'o como porcentaje del tamaño total de la imagen',
        part4: 'Déjalo en blanco para usar el tamaño original de la imagen.'
      },
      name: 'Tamaño de imagen predeterminado'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Cuando estás pegando/arrastrando un archivo con el mismo nombre que un archivo existente, este separador será añadido al nombre del archivo.',
        part2: 'Por ejemplo, cuando arrastras el archivo',
        part3: ', será renombrado a',
        part4: ', etc., obteniendo el primer nombre disponible.'
      },
      name: 'Separador de nombres duplicados'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Cuando la carpeta de archivos adjuntos se vacía:'
      },
      name: 'Comportamiento de carpeta de archivos adjuntos vacía'
    },
    excludePaths: {
      description: {
        part1: 'Excluir notas de las siguientes rutas.',
        part2: 'Inserta cada ruta en una nueva línea.',
        part3: 'Puedes usar cadena de ruta o',
        part4: 'Si la configuración está vacía, no se excluyen notas.'
      },
      name: 'Excluir rutas'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Excluir archivos adjuntos de las siguientes rutas cuando',
        part2: 'Recopilar archivos adjuntos',
        part3: 'comando es ejecutado.',
        part4: 'Inserta cada ruta en una nueva línea.',
        part5: 'Puedes usar cadena de ruta o',
        part6: 'Si la configuración está vacía, no se excluyen rutas de la recopilación de archivos adjuntos.'
      },
      name: 'Excluir rutas de la recopilación de archivos adjuntos'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Ver',
        part2: 'tokens disponibles'
      },
      name: 'Nombre de archivo adjunto generado'
    },
    includePaths: {
      description: {
        part1: 'Incluir notas de las siguientes rutas.',
        part2: 'Inserta cada ruta en una nueva línea.',
        part3: 'Puedes usar cadena de ruta o',
        part4: 'Si la configuración está vacía, todas las notas están incluidas.'
      },
      name: 'Incluir rutas'
    },
    jpegQuality: {
      description: 'Cuanto menor la calidad, mayor la relación de compresión.',
      name: 'Calidad JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Comenzar con',
        part2: 'para usar ruta relativa.',
        part3: 'Ver',
        part4: 'tokens disponibles',
        part5: 'Carpetas con punto como',
        part6: 'no son recomendadas, porque Obsidian no las rastrea. Podrías necesitar usar un',
        part7: 'Plugin para gestionarlas.'
      },
      name: 'Ubicación para nuevos archivos adjuntos'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Formato para la URL que será insertada en Markdown.',
        part2: 'Ver',
        part3: 'tokens disponibles',
        part4: 'Dejar en blanco para usar el formato por defecto.'
      },
      name: 'Formato de URL Markdown'
    },
    renameAttachmentsToLowerCase: 'Renombrar archivos adjuntos a minúsculas',
    resetToSampleCustomTokens: {
      message: '¿Estás seguro de que quieres resetear los tokens personalizados a los tokens personalizados de muestra? Tus cambios se perderán.',
      title: 'Resetear a tokens personalizados de muestra'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Si convertir imágenes pegadas a JPEG. Se aplica solo cuando el contenido de imagen PNG se pega directamente desde el portapapeles. Típicamente, para pegar capturas de pantalla.',
      name: 'Si convertir imágenes pegadas a JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Si está habilitado, cuando la nota es eliminada, sus archivos adjuntos huérfanos también son eliminados.',
      name: 'Si eliminar archivos adjuntos huérfanos'
    },
    shouldRenameAttachmentFiles: {
      description: 'Si renombrar archivos adjuntos cuando una nota es renombrada o movida.',
      name: 'Si renombrar archivos adjuntos'
    },
    shouldRenameAttachmentFolders: {
      description: 'Si renombrar carpetas de archivos adjuntos cuando una nota es renombrada o movida.',
      name: 'Si renombrar carpetas de archivos adjuntos'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Si está habilitado, archivos adjuntos procesados vía',
        part2: 'Recopilar archivos adjuntos',
        part3: 'comandos serán renombrados según la',
        part4: 'configuración.'
      },
      name: 'Si renombrar archivos adjuntos recopilados'
    },
    specialCharacters: {
      description: {
        part1: 'Caracteres especiales en carpeta de archivos adjuntos y nombre de archivo a ser reemplazados o removidos.',
        part2: 'Dejar en blanco para preservar caracteres especiales.'
      },
      name: 'Caracteres especiales'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Cadena de reemplazo para caracteres especiales en carpeta de archivos adjuntos y nombre de archivo.',
        part2: 'Dejar en blanco para remover caracteres especiales.'
      },
      name: 'Reemplazo de caracteres especiales'
    },
    timeoutInSeconds: {
      description: {
        part1: 'El timeout en segundos para todas las operaciones.',
        part2: 'Si',
        part3: 'está establecido, el timeout de ejecución de operaciones está deshabilitado.'
      },
      name: 'Timeout en segundos'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Tratar archivos con estas extensiones como archivos adjuntos.',
        part2: 'Por defecto',
        part3: 'y',
        part4: 'archivos enlazados no son tratados como archivos adjuntos y no son movidos con la nota.',
        part5: 'Puedes añadir extensiones personalizadas, ej.',
        part6: ', para sobrescribir este comportamiento.'
      },
      name: 'Tratar como extensiones de archivos adjuntos'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Vista previa del archivo adjunto \'{{fullFileName}}\''
    },
    title: 'Proporciona un valor para el token de solicitud'
  },
  regularExpression: '/expresión regular/'
};
