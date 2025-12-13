import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const cs: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Chcete shromáždit přílohy pro všechny poznámky ve složkách rekurzivně?',
      part2: 'Tuto operaci nelze vrátit zpět.'
    },
    progressBar: {
      message: 'Shromažďování příloh {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Shromažďování příloh...'
    }
  },
  buttons: {
    copy: 'Kopírovat',
    move: 'Přesunout',
    previewAttachmentFile: 'Náhled souboru přílohy',
    skip: 'Přeskočit'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Příloha',
      part2: 'je odkazována více poznámkami.'
    },
    heading: 'Shromažďování přílohy používané více poznámkami',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Měla by se použít stejná akce pro jiné problematické přílohy'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Shromáždit přílohy v aktuální složce',
    collectAttachmentsCurrentNote: 'Shromáždit přílohy v aktuální poznámce',
    collectAttachmentsEntireVault: 'Shromáždit přílohy v celém úložišti'
  },
  menuItems: {
    collectAttachmentsInFile: 'Shromáždit přílohy v souboru',
    collectAttachmentsInFiles: 'Shromáždit přílohy v souborech'
  },
  notice: {
    collectingAttachments: 'Shromažďování příloh pro \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Shromažďování příloh zrušeno. Podrobnosti viz konzole.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Vygenerované jméno souboru přílohy \'{{path}}\' je neplatné.\n{{validationMessage}}\nZkontrolujte vaše',
      part2: 'nastavení.'
    },
    notePathIsIgnored: 'Cesta poznámky je ignorována'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Zrušit',
      ok: 'OK'
    },
    dataview: {
      itemsPerPage: 'Položek na stránku:',
      jumpToPage: 'Přejít na stránku:'
    },
    notices: {
      attachmentIsStillUsed: 'Příloha {{attachmentPath}} je stále používána jinými poznámkami. Nebude smazána.',
      unhandledError: 'Došlo k neošetřené chybě. Zkontrolujte prosím konzoli pro více informací.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'všechny soubory jsou přejmenovány.',
        displayText: 'Všechny'
      },
      none: {
        description: 'jejich názvy jsou zachovány.',
        displayText: 'Žádné'
      },
      onlyPastedImages: {
        description:
          'přejmenovány jsou pouze vložené obrázky. Platí pouze když je obsah PNG obrázku vložen přímo ze schránky. Typicky pro vkládání snímků obrazovky.',
        displayText: 'Pouze vložené obrázky'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'zrušit shromažďování příloh.',
        displayText: 'Zrušit'
      },
      copy: {
        description: 'zkopírovat přílohu na nové umístění.',
        displayText: 'Kopírovat'
      },
      move: {
        description: 'přesunout přílohu na nové umístění.',
        displayText: 'Přesunout'
      },
      prompt: {
        description: 'vyzvat uživatele k výběru akce.',
        displayText: 'Výzva'
      },
      skip: {
        description: 'přeskočit přílohu a pokračovat k další.',
        displayText: 'Přeskočit'
      }
    },
    defaultImageSizeDimension: {
      height: 'Výška',
      width: 'Šířka'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'smaže prázdnou složku příloh.',
        displayText: 'Smazat'
      },
      deleteWithEmptyParents: {
        description: 'smaže prázdnou složku příloh a její prázdné nadřazené složky.',
        displayText: 'Smazat s prázdnými nadřazenými'
      },
      keep: {
        description: 'zachová prázdnou složku příloh.',
        displayText: 'Zachovat'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Vlastní tokeny byly zakomentovány, protože musí být aktualizovány na nový formát zavedený ve verzi pluginu 9.0.0.\n// Odkazujte na dokumentaci (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) pro více informací.',
      deprecated: {
        part1: 'Ve verzi pluginu 9.0.0 se změnil formát registrace vlastních tokenů. Aktualizujte prosím své tokeny odpovídajícím způsobem. Odkazujte na',
        part2: 'dokumentaci',
        part3: 'pro více informací'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'Ve verzi pluginu 9.0.0 je',
      part2: 'nastavení zastaralé. Použijte',
      part3: 'formát místo toho. Viz',
      part4: 'dokumentace',
      part5: 'pro více informací'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Máte potenciálně nesprávnou hodnotu nastavenou pro',
        part2: 'formát. Odkazujte prosím na',
        part3: 'dokumentaci',
        part4: 'pro více informací',
        part5: 'Tato zpráva se již nebude zobrazovat.'
      }
    },
    specialCharacters: {
      part1: 'Ve verzi pluginu 9.16.0 se',
      part2: 'výchozí hodnota nastavení změnila. Vaše hodnota nastavení byla aktualizována na novou výchozí hodnotu.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'Výchozí velikost obrázku musí být v pixelech nebo procentech',
      invalidCustomTokensCode: 'Neplatný kód vlastních tokenů',
      invalidRegularExpression: 'Neplatný regulární výraz {{regExp}}',
      specialCharactersMustNotContainSlash: 'Speciální znaky nesmí obsahovat /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters: 'Náhrada speciálních znaků nesmí obsahovat neplatné znaky cesty názvu souboru.'
    },
    version: {
      part1: 'Váš soubor nastavení ',
      part2: 'má verzi',
      part3: 'která je novější než aktuální verze pluginu',
      part4: 'Plugin nemusí fungovat podle očekávání. Aktualizujte prosím plugin na nejnovější verzi nebo se ujistěte, že nastavení jsou správná.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Při připojování souborů:'
      },
      name: 'Režim přejmenování příloh'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Když je shromážděná příloha používána více poznámkami:'
      },
      name: 'Režim shromažďování přílohy používané více poznámkami'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'Viz dostupné',
        part2: 'tokeny',
        part3: 'Ponechte prázdné, chcete-li použít',
        part4: 'nastavení místo toho.'
      },
      name: 'Jméno souboru shromážděné přílohy'
    },
    customTokens: {
      description: {
        part1: 'Vlastní tokeny k použití.',
        part2: 'Viz',
        part3: 'dokumentace',
        part4: 'pro více informací.',
        part5: '⚠️ Vlastní tokeny mohou být libovolný JavaScript kód. Pokud jsou špatně napsané, mohou způsobit ztrátu dat. Používejte je na vlastní riziko.'
      },
      name: 'Vlastní tokeny'
    },
    defaultImageSize: {
      description: {
        part1: 'Výchozí velikost obrázku.',
        part2: 'Lze zadat v pixelech',
        part3: 'nebo jako procento z plné velikosti obrázku',
        part4: 'Ponechte prázdné, chcete-li použít původní velikost obrázku.'
      },
      name: 'Výchozí velikost obrázku'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Když vkládáte/přetahujete soubor se stejným názvem jako existující soubor, tento oddělovač bude přidán k názvu souboru.',
        part2: 'Např., když přetahujete soubor',
        part3: ', bude přejmenován na',
        part4: ', atd., získáním prvního dostupného názvu.'
      },
      name: 'Oddělovač duplicitních názvů'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Když se složka příloh stane prázdnou:'
      },
      name: 'Chování prázdné složky příloh'
    },
    excludePaths: {
      description: {
        part1: 'Vyloučit poznámky z následujících cest.',
        part2: 'Vložte každou cestu na nový řádek.',
        part3: 'Můžete použít řetězec cesty nebo',
        part4: 'Pokud je nastavení prázdné, žádné poznámky nejsou vyloučeny.'
      },
      name: 'Vyloučit cesty'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Vyloučit přílohy z následujících cest když',
        part2: 'Shromáždit přílohy',
        part3: 'příkaz je spuštěn.',
        part4: 'Vložte každou cestu na nový řádek.',
        part5: 'Můžete použít řetězec cesty nebo',
        part6: 'Pokud je nastavení prázdné, žádné cesty nejsou vyloučeny ze shromažďování příloh.'
      },
      name: 'Vyloučit cesty ze shromažďování příloh'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Viz dostupné',
        part2: 'tokeny'
      },
      name: 'Vygenerované jméno souboru přílohy'
    },
    includePaths: {
      description: {
        part1: 'Zahrnout poznámky z následujících cest.',
        part2: 'Vložte každou cestu na nový řádek.',
        part3: 'Můžete použít řetězec cesty nebo',
        part4: 'Pokud je nastavení prázdné, všechny poznámky jsou zahrnuty.'
      },
      name: 'Zahrnout cesty'
    },
    jpegQuality: {
      description: 'Čím menší kvalita, tím větší kompresní poměr.',
      name: 'Kvalita JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Začít s',
        part2: 'pro použití relativní cesty.',
        part3: 'Viz dostupné',
        part4: 'tokeny',
        part5: 'Tečkové složky jako',
        part6: 'nejsou doporučeny, protože Obsidian je nesleduje. Možná budete muset použít',
        part7: 'Plugin pro jejich správu.'
      },
      name: 'Umístění pro nové přílohy'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Formát pro URL, které bude vloženo do Markdown.',
        part2: 'Viz dostupné',
        part3: 'tokeny',
        part4: 'Ponechte prázdné pro použití výchozího formátu.'
      },
      name: 'Formát URL Markdown'
    },
    renameAttachmentsToLowerCase: 'Přejmenovat přílohy na malá písmena',
    renamedAttachmentFileName: {
      description: {
        part1: 'Viz dostupné',
        part2: 'tokeny',
        part3: 'Ponechte prázdné, chcete-li použít',
        part4: 'nastavení místo toho.'
      },
      name: 'Jméno souboru přejmenované přílohy'
    },
    resetToSampleCustomTokens: {
      message: 'Jste si jisti, že chcete resetovat vlastní tokeny na ukázkové vlastní tokeny? Vaše změny budou ztraceny.',
      title: 'Resetovat na ukázkové vlastní tokeny'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Zda převést vložené obrázky na JPEG. Platí pouze když je obsah PNG obrázku vložen přímo ze schránky. Typicky pro vkládání snímků obrazovky.',
      name: 'Zda převést vložené obrázky na JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Pokud je povoleno, když je poznámka smazána, její sirotčí přílohy jsou také smazány.',
      name: 'Zda smazat sirotčí přílohy'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'Pokud je povoleno, když je poznámka přejmenována nebo přesunuta, její přílohy budou přejmenovány podle',
        part2: 'nastavení.'
      },
      name: 'Zda přejmenovat soubory příloh'
    },
    shouldRenameAttachmentFolders: {
      description: 'Zda přejmenovat složky příloh když je poznámka přejmenována nebo přesunuta.',
      name: 'Zda přejmenovat složky příloh'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Pokud je povoleno, přílohy zpracované přes',
        part2: 'Shromáždit přílohy',
        part3: 'příkazy budou přejmenovány podle',
        part4: 'nastavení.'
      },
      name: 'Zda přejmenovat shromážděné přílohy'
    },
    specialCharacters: {
      description: {
        part1: 'Speciální znaky ve složce příloh a názvu souboru k nahrazení nebo odstranění.',
        part2: 'Ponechte prázdné pro zachování speciálních znaků.'
      },
      name: 'Speciální znaky'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Náhradní řetězec pro speciální znaky ve složce příloh a názvu souboru.',
        part2: 'Ponechte prázdné pro odstranění speciálních znaků.'
      },
      name: 'Náhrada speciálních znaků'
    },
    timeoutInSeconds: {
      description: {
        part1: 'Časový limit v sekundách pro všechny operace.',
        part2: 'Pokud je',
        part3: 'nastaveno, časový limit provádění operací je zakázán.'
      },
      name: 'Časový limit v sekundách'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Zacházet se soubory s těmito příponami jako s přílohami.',
        part2: 'Ve výchozím nastavení',
        part3: 'a',
        part4: 'propojené soubory nejsou považovány za přílohy a nejsou přesunovány s poznámkou.',
        part5: 'Můžete přidat vlastní přípony, např.',
        part6: ', pro přepsání tohoto chování.'
      },
      name: 'Zacházet jako s příponami příloh'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Náhled souboru přílohy \'{{fullFileName}}\''
    },
    title: 'Poskytněte hodnotu pro token výzvy'
  },
  regularExpression: '/regulární výraz/'
};
