import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const ga: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Ar mhaith leat na ceangaltáin a bhailiú do gach nóta i bhfillteáin go hathchúrsach?',
      part2: 'Ní féidir an oibríocht seo a chealú.'
    },
    progressBar: {
      message: 'Ag bailiú ceangaltán {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Ag bailiú ceangaltán...'
    }
  },
  buttons: {
    copy: 'Cóipeáil',
    move: 'Bog',
    previewAttachmentFile: 'Réamhamharc comhad ceangaltáin',
    skip: 'Léim thar'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Tá an ceangaltán',
      part2: 'in úsáid ag nótaí iomadúla.'
    },
    heading: 'Ag bailiú ceangaltáin atá in úsáid ag nótaí iomadúla',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Ba chóir an gníomh céanna a úsáid do cheangaltáin fhadhbach eile'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Bailigh ceangaltáin san fhillteán reatha',
    collectAttachmentsCurrentNote: 'Bailigh ceangaltáin sa nóta reatha',
    collectAttachmentsEntireVault: 'Bailigh ceangaltáin sa taisc iomplán'
  },
  menuItems: {
    collectAttachmentsInFile: 'Bailigh ceangaltáin sa chomhad',
    collectAttachmentsInFiles: 'Bailigh ceangaltáin sna comhaid'
  },
  notice: {
    collectingAttachments: 'Ag bailiú ceangaltán do \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Cealaigh bailiú ceangaltán. Féach ar an consól le haghaidh sonraí.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Tá ainm comhad ceangaltáin ginte \'{{path}}\' neamhbhailí.\n{{validationMessage}}\nSeiceáil do',
      part2: 'socruithe.'
    },
    notePathIsIgnored: 'Tá conair an nóta á neamhaird'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Cealaigh',
      ok: 'Tá go maith'
    },
    dataview: {
      itemsPerPage: 'Míreanna in aghaidh na leathanach:',
      jumpToPage: 'Léim chuig leathanach:'
    },
    notices: {
      attachmentIsStillUsed: 'Tá ceangaltán {{attachmentPath}} fós in úsáid ag nótaí eile. Ní scriosfar é.',
      unhandledError: 'Tharla earráid nár láimhseáladh. Seiceáil an consól le haghaidh tuilleadh eolais.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'tá na comhaid go léir athainmnithe.',
        displayText: 'Uile'
      },
      none: {
        description: 'tá a n-ainmneacha caomhnaithe.',
        displayText: 'Dada'
      },
      onlyPastedImages: {
        description:
          'ní athainmnítear ach íomhánna greamaithe. Bainean seo leis nuair a ghreamaitear ábhair íomhá PNG ón ghearrtáisce go díreach. Go típúl, chun grênghrafaí a ghreamadh.',
        displayText: 'Íomhánna greamaithe amháin'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'cealaigh bailiú ceangaltán.',
        displayText: 'Cealaigh'
      },
      copy: {
        description: 'cóipeáil an ceangaltán chuig an suíomh nua.',
        displayText: 'Cóipeáil'
      },
      move: {
        description: 'bog an ceangaltán chuig an suíomh nua.',
        displayText: 'Bog'
      },
      prompt: {
        description: 'cuir an t-úsáideoir faoi deara an gníomh a roghnú.',
        displayText: 'Cuir faoi deara'
      },
      skip: {
        description: 'léim thar an ceangaltán agus lean ar aghaidh chuig an chéad cheann eile.',
        displayText: 'Léim thar'
      }
    },
    defaultImageSizeDimension: {
      height: 'Airde',
      width: 'Leithead'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'scriosfaidh an fhillteán ceangaltán folamh.',
        displayText: 'Scrios'
      },
      deleteWithEmptyParents: {
        description: 'scriosfaidh an fhillteán ceangaltán folamh agus a chuid fhillteán tuismitheora folamh.',
        displayText: 'Scrios le tuismitheoirí folamh'
      },
      keep: {
        description: 'coimeádfaidh an fhillteán ceangaltán folamh.',
        displayText: 'Coimeád'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Cuireadh comharthaí saincheaptha i gcomhrá mar gheall ar gá iad a nuashonrú chuig an fhormáid nua a tugadh isteach i leagan 9.0.0 an phlugain.\n// Féach ar an doiciméadú (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) le haghaidh tuilleadh eolais.',
      deprecated: {
        part1: 'I leagan 9.0.0 an phlugain, d\'athraigh formáid chlárúcháin comharthaí saincheaptha. Nuashonraigh do chomharthaí dá réir. Féach ar an',
        part2: 'doiciméadú',
        part3: 'le haghaidh tuilleadh eolais'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'I leagan 9.0.0 an phlugain, tá an',
      part2: 'socrú as feidhm. Úsáid an',
      part3: 'formáid ina ionad. Féach ar an',
      part4: 'doiciméadú',
      part5: 'le haghaidh tuilleadh eolais'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Tá luach neamhcheart agat ar an',
        part2: 'formáid. Féach ar an',
        part3: 'doiciméadú',
        part4: 'le haghaidh tuilleadh eolais',
        part5: 'Ní thaispeánfar an teachtaireacht seo arís.'
      }
    },
    specialCharacters: {
      part1: 'I leagan 9.16.0 an phlugain, d\'athraigh an',
      part2: 'luach socrú réamhshocraithe. Nuashonraíodh do luach socrú chuig an luach réamhshocraithe nua.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'Caithfidh méid réamhshocraithe na híomhá a bheith i bpicteilíní nó i gcéatadán',
      invalidCustomTokensCode: 'Cód comharthaí saincheaptha neamhbhailí',
      invalidRegularExpression: 'Slonn rialta neamhbhailí {{regExp}}',
      specialCharactersMustNotContainSlash: 'Níor cheart go mbeadh / sna carachtair speisialta',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'Níor cheart go mbeadh carachtair conair ainm comhaid neamhbhailí in ionadú carachtar speisialta.'
    },
    version: {
      part1: 'Tá leagan',
      part2: 'ag do chomhad socruithe',
      part3: 'atá níos nua ná leagan reatha an phlugain',
      part4:
        'D\'fhéadfadh nach n-oibreodh an plugan mar a bhíothas ag súil. Nuashonraigh an plugan chuig an leagan is déanaí nó déan cinnte go bhfuil na socruithe ceart.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Nuair a bhíonn comhaid á gceangal:'
      },
      name: 'Mód athainmnithe ceangaltán'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Nuair a bhíonn an ceangaltán bailithe in úsáid ag nótaí iomadúla:'
      },
      name: 'Mód bailiú ceangaltán atá in úsáid ag nótaí iomadúla'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'Féach ar na',
        part2: 'comharthaí atá ar fáil',
        part3: 'Fág folamh chun',
        part4: 'a úsáid ina ionad.'
      },
      name: 'Ainm comhad ceangaltán bailithe'
    },
    customTokens: {
      description: {
        part1: 'Comharthaí saincheaptha le húsáid.',
        part2: 'Féach ar an',
        part3: 'doiciméadú',
        part4: 'le haghaidh tuilleadh eolais.',
        part5:
          '⚠️ Is féidir le comharthaí saincheaptha a bheith ina chód JavaScript treallach. Má tá siad drochscríofa, is féidir leo cailliúint sonraí a chur faoi deara. Úsáid iad ar do riosca féin.'
      },
      name: 'Comharthaí saincheaptha'
    },
    defaultImageSize: {
      description: {
        part1: 'Méid réamhshocraithe na híomhá.',
        part2: 'Is féidir a shonrú i bpicteilíní',
        part3: 'nó i gcéatadán de mhéid na híomhá iomláine',
        part4: 'Fág folamh chun an méid bunaidh a úsáid.'
      },
      name: 'Méid réamhshocraithe na híomhá'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Nuair a bhíonn tú ag greamadh/tarraint comhad leis an ainm céanna le comhad atá ann cheana, cuirfear an deighilteoir seo leis an ainm comhaid.',
        part2: 'M.sh., nuair a bhíonn tú ag tarraint an chomhaid',
        part3: ', athainmneofar é go',
        part4: ', srl., ag fáil an chéad ainm atá ar fáil.'
      },
      name: 'Deighilteoir ainm dúbailte'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Nuair a bhíonn an fhillteán ceangaltán folamh:'
      },
      name: 'Iompar fhillteán ceangaltán folamh'
    },
    excludePaths: {
      description: {
        part1: 'Eisigh nótaí ó na conairí seo a leanas.',
        part2: 'Cuir isteach gach conair ar líne nua.',
        part3: 'Is féidir leat teaghrán conair nó',
        part4: 'a úsáid. Má tá an socrú folamh, ní eisítear aon nótaí.'
      },
      name: 'Conairí a eisíomh'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Eisigh ceangaltáin ó na conairí seo a leanas nuair a',
        part2: 'Bailigh ceangaltáin',
        part3: 'a fhorghníomhaítear an t-ordú.',
        part4: 'Cuir isteach gach conair ar líne nua.',
        part5: 'Is féidir leat teaghrán conair nó',
        part6: 'a úsáid. Má tá an socrú folamh, ní eisítear aon chonairí ó bhailiú ceangaltán.'
      },
      name: 'Conairí a eisíomh ó bhailiú ceangaltán'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Féach ar na',
        part2: 'comharthaí atá ar fáil'
      },
      name: 'Ainm comhad ceangaltán ginte'
    },
    includePaths: {
      description: {
        part1: 'Cuir nótaí ó na conairí seo a leanas san áireamh.',
        part2: 'Cuir isteach gach conair ar líne nua.',
        part3: 'Is féidir leat teaghrán conair nó',
        part4: 'a úsáid. Má tá an socrú folamh, cuirtear gach nóta san áireamh.'
      },
      name: 'Conairí a chur san áireamh'
    },
    jpegQuality: {
      description: 'Dá laghad an cáilíocht, is mó an cóimheas comhbhrú.',
      name: 'Cáilíocht JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Tosaigh le',
        part2: 'chun conair choibhneasta a úsáid.',
        part3: 'Féach ar na',
        part4: 'comharthaí atá ar fáil',
        part5: 'Ní mholtar fhillteáin ponc mar',
        part6: 'mar ní dhéanann Obsidian iad a rianú. D\'fhéadfadh gur gá duit',
        part7: 'Plugan a úsáid chun iad a bhainistiú.'
      },
      name: 'Suíomh do cheangaltáin nua'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Formáid don URL a chuirfear isteach i Markdown.',
        part2: 'Féach ar na',
        part3: 'comharthaí atá ar fáil',
        part4: 'Fág bán chun an fhormáid réamhshocraithe a úsáid.'
      },
      name: 'Formáid URL Markdown'
    },
    renameAttachmentsToLowerCase: 'Athainmnigh ceangaltáin go litreacha beaga',
    renamedAttachmentFileName: {
      description: {
        part1: 'Féach ar na',
        part2: 'comharthaí atá ar fáil',
        part3: 'Fág folamh chun',
        part4: 'a úsáid ina ionad.'
      },
      name: 'Ainm comhad ceangaltán athainmnithe'
    },
    resetToSampleCustomTokens: {
      message: 'An bhfuil tú cinnte gur mhaith leat na comharthaí saincheaptha a athshocrú chuig na comharthaí saincheaptha samplacha? Caillfear do athruithe.',
      title: 'Athshocraigh chuig comharthaí saincheaptha samplacha'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Cibé an gcaithfear íomhánna greamaithe a thiontú go JPEG. Baineann seo leis nuair a ghreamaitear ábhair íomhá PNG ón ghearrtáisce go díreach. Go típúl, chun grênghrafaí a ghreamadh.',
      name: 'An gcaithfear íomhánna greamaithe a thiontú go JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Má tá sé cumasaithe, nuair a scriostar an nóta, scriostar a cheangaltáin dílleachta freisin.',
      name: 'An gcaithfear ceangaltáin dílleachta a scriosadh'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'Má tá sé cumasaithe, nuair a athainmnítear nó a aistrítear nóta, athainmneofar a chomhaid ceangaltán de réir an',
        part2: 'socraithe.'
      },
      name: 'An gcaithfear comhaid ceangaltán a athainmniú'
    },
    shouldRenameAttachmentFolders: {
      description: 'Cibé an gcaithfear fhillteáin ceangaltán a athainmniú nuair a athainmnítear nó a aistrítear nóta.',
      name: 'An gcaithfear fhillteáin ceangaltán a athainmniú'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Má tá sé cumasaithe, athainmneofar ceangaltáin a phróiseáladh trí',
        part2: 'Bailigh ceangaltáin',
        part3: 'orduithe de réir an',
        part4: 'socraithe.'
      },
      name: 'An gcaithfear ceangaltáin bailithe a athainmniú'
    },
    specialCharacters: {
      description: {
        part1: 'Carachtair speisialta i bhfillteán ceangaltán agus ainm comhaid le cur in ionad nó a bhaint.',
        part2: 'Fág bán chun carachtair speisialta a chaomhnú.'
      },
      name: 'Carachtair speisialta'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Teaghrán ionadaíochta do charachtair speisialta i bhfillteán ceangaltán agus ainm comhaid.',
        part2: 'Fág bán chun carachtair speisialta a bhaint.'
      },
      name: 'Ionadú carachtar speisialta'
    },
    timeoutInSeconds: {
      description: {
        part1: 'An t-am amach i soicindí do gach oibríocht.',
        part2: 'Má tá',
        part3: 'socraithe, tá t-am amach fhorghníomhaithe oibríochtaí díchumasaithe.'
      },
      name: 'T-am amach i soicindí'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Déileáil le comhaid leis na síntí seo mar cheangaltáin.',
        part2: 'De réir réamhshocraithe, ní dhéantar',
        part3: 'agus',
        part4: 'comhaid nasctha a thabhairt mar cheangaltáin agus ní aistrítear iad leis an nóta.',
        part5: 'Is féidir leat síntí saincheaptha a chur leis, m.sh.',
        part6: ', chun an t-iompar seo a shárú.'
      },
      name: 'Déileáil mar shíntí ceangaltán'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Réamhamharc comhad ceangaltáin \'{{fullFileName}}\''
    },
    title: 'Soláthair luach don chomhartha cuir faoi deara'
  },
  regularExpression: '/slonn rialta/'
};
