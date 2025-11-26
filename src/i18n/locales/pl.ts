import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const pl: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Czy chcesz zebrać załączniki dla wszystkich notatek w folderze:',
      part2: 'i wszystkich jego podfolderach?',
      part3: 'Ta operacja nie może zostać cofnięta.'
    },
    progressBar: {
      message: 'Zbieranie załączników {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Zbieranie załączników...'
    }
  },
  buttons: {
    copy: 'Kopiuj',
    move: 'Przenieś',
    previewAttachmentFile: 'Podgląd pliku załącznika',
    skip: 'Pomiń'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Załącznik',
      part2: 'jest używany przez wiele notatek.'
    },
    heading: 'Zbieranie załącznika używanego przez wiele notatek',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Użyj tej samej akcji dla innych problematycznych załączników'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Zbierz załączniki w bieżącym folderze',
    collectAttachmentsCurrentNote: 'Zbierz załączniki w bieżącej notatce',
    collectAttachmentsEntireVault: 'Zbierz załączniki w całym sejfie'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Zbierz załączniki w folderze'
  },
  notice: {
    collectingAttachments: 'Zbieranie załączników dla \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Zbieranie załączników anulowane. Zobacz konsolę dla szczegółów.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Wygenerowana nazwa pliku załącznika \'{{path}}\' jest nieprawidłowa.\n{{validationMessage}}\nSprawdź swoje',
      part2: 'ustawienie.'
    },
    notePathIsIgnored: 'Ścieżka notatki jest ignorowana'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Anuluj',
      ok: 'OK'
    },
    dataview: {
      itemsPerPage: 'Elementy na stronie:',
      jumpToPage: 'Przejdź do strony:'
    },
    notices: {
      attachmentIsStillUsed: 'Załącznik {{attachmentPath}} jest nadal używany przez inne notatki. Nie zostanie usunięty.',
      unhandledError: 'Wystąpił nieobsługiwany błąd. Sprawdź konsolę dla więcej informacji.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'wszystkie pliki są przemianowywane.',
        displayText: 'Wszystkie'
      },
      none: {
        description: 'ich nazwy są zachowane.',
        displayText: 'Żadne'
      },
      onlyPastedImages: {
        description:
          'tylko wklejone obrazy są przemianowywane. Dotyczy tylko sytuacji, gdy zawartość obrazu PNG jest wklejana bezpośrednio ze schowka. Zazwyczaj do wklejania zrzutów ekranu.',
        displayText: 'Tylko wklejone obrazy'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'anuluj zbieranie załączników.',
        displayText: 'Anuluj'
      },
      copy: {
        description: 'skopiuj załącznik do nowej lokalizacji.',
        displayText: 'Kopiuj'
      },
      move: {
        description: 'przenieś załącznik do nowej lokalizacji.',
        displayText: 'Przenieś'
      },
      prompt: {
        description: 'zapytaj użytkownika o wybór akcji.',
        displayText: 'Zapytaj'
      },
      skip: {
        description: 'pomiń załącznik i przejdź do następnego.',
        displayText: 'Pomiń'
      }
    },
    defaultImageSizeDimension: {
      height: 'Wysokość',
      width: 'Szerokość'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'usunie pusty folder załączników.',
        displayText: 'Usuń'
      },
      deleteWithEmptyParents: {
        description: 'usunie pusty folder załączników i jego puste foldery nadrzędne.',
        displayText: 'Usuń z pustymi rodzicami'
      },
      keep: {
        description: 'zachowa pusty folder załączników.',
        displayText: 'Zachowaj'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Niestandardowe tokeny zostały zakomentowane, ponieważ muszą zostać zaktualizowane do nowego formatu wprowadzonego w wersji wtyczki 9.0.0.\n// Zapoznaj się z dokumentacją (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens), aby uzyskać więcej informacji.',
      deprecated: {
        part1: 'W wersji wtyczki 9.0.0 zmienił się format rejestracji niestandardowych tokenów. Proszę zaktualizować swoje tokeny odpowiednio. Zapoznaj się z',
        part2: 'dokumentacją',
        part3: 'aby uzyskać więcej informacji'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'W wersji wtyczki 9.0.0',
      part2: 'to ustawienie zostało wycofane. Użyj',
      part3: 'formatu zamiast tego. Zobacz',
      part4: 'dokumentację',
      part5: 'aby uzyskać więcej informacji'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Możesz mieć ustawioną potencjalnie niepoprawną wartość dla',
        part2: 'formatu. Proszę zapoznać się z',
        part3: 'dokumentacją',
        part4: 'aby uzyskać więcej informacji',
        part5: 'Ta wiadomość nie zostanie ponownie wyświetlona.'
      }
    },
    specialCharacters: {
      part1: 'W wersji wtyczki 9.16.0',
      part2: 'domyślna wartość ustawienia została zmieniona. Twoje ustawienie zostało zaktualizowane do nowej wartości domyślnej.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'Domyślny rozmiar obrazu musi być w pikselach lub procentach',
      invalidCustomTokensCode: 'Nieprawidłowy kod niestandardowych tokenów',
      invalidRegularExpression: 'Nieprawidłowe wyrażenie regularne {{regExp}}',
      specialCharactersMustNotContainSlash: 'Znaki specjalne nie mogą zawierać /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'Zamiana znaków specjalnych nie może zawierać nieprawidłowych znaków ścieżki nazwy pliku.'
    },
    version: {
      part1: 'Twój plik ustawień ',
      part2: 'ma wersję',
      part3: 'która jest nowsza niż bieżąca wersja wtyczki',
      part4: 'Wtyczka może nie działać zgodnie z oczekiwaniami. Zaktualizuj wtyczkę do najnowszej wersji lub upewnij się, że ustawienia są poprawne.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Podczas dołączania plików:'
      },
      name: 'Tryb przemianowania załączników'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Gdy zebrany załącznik jest używany przez wiele notatek:'
      },
      name: 'Tryb zbierania załączników używanych przez wiele notatek'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'Zobacz dostępne',
        part2: 'tokeny'
      },
      name: 'Zebrana nazwa pliku załącznika'
    },
    customTokens: {
      description: {
        part1: 'Niestandardowe tokeny do użycia.',
        part2: 'Zobacz',
        part3: 'dokumentację',
        part4: 'aby uzyskać więcej informacji.',
        part5:
          '⚠️ Niestandardowe tokeny mogą być dowolnym kodem JavaScript. Jeśli są napisane nieprawidłowo, mogą spowodować utratę danych. Używasz ich na własne ryzyko.'
      },
      name: 'Niestandardowe tokeny'
    },
    defaultImageSize: {
      description: {
        part1: 'Domyślny rozmiar obrazu.',
        part2: 'Można określić w pikselach',
        part3: 'lub jako procent pełnego rozmiaru obrazu',
        part4: 'Pozostaw puste, aby użyć oryginalnego rozmiaru obrazu.'
      },
      name: 'Domyślny rozmiar obrazu'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Gdy wklejasz/przeciągasz plik o tej samej nazwie co istniejący plik, ten separator zostanie dodany do nazwy pliku.',
        part2: 'Np. gdy przeciągasz plik',
        part3: ', zostanie on przemianowany na ',
        part4: ', itd., aż do pierwszej dostępnej nazwy.'
      },
      name: 'Separator duplikowanych nazw'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Gdy folder załączników stanie się pusty:'
      },
      name: 'Zachowanie pustego folderu załączników'
    },
    excludePaths: {
      description: {
        part1: 'Wyklucz notatki z następujących ścieżek.',
        part2: 'Wstaw każdą ścieżkę w nowej linii.',
        part3: 'Możesz użyć ciągu ścieżki lub wyrażenia regularnego.',
        part4: 'Jeśli ustawienie jest puste, żadna notatka nie jest wykluczana.'
      },
      name: 'Wyklucz ścieżki'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Wyklucz załączniki z następujących ścieżek, gdy wykonywane jest polecenie',
        part2: 'Zbierz załączniki',
        part3: '.',
        part4: 'Wstaw każdą ścieżkę w nowej linii.',
        part5: 'Możesz użyć ciągu ścieżki lub wyrażenia regularnego.',
        part6: 'Jeśli ustawienie jest puste, żadne ścieżki nie są wykluczane ze zbierania załączników.'
      },
      name: 'Wyklucz ścieżki ze zbierania załączników'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Zobacz dostępne',
        part2: 'tokeny'
      },
      name: 'Wygenerowana nazwa pliku załącznika'
    },
    includePaths: {
      description: {
        part1: 'Uwzględnij notatki z następujących ścieżek.',
        part2: 'Wstaw każdą ścieżkę w nowej linii.',
        part3: 'Możesz użyć ciągu ścieżki lub wyrażenia regularnego.',
        part4: 'Jeśli ustawienie jest puste, wszystkie notatki są uwzględniane.'
      },
      name: 'Uwzględnij ścieżki'
    },
    jpegQuality: {
      description: 'Im mniejsza jakość, tym większy współczynnik kompresji.',
      name: 'Jakość JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Zacznij od',
        part2: 'aby użyć ścieżki względnej.',
        part3: 'Zobacz dostępne',
        part4: 'tokeny',
        part5: 'Foldery kropkowe, takie jak',
        part6: 'nie są zalecane, ponieważ Obsidian ich nie śledzi. Możesz potrzebować użyć',
        part7: 'wtyczki, aby nimi zarządzać.'
      },
      name: 'Lokalizacja nowych załączników'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Format adresu URL, który zostanie wstawiony do Markdown.',
        part2: 'Zobacz dostępne',
        part3: 'tokeny',
        part4: 'Pozostaw puste, aby użyć domyślnego formatu.'
      },
      name: 'Format adresu URL w Markdown'
    },
    renameAttachmentsToLowerCase: 'Przemianuj załączniki na małe litery',
    renamedAttachmentFileName: {
      description: {
        part1: 'Zobacz dostępne',
        part2: 'tokeny'
      },
      name: 'Przemianowana nazwa pliku załącznika'
    },
    resetToSampleCustomTokens: {
      message: 'Czy na pewno chcesz zresetować niestandardowe tokeny do przykładowych? Twoje zmiany zostaną utracone.',
      title: 'Resetuj do przykładowych niestandardowych tokenów'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Czy konwertować wklejone obrazy do JPEG. Dotyczy tylko sytuacji, gdy zawartość obrazu PNG jest wklejana bezpośrednio ze schowka (zazwyczaj przy wklejaniu zrzutów ekranu).',
      name: 'Czy konwertować wklejone obrazy do JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Jeśli włączone, po usunięciu notatki jej osierocone załączniki zostaną również usunięte.',
      name: 'Czy usuwać osierocone załączniki'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'Jeśli włączone, gdy notatka jest przemianowana lub przeniesiona, jej załączniki będą przemianowane zgodnie z',
        part2: 'ustawieniem.'
      },
      name: 'Czy przemianować pliki załączników'
    },
    shouldRenameAttachmentFolders: {
      description: 'Czy przemianowywać foldery załączników, gdy notatka jest przemianowana lub przeniesiona.',
      name: 'Czy przemianować foldery załączników'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Jeśli włączone, załączniki przetworzone przez polecenia',
        part2: 'Zbierz załączniki',
        part3: 'zostaną przemianowane zgodnie z ustawieniem',
        part4: '.'
      },
      name: 'Czy przemianować zebrane załączniki'
    },
    specialCharacters: {
      description: {
        part1: 'Znaki specjalne w nazwie folderu i pliku załącznika do zastąpienia lub usunięcia.',
        part2: 'Pozostaw puste, aby zachować znaki specjalne.'
      },
      name: 'Znaki specjalne'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Ciąg zastępujący znaki specjalne w nazwie folderu i pliku załącznika.',
        part2: 'Pozostaw puste, aby usuwać znaki specjalne.'
      },
      name: 'Zamiana znaków specjalnych'
    },
    timeoutInSeconds: {
      description: {
        part1: 'Limit czasu (w sekundach) dla wszystkich operacji.',
        part2: 'Jeśli ustawisz',
        part3: 'na 0, limit czasu zostanie wyłączony.'
      },
      name: 'Limit czasu w sekundach'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Traktuj pliki z tymi rozszerzeniami jako załączniki.',
        part2: 'Domyślnie',
        part3: 'i',
        part4: 'połączone pliki nie są traktowane jako załączniki i nie są przenoszone wraz z notatką.',
        part5: 'Możesz dodać niestandardowe rozszerzenia, np.',
        part6: ', aby zastąpić to zachowanie.'
      },
      name: 'Traktuj jako rozszerzenia załączników'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Podgląd pliku załącznika \'{{fullFileName}}\''
    },
    title: 'Podaj wartość dla tokena promptu'
  },
  regularExpression: '/wyrażenie regularne/'
};
