import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const ko: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: '폴더의 모든 노트에 대해 첨부 파일을 재귀적으로 수집하시겠습니까?',
      part2: '이 작업은 되돌릴 수 없습니다.'
    },
    progressBar: {
      message: '첨부 파일 수집 중 {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: '첨부 파일 수집 중...'
    }
  },
  buttons: {
    copy: '복사',
    move: '이동',
    previewAttachmentFile: '첨부 파일 미리보기',
    skip: '건너뛰기'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: '첨부 파일',
      part2: '이 여러 노트에서 참조되고 있습니다.'
    },
    heading: '여러 노트에서 사용되는 첨부 파일 수집',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: '다른 문제가 있는 첨부 파일에 대해서도 같은 동작을 사용해야 합니다'
  },
  commands: {
    collectAttachmentsCurrentFolder: '현재 폴더의 첨부 파일 수집',
    collectAttachmentsCurrentNote: '현재 노트의 첨부 파일 수집',
    collectAttachmentsEntireVault: '전체 볼트의 첨부 파일 수집'
  },
  menuItems: {
    collectAttachmentsInFile: '파일에서 첨부 파일 수집',
    collectAttachmentsInFiles: '여러 파일에서 첨부 파일 수집'
  },
  notice: {
    collectingAttachments: '\'{{noteFilePath}}\'의 첨부 파일 수집 중',
    collectingAttachmentsCancelled: '첨부 파일 수집이 취소되었습니다. 자세한 내용은 콘솔을 확인하세요.',
    generatedAttachmentFileNameIsInvalid: {
      part1: '생성된 첨부 파일 이름 \'{{path}}\'이(가) 유효하지 않습니다.\n{{validationMessage}}\n설정을',
      part2: '확인하세요.'
    },
    notePathIsIgnored: '노트 경로가 무시됩니다'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: '취소',
      ok: '확인'
    },
    dataview: {
      itemsPerPage: '페이지당 항목 수:',
      jumpToPage: '페이지로 이동:'
    },
    notices: {
      attachmentIsStillUsed: '첨부 파일 {{attachmentPath}}이(가) 다른 노트에서 여전히 사용되고 있습니다. 삭제되지 않습니다.',
      unhandledError: '처리되지 않은 오류가 발생했습니다. 자세한 내용은 콘솔을 확인하세요.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: '모든 파일의 이름이 변경됩니다.',
        displayText: '모두'
      },
      none: {
        description: '이름이 보존됩니다.',
        displayText: '없음'
      },
      onlyPastedImages: {
        description:
          '붙여넣은 이미지만 이름이 변경됩니다. PNG 이미지 내용이 클립보드에서 직접 붙여넣어질 때만 적용됩니다. 일반적으로 스크린샷 붙여넣기에 사용됩니다.',
        displayText: '붙여넣은 이미지만'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: '첨부 파일 수집을 취소합니다.',
        displayText: '취소'
      },
      copy: {
        description: '첨부 파일을 새 위치에 복사합니다.',
        displayText: '복사'
      },
      move: {
        description: '첨부 파일을 새 위치로 이동합니다.',
        displayText: '이동'
      },
      prompt: {
        description: '사용자에게 동작을 선택하도록 요청합니다.',
        displayText: '요청'
      },
      skip: {
        description: '첨부 파일을 건너뛰고 다음으로 진행합니다.',
        displayText: '건너뛰기'
      }
    },
    defaultImageSizeDimension: {
      height: '높이',
      width: '너비'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: '빈 첨부 파일 폴더를 삭제합니다.',
        displayText: '삭제'
      },
      deleteWithEmptyParents: {
        description: '빈 첨부 파일 폴더와 빈 상위 폴더들을 삭제합니다.',
        displayText: '빈 상위 폴더와 함께 삭제'
      },
      keep: {
        description: '빈 첨부 파일 폴더를 유지합니다.',
        displayText: '유지'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// 사용자 정의 토큰은 플러그인 버전 9.0.0에서 도입된 새 형식으로 업데이트해야 하므로 주석 처리되었습니다.\n// 자세한 내용은 문서(https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens)를 참조하세요.',
      deprecated: {
        part1: '플러그인 버전 9.0.0에서 사용자 정의 토큰 등록 형식이 변경되었습니다. 토큰을 적절히 업데이트하세요. 자세한 내용은',
        part2: '문서',
        part3: '를 참조하세요'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: '플러그인 버전 9.0.0에서',
      part2: '설정이 더 이상 사용되지 않습니다. 대신',
      part3: '형식을 사용하세요. 자세한 내용은',
      part4: '문서',
      part5: '를 참조하세요'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: '다음 형식에 대해 잘못된 값이 설정되었을 수 있습니다',
        part2: '. 자세한 내용은',
        part3: '문서',
        part4: '를 참조하세요',
        part5: '이 메시지는 다시 표시되지 않습니다.'
      }
    },
    specialCharacters: {
      part1: '플러그인 버전 9.16.0에서',
      part2: '기본 설정 값이 변경되었습니다. 설정 값이 새로운 기본 값으로 업데이트되었습니다.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: '기본 이미지 크기는 픽셀 또는 백분율이어야 합니다',
      invalidCustomTokensCode: '유효하지 않은 사용자 정의 토큰 코드',
      invalidRegularExpression: '유효하지 않은 정규식 {{regExp}}',
      specialCharactersMustNotContainSlash: '특수 문자에는 /가 포함되어서는 안 됩니다',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters: '특수 문자 대체에는 유효하지 않은 파일 이름 경로 문자가 포함되어서는 안 됩니다.'
    },
    version: {
      part1: '설정 파일 ',
      part2: '의 버전이',
      part3: '현재 플러그인 버전보다 새 버전입니다',
      part4: '플러그인이 예상대로 작동하지 않을 수 있습니다. 플러그인을 최신 버전으로 업데이트하거나 설정이 올바른지 확인하세요.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: '파일을 첨부할 때:'
      },
      name: '첨부 파일 이름 변경 모드'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: '수집된 첨부 파일이 여러 노트에서 사용될 때:'
      },
      name: '여러 노트에서 사용되는 첨부 파일 수집 모드'
    },
    collectedAttachmentFileName: {
      description: {
        part1: '사용 가능한',
        part2: '토큰을 참조하세요'
      },
      name: '수집된 첨부 파일 이름'
    },
    customTokens: {
      description: {
        part1: '사용할 사용자 정의 토큰입니다.',
        part2: '자세한 내용은',
        part3: '문서',
        part4: '를 참조하세요.',
        part5: '⚠️ 사용자 정의 토큰은 임의의 JavaScript 코드일 수 있습니다. 잘못 작성되면 데이터 손실을 일으킬 수 있습니다. 본인 책임하에 사용하세요.'
      },
      name: '사용자 정의 토큰'
    },
    defaultImageSize: {
      description: {
        part1: '기본 이미지 크기입니다.',
        part2: '픽셀로 지정할 수 있습니다',
        part3: '또는 전체 이미지 크기의 백분율로 지정할 수 있습니다',
        part4: '원본 이미지 크기를 사용하려면 비워두세요.'
      },
      name: '기본 이미지 크기'
    },
    duplicateNameSeparator: {
      description: {
        part1: '기존 파일과 같은 이름의 파일을 붙여넣기/드래그할 때 이 구분자가 파일 이름에 추가됩니다.',
        part2: '예를 들어, 파일을 드래그할 때',
        part3: ', 이름이',
        part4: '등으로 변경되어 사용 가능한 첫 번째 이름을 얻습니다.'
      },
      name: '중복 이름 구분자'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: '첨부 파일 폴더가 비게 될 때:'
      },
      name: '빈 첨부 파일 폴더 동작'
    },
    excludePaths: {
      description: {
        part1: '다음 경로에서 노트를 제외합니다.',
        part2: '각 경로를 새 줄에 입력하세요.',
        part3: '경로 문자열 또는',
        part4: '을(를) 사용할 수 있습니다. 설정이 비어 있으면 노트가 제외되지 않습니다.'
      },
      name: '제외 경로'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: '다음 경로에서 첨부 파일을 제외합니다',
        part2: '첨부 파일 수집',
        part3: '명령이 실행될 때.',
        part4: '각 경로를 새 줄에 입력하세요.',
        part5: '경로 문자열 또는',
        part6: '을(를) 사용할 수 있습니다. 설정이 비어 있으면 첨부 파일 수집에서 경로가 제외되지 않습니다.'
      },
      name: '첨부 파일 수집에서 제외할 경로'
    },
    generatedAttachmentFileName: {
      description: {
        part1: '사용 가능한',
        part2: '토큰을 참조하세요'
      },
      name: '생성된 첨부 파일 이름'
    },
    includePaths: {
      description: {
        part1: '다음 경로에서 노트를 포함합니다.',
        part2: '각 경로를 새 줄에 입력하세요.',
        part3: '경로 문자열 또는',
        part4: '을(를) 사용할 수 있습니다. 설정이 비어 있으면 모든 노트가 포함됩니다.'
      },
      name: '포함 경로'
    },
    jpegQuality: {
      description: '품질이 낮을수록 압축률이 높아집니다.',
      name: 'JPEG 품질'
    },
    locationForNewAttachments: {
      description: {
        part1: '상대 경로를 사용하려면',
        part2: '로 시작하세요.',
        part3: '사용 가능한',
        part4: '토큰을 참조하세요',
        part5: '점 폴더(예:',
        part6: ')는 권장되지 않습니다. Obsidian이 추적하지 않기 때문입니다. 관리하려면',
        part7: '플러그인이 필요할 수 있습니다.'
      },
      name: '새 첨부 파일 위치'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Markdown에 삽입될 URL의 형식입니다.',
        part2: '사용 가능한',
        part3: '토큰을 참조하세요',
        part4: '기본 형식을 사용하려면 비워두세요.'
      },
      name: 'Markdown URL 형식'
    },
    renameAttachmentsToLowerCase: '첨부 파일을 소문자로 이름 변경',
    renamedAttachmentFileName: {
      description: {
        part1: '사용 가능한',
        part2: '토큰을 참조하세요'
      },
      name: '이름이 변경된 첨부 파일 이름'
    },
    resetToSampleCustomTokens: {
      message: '사용자 정의 토큰을 샘플 사용자 정의 토큰으로 재설정하시겠습니까? 변경사항이 손실됩니다.',
      title: '샘플 사용자 정의 토큰으로 재설정'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        '붙여넣은 이미지를 JPEG로 변환할지 여부입니다. PNG 이미지 내용이 클립보드에서 직접 붙여넣어질 때만 적용됩니다. 일반적으로 스크린샷 붙여넣기에 사용됩니다.',
      name: '붙여넣은 이미지를 JPEG로 변환'
    },
    shouldDeleteOrphanAttachments: {
      description: '활성화하면 노트가 삭제될 때 고아 첨부 파일도 함께 삭제됩니다.',
      name: '고아 첨부 파일 삭제'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: '활성화하면 노트의 이름이 변경되거나 이동될 때 첨부 파일이',
        part2: '설정에 따라 이름이 변경됩니다.'
      },
      name: '첨부 파일 이름 변경'
    },
    shouldRenameAttachmentFolders: {
      description: '노트의 이름이 변경되거나 이동될 때 첨부 파일 폴더의 이름을 변경할지 여부입니다.',
      name: '첨부 파일 폴더 이름 변경'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: '활성화하면',
        part2: '첨부 파일 수집',
        part3: '명령을 통해 처리된 첨부 파일이',
        part4: '설정에 따라 이름이 변경됩니다.'
      },
      name: '수집된 첨부 파일 이름 변경'
    },
    specialCharacters: {
      description: {
        part1: '첨부 파일 폴더 및 파일 이름에서 교체하거나 제거할 특수 문자입니다.',
        part2: '특수 문자를 보존하려면 비워두세요.'
      },
      name: '특수 문자'
    },
    specialCharactersReplacement: {
      description: {
        part1: '첨부 파일 폴더 및 파일 이름의 특수 문자에 대한 교체 문자열입니다.',
        part2: '특수 문자를 제거하려면 비워두세요.'
      },
      name: '특수 문자 교체'
    },
    timeoutInSeconds: {
      description: {
        part1: '모든 작업에 대한 타임아웃(초)입니다.',
        part2: '만약',
        part3: '이(가) 설정되면 작업 실행 타임아웃이 비활성화됩니다.'
      },
      name: '시간 초과(초)'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: '이러한 확장자를 가진 파일을 첨부 파일로 처리합니다.',
        part2: '기본적으로',
        part3: '및',
        part4: '링크된 파일은 첨부 파일로 처리되지 않으며 노트와 함께 이동되지 않습니다.',
        part5: '이 동작을 재정의하려면 사용자 정의 확장자(예:',
        part6: ')를 추가할 수 있습니다.'
      },
      name: '첨부 파일 확장자로 처리'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: '첨부 파일 미리보기 \'{{fullFileName}}\''
    },
    title: '프롬프트 토큰에 대한 값을 제공하세요'
  },
  regularExpression: '/정규식/'
};
