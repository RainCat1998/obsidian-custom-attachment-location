import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const ptBR: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Deseja coletar anexos para todas as notas na pasta:',
      part2: 'e todas as suas subpastas?',
      part3: 'Esta operação não pode ser desfeita.'
    },
    progressBar: {
      message: 'Coletando anexos {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Coletando anexos...'
    }
  },
  buttons: {
    copy: 'Copiar',
    move: 'Mover',
    previewAttachmentFile: 'Visualizar arquivo anexo',
    skip: 'Pular'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Anexo',
      part2: 'é referenciado por múltiplas notas.'
    },
    heading: 'Coletando anexo usado por múltiplas notas',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Usar a mesma ação para outros anexos problemáticos'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Coletar anexos na pasta atual',
    collectAttachmentsCurrentNote: 'Coletar anexos na nota atual',
    collectAttachmentsEntireVault: 'Coletar anexos em todo o cofre'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Coletar anexos na pasta'
  },
  notice: {
    collectingAttachments: 'Coletando anexos para \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Coleta de anexos cancelada. Veja o console para detalhes.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Nome do arquivo de anexo gerado \'{{path}}\' é inválido.\n{{validationMessage}}\nVerifique sua',
      part2: 'configuração.'
    },
    notePathIsIgnored: 'Caminho da nota foi ignorado'
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
      attachmentIsStillUsed: 'Anexo {{attachmentPath}} ainda está sendo usado por outras notas. Não será excluído.',
      unhandledError: 'Ocorreu um erro não tratado. Por favor, verifique o console para mais informações.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'todos os arquivos são renomeados.',
        displayText: 'Todos'
      },
      none: {
        description: 'seus nomes são preservados.',
        displayText: 'Nenhum'
      },
      onlyPastedImages: {
        description:
          'apenas imagens coladas são renomeadas. Aplica-se apenas quando o conteúdo da imagem PNG é colado da área de transferência diretamente. Tipicamente, para colar capturas de tela.',
        displayText: 'Apenas imagens coladas'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'cancelar a coleta de anexos.',
        displayText: 'Cancelar'
      },
      copy: {
        description: 'copiar o anexo para o novo local.',
        displayText: 'Copiar'
      },
      move: {
        description: 'mover o anexo para o novo local.',
        displayText: 'Mover'
      },
      prompt: {
        description: 'solicitar ao usuário que escolha a ação.',
        displayText: 'Solicitar'
      },
      skip: {
        description: 'pular o anexo e prosseguir para o próximo.',
        displayText: 'Pular'
      }
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'excluirá a pasta de anexos vazia.',
        displayText: 'Excluir'
      },
      deleteWithEmptyParents: {
        description: 'excluirá a pasta de anexos vazia e suas pastas pai vazias.',
        displayText: 'Excluir com pais vazios'
      },
      keep: {
        description: 'manterá a pasta de anexos vazia.',
        displayText: 'Manter'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Tokens personalizados foram comentados pois precisam ser atualizados para o novo formato introduzido na versão 9.0.0 do plugin.\n// Consulte a documentação (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) para mais informações.',
      deprecated: {
        part1: 'Na versão 9.0.0 do plugin, o formato de registro de token personalizado mudou. Por favor, atualize seus tokens adequadamente. Consulte a',
        part2: 'documentação',
        part3: 'para mais informações'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'Na versão 9.0.0 do plugin, a',
      part2: 'configuração está obsoleta. Use o',
      part3: 'formato em vez disso. Veja a',
      part4: 'documentação',
      part5: 'para mais informações'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Você tem um valor potencialmente incorreto definido para o',
        part2: 'formato. Por favor, consulte a',
        part3: 'documentação',
        part4: 'para mais informações.',
        part5: 'Esta mensagem não será exibida novamente.'
      }
    },
    specialCharacters: {
      part1: 'Na versão 9.16.0 do plugin, o',
      part2: 'valor padrão da configuração foi alterado. Seu valor de configuração foi atualizado para o novo valor padrão.'
    },
    validation: {
      invalidCustomTokensCode: 'Código de tokens personalizados inválido',
      invalidRegularExpression: 'Expressão regular inválida {{regExp}}',
      specialCharactersMustNotContainSlash: 'Caracteres especiais não devem conter /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'A substituição de caracteres especiais não deve conter caracteres de caminho de nome de arquivo inválidos.'
    },
    version: {
      part1: 'Seu arquivo de configurações ',
      part2: 'tem a versão',
      part3: 'que é mais nova que a versão atual do plugin',
      part4:
        'O plugin pode não funcionar como esperado. Por favor, atualize o plugin para a versão mais recente ou certifique-se de que as configurações estão corretas.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Ao anexar arquivos:'
      },
      name: 'Modo de renomeação de anexos'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Quando o anexo coletado é usado por múltiplas notas:'
      },
      name: 'Modo de coleta de anexos usados por múltiplas notas'
    },
    customTokens: {
      description: {
        part1: 'Tokens personalizados a serem usados.',
        part2: 'Veja a',
        part3: 'documentação',
        part4: 'para mais informações.',
        part5:
          '⚠️ Tokens personalizados podem ser código JavaScript arbitrário. Se mal escritos, podem causar perda de dados. Use por sua própria conta e risco.'
      },
      name: 'Tokens personalizados'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Ao colar/arrastar um arquivo com o mesmo nome de um arquivo existente, este separador será adicionado ao nome do arquivo.',
        part2: 'Por exemplo, ao arrastar o arquivo',
        part3: ', ele será renomeado para ',
        part4: ', etc, recebendo o primeiro nome disponível.'
      },
      name: 'Separador de nome duplicado'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Quando a pasta de anexos ficar vazia:'
      },
      name: 'Comportamento de pasta de anexos vazia'
    },
    excludePaths: {
      description: {
        part1: 'Excluir notas dos seguintes caminhos.',
        part2: 'Insira cada caminho em uma nova linha.',
        part3: 'Você pode usar string de caminho ou',
        part4: 'Se a configuração estiver vazia, nenhuma nota será excluída.'
      },
      name: 'Excluir caminhos'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Excluir anexos dos seguintes caminhos quando o comando',
        part2: 'Coletar anexos',
        part3: 'for executado.',
        part4: 'Insira cada caminho em uma nova linha.',
        part5: 'Você pode usar string de caminho ou',
        part6: 'Se a configuração estiver vazia, nenhum caminho será excluído da coleta de anexos.'
      },
      name: 'Excluir caminhos da coleta de anexos'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Veja os',
        part2: 'tokens disponíveis'
      },
      name: 'Nome do arquivo de anexo gerado'
    },
    includePaths: {
      description: {
        part1: 'Incluir notas dos seguintes caminhos.',
        part2: 'Insira cada caminho em uma nova linha.',
        part3: 'Você pode usar string de caminho ou',
        part4: 'Se a configuração estiver vazia, todas as notas serão incluídas.'
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
        part2: 'para usar o caminho relativo.',
        part3: 'Veja os',
        part4: 'tokens disponíveis',
        part5: 'Pastas que começam com ponto como',
        part6: 'não são recomendadas, pois o Obsidian não as rastreia. Você pode precisar usar um',
        part7: 'Plugin para gerenciá-las.'
      },
      name: 'Localização para novos anexos'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Formato da URL que será inserida no Markdown.',
        part2: 'Veja os',
        part3: 'tokens disponíveis',
        part4: 'Deixe em branco para usar o formato padrão.'
      },
      name: 'Formato de URL no Markdown'
    },
    renameAttachmentsToLowerCase: 'Renomear anexos para letras minúsculas',
    resetToSampleCustomTokens: {
      message: 'Tem certeza de que deseja redefinir os tokens personalizados para os tokens de exemplo? Suas alterações serão perdidas.',
      title: 'Redefinir para tokens de exemplo'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Se deve converter imagens coladas em JPEG. Aplica-se apenas quando o conteúdo da imagem PNG é colado diretamente da área de transferência. Tipicamente, para capturas de tela.',
      name: 'Converter imagens coladas para JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Se ativado, ao excluir a nota, seus anexos órfãos também serão excluídos.',
      name: 'Excluir anexos órfãos'
    },
    shouldRenameAttachmentFiles: {
      description: 'Se deve renomear arquivos de anexos quando uma nota é renomeada ou movida.',
      name: 'Renomear arquivos de anexos'
    },
    shouldRenameAttachmentFolders: {
      description: 'Se deve renomear pastas de anexos quando uma nota é renomeada ou movida.',
      name: 'Renomear pastas de anexos'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Se ativado, anexos processados via comando',
        part2: 'Coletar anexos',
        part3: 'serão renomeados de acordo com a configuração',
        part4: '.'
      },
      name: 'Renomear anexos coletados'
    },
    specialCharacters: {
      description: {
        part1: 'Caracteres especiais no nome da pasta ou do arquivo de anexos a serem substituídos ou removidos.',
        part2: 'Deixe em branco para preservar os caracteres especiais.'
      },
      name: 'Caracteres especiais'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'String de substituição para caracteres especiais no nome da pasta ou do arquivo de anexos.',
        part2: 'Deixe em branco para remover os caracteres especiais.'
      },
      name: 'Substituição de caracteres especiais'
    },
    timeoutInSeconds: {
      description: {
        part1: 'O tempo limite em segundos para todas as operações.',
        part2: 'Se',
        part3: 'estiver definido, o tempo limite de execução das operações será desativado.'
      },
      name: 'Tempo limite em segundos'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Tratar arquivos com estas extensões como anexos.',
        part2: 'Por padrão',
        part3: 'e',
        part4: 'arquivos vinculados não são tratados como anexos e não são movidos junto com a nota.',
        part5: 'Você pode adicionar extensões personalizadas, por exemplo,',
        part6: ', para sobrescrever esse comportamento.'
      },
      name: 'Tratar como extensões de anexos'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Visualizar arquivo anexo \'{{fullFileName}}\''
    },
    title: 'Forneça um valor para o token de prompt'
  },
  regularExpression: '/expressão regular/'
};
