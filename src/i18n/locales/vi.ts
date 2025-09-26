import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const vi: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'Bạn có muốn thu thập các tệp đính kèm cho tất cả ghi chú trong thư mục:',
      part2: 'và tất cả các thư mục con của nó?',
      part3: 'Thao tác này không thể hoàn tác.'
    },
    progressBar: {
      message: 'Đang thu thập tệp đính kèm {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'Đang thu thập tệp đính kèm...'
    }
  },
  buttons: {
    copy: 'Sao chép',
    move: 'Di chuyển',
    previewAttachmentFile: 'Xem trước tệp đính kèm',
    skip: 'Bỏ qua'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'Tệp đính kèm',
      part2: 'được tham chiếu bởi nhiều ghi chú.'
    },
    heading: 'Thu thập tệp đính kèm được sử dụng bởi nhiều ghi chú',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'Nên sử dụng cùng một hành động cho các tệp đính kèm có vấn đề khác'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'Thu thập tệp đính kèm trong thư mục hiện tại',
    collectAttachmentsCurrentNote: 'Thu thập tệp đính kèm trong ghi chú hiện tại',
    collectAttachmentsEntireVault: 'Thu thập tệp đính kèm trong toàn bộ kho'
  },
  menuItems: {
    collectAttachmentsInFolder: 'Thu thập tệp đính kèm trong thư mục'
  },
  notice: {
    collectingAttachments: 'Đang thu thập tệp đính kèm cho \'{{noteFilePath}}\'',
    collectingAttachmentsCancelled: 'Thu thập tệp đính kèm đã bị hủy. Xem console để biết chi tiết.',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'Tên tệp đính kèm được tạo \'{{path}}\' không hợp lệ.\n{{validationMessage}}\nKiểm tra',
      part2: 'cài đặt của bạn.'
    },
    notePathIsIgnored: 'Đường dẫn ghi chú bị bỏ qua'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'Hủy',
      ok: 'Đồng ý'
    },
    dataview: {
      itemsPerPage: 'Mục trên mỗi trang:',
      jumpToPage: 'Chuyển đến trang:'
    },
    notices: {
      attachmentIsStillUsed: 'Tệp đính kèm {{attachmentPath}} vẫn đang được sử dụng bởi các ghi chú khác. Nó sẽ không bị xóa.',
      unhandledError: 'Đã xảy ra lỗi không xử lý được. Vui lòng kiểm tra console để biết thêm thông tin.'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'Tất cả các tệp được đổi tên.',
        displayText: 'Tất cả'
      },
      none: {
        description: 'Tên của chúng được bảo tồn.',
        displayText: 'Không'
      },
      onlyPastedImages: {
        description:
          'Chỉ các hình ảnh được dán mới được đổi tên. Chỉ áp dụng khi nội dung hình ảnh PNG được dán trực tiếp từ clipboard. Thông thường dùng để dán ảnh chụp màn hình.',
        displayText: 'Chỉ hình ảnh được dán'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'Hủy việc thu thập tệp đính kèm.',
        displayText: 'Hủy'
      },
      copy: {
        description: 'Sao chép tệp đính kèm đến vị trí mới.',
        displayText: 'Sao chép'
      },
      move: {
        description: 'Di chuyển tệp đính kèm đến vị trí mới.',
        displayText: 'Di chuyển'
      },
      prompt: {
        description: 'Nhắc người dùng chọn hành động.',
        displayText: 'Nhắc'
      },
      skip: {
        description: 'Bỏ qua tệp đính kèm và tiếp tục đến cái tiếp theo.',
        displayText: 'Bỏ qua'
      }
    },
    defaultImageSizeDimension: {
      height: 'Сhiều cao',
      width: 'Сhiều rộng'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'Sẽ xóa thư mục tệp đính kèm trống.',
        displayText: 'Xóa'
      },
      deleteWithEmptyParents: {
        description: 'Sẽ xóa thư mục tệp đính kèm trống và các thư mục cha trống của nó.',
        displayText: 'Xóa với thư mục cha rỗng'
      },
      keep: {
        description: 'Sẽ giữ nguyên thư mục tệp đính kèm trống.',
        displayText: 'Giữ lại'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// Các token tùy chỉnh bị chú thích vì cần cập nhật theo định dạng mới được giới thiệu trong phiên bản plugin 9.0.0.\n// Vui lòng tham khảo tài liệu để biết thêm thông tin.',
      deprecated: {
        part1: 'Trong phiên bản plugin 9.0.0, định dạng đăng ký token tùy chỉnh đã thay đổi. Vui lòng cập nhật các token của bạn tương ứng. Tham khảo',
        part2: 'tài liệu',
        part3: 'để biết thêm thông tin'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'Trong phiên bản plugin 9.0.0, ',
      part2: 'thiết lập này đã bị ngừng hỗ trợ. Hãy dùng ',
      part3: 'định dạng thay thế. Xem ',
      part4: 'tài liệu ',
      part5: 'để biết thêm thông tin'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'Bạn đã đặt một giá trị có thể không chính xác cho',
        part2: 'định dạng. Vui lòng tham khảo',
        part3: 'tài liệu',
        part4: 'cho thông tin thêm',
        part5: 'Tin nhắn này sẽ không còn được hiển thị.'
      }
    },
    specialCharacters: {
      part1: 'Trong phiên bản plugin 9.16.0,',
      part2: 'giá trị cài đặt mặc định đã được thay đổi. Giá trị của bạn đã được cập nhật theo giá trị mặc định mới.'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'Kích thước hình ảnh mặc định phải được tính bằng pixel hoặc phần trăm',
      invalidCustomTokensCode: 'Mã token tùy chỉnh không hợp lệ',
      invalidRegularExpression: 'Biểu thức chính quy không hợp lệ {{regExp}}',
      specialCharactersMustNotContainSlash: 'Ký tự đặc biệt không được chứa dấu /',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters:
        'Chuỗi thay thế ký tự đặc biệt không được chứa ký tự tên tệp hoặc đường dẫn không hợp lệ.'
    },
    version: {
      part1: 'Tệp cài đặt của bạn ',
      part2: 'có phiên bản',
      part3: 'mới hơn phiên bản plugin hiện tại',
      part4: 'Plugin có thể không hoạt động như mong đợi. Vui lòng cập nhật plugin lên phiên bản mới nhất hoặc đảm bảo các cài đặt là đúng.'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'Khi đính kèm tệp:'
      },
      name: 'Chế độ đổi tên tệp đính kèm'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'Khi tệp đính kèm được thu thập được sử dụng bởi nhiều ghi chú:'
      },
      name: 'Chế độ thu thập tệp đính kèm được sử dụng bởi nhiều ghi chú'
    },
    customTokens: {
      description: {
        part1: 'Các token tùy chỉnh để sử dụng.',
        part2: 'Xem',
        part3: 'tài liệu',
        part4: 'để biết thêm thông tin.',
        part5: '⚠️ Token tùy chỉnh có thể chứa mã JavaScript tùy ý. Nếu viết sai, có thể gây mất dữ liệu. Sử dụng cẩn thận.'
      },
      name: 'Token tùy chỉnh'
    },
    defaultImageSize: {
      description: {
        part1: 'Kích thước hình ảnh mặc định.',
        part2: 'Có thể được chỉ định bằng pixel',
        part3: 'hoặc phần trăm kích thước đầy đủ của hình ảnh',
        part4: 'Bỏ trống để sử dụng kích thước gốc của hình ảnh.'
      },
      name: 'Kích thước hình ảnh mặc định'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'Khi bạn dán/kéo một tệp có cùng tên với tệp đã tồn tại, bộ phân cách này sẽ được thêm vào tên tệp.',
        part2: 'Ví dụ, khi bạn kéo tệp',
        part3: ', nó sẽ được đổi tên thành ',
        part4: ', v.v., sử dụng tên đầu tiên có sẵn.'
      },
      name: 'Bộ phân cách tên trùng'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'Khi thư mục tệp đính kèm trở nên trống:'
      },
      name: 'Hành vi thư mục tệp đính kèm trống'
    },
    excludePaths: {
      description: {
        part1: 'Loại trừ ghi chú khỏi các đường dẫn sau.',
        part2: 'Nhập mỗi đường dẫn trên một dòng mới.',
        part3: 'Bạn có thể sử dụng chuỗi đường dẫn hoặc',
        part4: 'Nếu cài đặt để trống, không ghi chú nào bị loại trừ.'
      },
      name: 'Loại trừ đường dẫn'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'Loại trừ tệp đính kèm khỏi các đường dẫn sau khi',
        part2: 'lệnh Thu thập tệp đính kèm',
        part3: 'được thực thi.',
        part4: 'Nhập mỗi đường dẫn trên một dòng mới.',
        part5: 'Bạn có thể sử dụng chuỗi đường dẫn hoặc',
        part6: 'Nếu cài đặt để trống, không đường dẫn nào bị loại trừ.'
      },
      name: 'Loại trừ đường dẫn khi thu thập tệp đính kèm'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'Xem các',
        part2: 'token có thể sử dụng'
      },
      name: 'Tên tệp đính kèm được tạo'
    },
    includePaths: {
      description: {
        part1: 'Bao gồm các ghi chú từ các đường dẫn sau.',
        part2: 'Nhập mỗi đường dẫn trên một dòng mới.',
        part3: 'Bạn có thể sử dụng chuỗi đường dẫn hoặc',
        part4: 'Nếu cài đặt để trống, tất cả ghi chú được bao gồm.'
      },
      name: 'Bao gồm đường dẫn'
    },
    jpegQuality: {
      description: 'Chất lượng càng thấp, tỷ lệ nén càng cao.',
      name: 'Chất lượng JPEG'
    },
    locationForNewAttachments: {
      description: {
        part1: 'Bắt đầu với',
        part2: 'để sử dụng đường dẫn tương đối.',
        part3: 'Xem các',
        part4: 'token có sẵn',
        part5: 'Các thư mục có dấu chấm như',
        part6: 'không được khuyến nghị vì Obsidian không theo dõi chúng. Bạn có thể cần sử dụng',
        part7: 'plugin để quản lý chúng.'
      },
      name: 'Vị trí tệp đính kèm mới'
    },
    markdownUrlFormat: {
      description: {
        part1: 'Định dạng URL được chèn vào Markdown.',
        part2: 'Xem các',
        part3: 'token có sẵn',
        part4: 'Để trống để sử dụng định dạng mặc định.'
      },
      name: 'Định dạng URL Markdown'
    },
    renameAttachmentsToLowerCase: 'Đổi tên tệp đính kèm thành chữ thường',
    resetToSampleCustomTokens: {
      message: 'Bạn có chắc muốn đặt lại token tùy chỉnh về token mẫu? Mọi thay đổi sẽ bị mất.',
      title: 'Đặt lại token mẫu'
    },
    shouldConvertPastedImagesToJpeg: {
      description:
        'Có nên chuyển đổi hình ảnh dán sang định dạng JPEG không. Chỉ áp dụng khi nội dung ảnh PNG được dán trực tiếp từ clipboard. Thường dùng cho ảnh chụp màn hình.',
      name: 'Chuyển hình ảnh dán sang JPEG'
    },
    shouldDeleteOrphanAttachments: {
      description: 'Nếu bật, khi xóa ghi chú, các tệp đính kèm mồ côi cũng sẽ bị xóa.',
      name: 'Xóa tệp đính kèm mồ côi'
    },
    shouldRenameAttachmentFiles: {
      description: 'Có đổi tên các tệp đính kèm khi ghi chú được đổi tên hoặc di chuyển không.',
      name: 'Đổi tên tệp đính kèm'
    },
    shouldRenameAttachmentFolders: {
      description: 'Có đổi tên các thư mục đính kèm khi ghi chú được đổi tên hoặc di chuyển không.',
      name: 'Đổi tên thư mục đính kèm'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'Nếu bật, các tệp đính kèm được xử lý qua lệnh',
        part2: 'Thu thập tệp đính kèm',
        part3: 'sẽ được đổi tên theo',
        part4: 'cài đặt.'
      },
      name: 'Đổi tên tệp đính kèm đã thu thập'
    },
    specialCharacters: {
      description: {
        part1: 'Các ký tự đặc biệt trong tên thư mục và tệp đính kèm sẽ được thay thế hoặc loại bỏ.',
        part2: 'Để trống để giữ nguyên các ký tự đặc biệt.'
      },
      name: 'Ký tự đặc biệt'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'Chuỗi thay thế cho các ký tự đặc biệt trong tên thư mục và tệp đính kèm.',
        part2: 'Để trống để loại bỏ các ký tự đặc biệt.'
      },
      name: 'Thay thế ký tự đặc biệt'
    },
    timeoutInSeconds: {
      description: {
        part1: 'Thời gian chờ tính bằng giây cho tất cả các thao tác.',
        part2: 'Nếu',
        part3: 'được đặt, thời gian chờ thao tác sẽ bị vô hiệu hóa.'
      },
      name: 'Thời gian chờ (giây)'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'Xem các tệp có phần mở rộng này là tệp đính kèm.',
        part2: 'Theo mặc định',
        part3: 'và',
        part4: 'các tệp liên kết không được xem là tệp đính kèm và không được di chuyển cùng ghi chú.',
        part5: 'Bạn có thể thêm các phần mở rộng tùy chỉnh, ví dụ,',
        part6: ', để ghi đè hành vi này.'
      },
      name: 'Xử lý như phần mở rộng tệp đính kèm'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'Xem trước tệp đính kèm \'{{fullFileName}}\''
    },
    title: 'Cung cấp giá trị cho token nhắc nhở'
  },
  regularExpression: '/biểu thức chính quy/'
};
