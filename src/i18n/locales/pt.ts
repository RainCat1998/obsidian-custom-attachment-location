import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const pt: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Você deseja coletar anexos para todas as notas nas pastas de forma recursiva?',
      part2: 'Esta operação não pode ser desfeita.'
    },
    progressBar: {
      message: 'Recolhendo anexos {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Recolhendo anexos...'
    }
  },
  buttons: {
    copy: 'Copiar',
    move: 'Mover',
    previewAttachmentFile: 'Pré-visualizar ficheiro anexo',
    skip: 'Saltar'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'O anexo',
      part2: 'é referenciado por múltiplas notas.'
    },
    heading: 'Recolhendo anexo usado por múltiplas notas',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Usar a mesma ação para outros anexos problemáticos'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Recolher anexos na pasta atual',
    collectAttachmentsCurrentNote: 'Recolher anexos na nota atual',
    collectAttachmentsEntireVault: 'Recolher anexos em todo o cofre'
  },
  menuItems: {
    collectAttachmentsInFile: 'Coletar anexos no arquivo',
    collectAttachmentsInFiles: 'Coletar anexos nos arquivos'
  },
  notice: {
    collectingAttachments: 'Recolhendo anexos para \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Recolha de anexos cancelada. Veja a consola para detalhes.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Nome de ficheiro de anexo gerado \'{{path}}\' é inválido.\n{{validationMessage}}\nVerifique a sua',
      part2: 'configuração.'
    },
    notePathIsIgnored: 'Caminho da nota é ignorado'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Cancelar',
      ok: 'OK'
    },
    dataview: {
      itemsPerPage: 'Itens por página:',
      jumpToPage: 'Ir para página:'
    },
    notices: {
      attachmentIsStillUsed: 'O anexo {{attachmentPath}} ainda está a ser usado por outras notas. Não será eliminado.',
      unhandledError: 'Ocorreu um erro não tratado. Verifique a consola para mais informações.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'todos os ficheiros são renomeados.',
        displayText: 'Todos'
      },
      none: {
        description: 'os seus nomes são preservados.',
        displayText: 'Nenhum'
      },
      onlyPastedImages: {
        description:
          'apenas imagens coladas são renomeadas. Aplica-se apenas quando o conteúdo da imagem PNG é colado diretamente da área de transferência. Tipicamente, para colar capturas de ecrã.',
        displayText: 'Apenas imagens coladas'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'cancelar a recolha de anexos.',
        displayText: 'Cancelar'
      },
      copy: {
        description: 'copiar o anexo para a nova localização.',
        displayText: 'Copiar'
      },
      move: {
        description: 'mover o anexo para a nova localização.',
        displayText: 'Mover'
      },
      prompt: {
        description: 'solicitar ao utilizador que escolha a ação.',
        displayText: 'Solicitar'
      },
      skip: {
        description: 'saltar o anexo e prosseguir para o seguinte.',
        displayText: 'Saltar'
      }
    },
    defaultImageSizeDimension: {
      height: 'Altura',
      width: 'Largura'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'irá eliminar a pasta de anexos vazia.',
        displayText: 'Eliminar'
      },
      deleteWithEmptyParents: {
        description: 'irá eliminar a pasta de anexos vazia e as suas pastas-pai vazias.',
        displayText: 'Eliminar com pais vazios'
      },
      keep: {
        description: 'irá manter a pasta de anexos vazia.',
        displayText: 'Manter'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Os tokens personalizados foram comentados pois necessitam de ser atualizados para o novo formato introduzido na versão 9.0.0 do plugin.\n// Consulte a documentação (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) para mais informações.',
      deprecated: {
        part1: 'Na versão 9.0.0 do plugin, o formato de registo de tokens personalizados mudou. Por favor, atualize os seus tokens em conformidade. Consulte a',
        part2: 'documentação',
        part3: 'para mais informações'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'Na versão 9.0.0 do plugin, a',
      part2: 'configuração está obsoleta. Use o',
      part3: 'formato em alternativa. Veja a',
      part4: 'documentação',
      part5: 'para mais informações'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Tem um valor potencialmente incorreto definido para o',
        part2: 'formato. Consulte a',
        part3: 'documentação',
        part4: 'para mais informações.',
        part5: 'Esta mensagem não será exibida novamente.'
      }
    },
    specialCharacters: {
      part1: 'Na versão 9.16.0 do plugin, o',
      part2: 'valor padrão da configuração foi alterado. O seu valor foi atualizado para o novo padrão.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'O tamanho predefinido da imagem deve estar em pixels ou percentagem',
      invalidCustomTokensCode: 'Código de tokens personalizados inválido',
      invalidRegularExpression: 'Expressão regular inválida {{regExp}}',
      specialCharactersMustNotContainSlash: 'Caracteres especiais não devem conter /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'A substituição de caracteres especiais não deve conter caracteres inválidos de caminho de nome de ficheiro.'
    },
    version: {
      part1: 'O seu ficheiro de configurações ',
      part2: 'tem a versão',
      part3: 'que é mais recente do que a versão atual do plugin',
      part4: 'O plugin pode não funcionar como esperado. Atualize para a versão mais recente do plugin ou verifique se as configurações estão corretas.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Ao anexar ficheiros:'
      },
      name: 'Modo de renomeação de anexos'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Quando o anexo recolhido é usado por múltiplas notas:'
      },
      name: 'Modo de recolha de anexos usados por múltiplas notas'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'Veja os',
        part2: 'tokens disponíveis'
      },
      name: 'Nome do ficheiro de anexo recolhido'
    },
    customTokens: {
      description: {
        part1: 'Tokens personalizados a serem usados.',
        part2: 'Veja a',
        part3: 'documentação',
        part4: 'para mais informações.',
        part5: '⚠️ Tokens personalizados podem conter código JavaScript arbitrário. Se mal escritos, podem causar perda de dados. Use por sua conta e risco.'
      },
      name: 'Tokens personalizados'
    },
    defaultImageSize: {
      description: {
        part1: 'O tamanho predefinido da imagem.',
        part2: 'Pode ser especificado em pixels',
        part3: 'ou como percentagem do tamanho total da imagem',
        part4: 'Deixe em branco para usar o tamanho original da imagem.'
      },
      name: 'Tamanho predefinido da imagem'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Ao colar/arrastar um ficheiro com o mesmo nome de um ficheiro existente, este separador será adicionado ao nome.',
        part2: 'Por exemplo, ao arrastar o ficheiro',
        part3: ', ele será renomeado para ',
        part4: ', etc, recebendo o primeiro nome disponível.'
      },
      name: 'Separador de nomes duplicados'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Quando a pasta de anexos ficar vazia:'
      },
      name: 'Comportamento da pasta de anexos vazia'
    },
    excludePaths: {
      description: {
        part1: 'Excluir notas dos seguintes caminhos.',
        part2: 'Introduza cada caminho numa nova linha.',
        part3: 'Pode usar cadeias de caminho ou',
        part4: 'Se a configuração ficar vazia, nenhuma nota será excluída.'
      },
      name: 'Excluir caminhos'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Excluir anexos dos seguintes caminhos quando o comando',
        part2: 'Recolher anexos',
        part3: 'for executado.',
        part4: 'Introduza cada caminho numa nova linha.',
        part5: 'Pode usar cadeias de caminho ou',
        part6: 'Se a configuração ficar vazia, nenhum anexo será excluído da recolha.'
      },
      name: 'Excluir caminhos da recolha de anexos'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Veja os',
        part2: 'tokens disponíveis'
      },
      name: 'Nome do ficheiro de anexo gerado'
    },
    includePaths: {
      description: {
        part1: 'Incluir notas dos seguintes caminhos.',
        part2: 'Introduza cada caminho numa nova linha.',
        part3: 'Pode usar cadeias de caminho ou',
        part4: 'Se a configuração ficar vazia, todas as notas serão incluídas.'
      },
      name: 'Incluir caminhos'
    },
    jpegQuality: {
      description: 'Quanto menor a qualidade, maior a taxa de compressão.',
      name: 'Qualidade JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Comece com',
        part2: 'para usar caminho relativo.',
        part3: 'Veja os',
        part4: 'tokens disponíveis',
        part5: 'Pastas começadas por ponto como',
        part6: 'não são recomendadas, pois o Obsidian não as acompanha. Pode necessitar de usar um',
        part7: 'Plugin para as gerir.'
      },
      name: 'Localização para novos anexos'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Formato da URL a ser inserida no Markdown.',
        part2: 'Veja os',
        part3: 'tokens disponíveis',
        part4: 'Deixe em branco para usar o formato padrão.'
      },
      name: 'Formato de URL em Markdown'
    },
    renameAttachmentsToLowerCase: 'Renomear anexos para minúsculas',
    renamedAttachmentFileName: {
      description: {
        part1: 'Veja os',
        part2: 'tokens disponíveis'
      },
      name: 'Nome do ficheiro de anexo renomeado'
    },
    resetToSampleCustomTokens: {
      message: 'Tem a certeza de que deseja repor os tokens personalizados para os tokens de exemplo? As suas alterações serão perdidas.',
      title: 'Repor tokens personalizados para o exemplo'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Defina se as imagens coladas devem ser convertidas para JPEG. Aplica-se apenas quando o conteúdo da imagem PNG é colado diretamente da área de transferência. Tipicamente, útil para capturas de ecrã.',
      name: 'Converter imagens coladas para JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Se ativado, ao eliminar a nota, os seus anexos órfãos serão também eliminados.',
      name: 'Eliminar anexos órfãos'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'Se ativado, quando uma nota é renomeada ou movida, os seus anexos serão renomeados de acordo com a',
        part2: 'configuração.'
      },
      name: 'Renomear ficheiros de anexos'
    },
    shouldRenameAttachmentFolders: {
      description: 'Se as pastas de anexos devem ser renomeadas quando uma nota é renomeada ou movida.',
      name: 'Renomear pastas de anexos'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Se ativado, anexos processados através do comando',
        part2: 'Recolher anexos',
        part3: 'serão renomeados de acordo com a',
        part4: 'configuração.'
      },
      name: 'Renomear anexos recolhidos'
    },
    specialCharacters: {
      description: {
        part1: 'Caracteres especiais no nome da pasta/ficheiro de anexo a serem substituídos ou removidos.',
        part2: 'Deixe em branco para preservar os caracteres.'
      },
      name: 'Caracteres especiais'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Sequência de substituição para caracteres especiais no nome da pasta/ficheiro de anexo.',
        part2: 'Deixe em branco para remover os caracteres especiais.'
      },
      name: 'Substituição de caracteres especiais'
    },
    timeoutInSeconds: {
      description: {
        part1: 'O tempo limite em segundos para todas as operações.',
        part2: 'Se',
        part3: 'estiver definido, o tempo limite é desativado.'
      },
      name: 'Tempo limite em segundos'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Tratar ficheiros com estas extensões como anexos.',
        part2: 'Por padrão',
        part3: 'e',
        part4: 'ficheiros ligados não são tratados como anexos e não são movidos com a nota.',
        part5: 'Pode adicionar extensões personalizadas, por exemplo,',
        part6: ', para sobrescrever este comportamento.'
      },
      name: 'Tratar como extensões de anexos'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Pré-visualizar ficheiro anexo \'{{fullFileName}}\''
    },
    title: 'Forneça um valor para o token de prompt'
  },
  regularExpression: '/expressão regular/'
};
