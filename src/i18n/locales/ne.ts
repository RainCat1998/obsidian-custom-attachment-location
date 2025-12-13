import type { Translations } from 'obsidian-dev-utils/obsidian/i18n/i18n';

import type { PluginTypes } from '../../PluginTypes.ts';

export const ne: Translations<PluginTypes> = {
  attachmentCollector: {
    confirm: {
      part1: 'के तपाईं फोल्डरहरूभित्रका सबै नोटहरूका लागि संलग्नकहरूलाई पुनरावर्ती रूपमा सङ्कलन गर्न चाहनुहुन्छ?',
      part2: 'यो कार्य उल्ट्याउन सकिँदैन।'
    },
    progressBar: {
      message: 'संलग्नकहरू संकलन गर्दै {{iterationStr}} - \'{{noteFilePath}}\'.',
      title: 'संलग्नकहरू संकलन गर्दै...'
    }
  },
  buttons: {
    copy: 'प्रतिलिपि गर्नुहोस्',
    move: 'सार्नुहोस्',
    previewAttachmentFile: 'संलग्नक फाइल पूर्वावलोकन',
    skip: 'फाल्नुहोस्'
  },
  collectAttachmentUsedByMultipleNotesModal: {
    content: {
      part1: 'संलग्नक',
      part2: 'धेरै नोटहरूद्वारा सन्दर्भित छ।'
    },
    heading: 'धेरै नोटहरूद्वारा प्रयोग हुने संलग्नक संकलन गर्दै',
    shouldUseSameActionForOtherProblematicAttachmentsToggle: 'अन्य समस्यायुक्त संलग्नकहरूका लागि एउटानै कार्य प्रयोग गर्नुपर्यो'
  },
  commands: {
    collectAttachmentsCurrentFolder: 'हालको फोल्डरमा संलग्नकहरू संकलन गर्नुहोस्',
    collectAttachmentsCurrentNote: 'हालको नोटमा संलग्नकहरू संकलन गर्नुहोस्',
    collectAttachmentsEntireVault: 'सम्पूर्ण भाल्टमा संलग्नकहरू संकलन गर्नुहोस्'
  },
  menuItems: {
    collectAttachmentsInFile: 'फाइलमा संलग्नकहरू सङ्कलन गर्नुहोस्',
    collectAttachmentsInFiles: 'फाइलहरूमा संलग्नकहरू सङ्कलन गर्नुहोस्'
  },
  notice: {
    collectingAttachments: '\'{{noteFilePath}}\' का लागि संलग्नकहरू संकलन गर्दै',
    collectingAttachmentsCancelled: 'संलग्नक संकलन रद्द गरियो। विस्तृत जानकारीका लागि कन्सोल हेर्नुहोस्।',
    generatedAttachmentFileNameIsInvalid: {
      part1: 'उत्पन्न संलग्नक फाइल नाम \'{{path}}\' अमान्य छ।\n{{validationMessage}}\nआफ्नो',
      part2: 'सेटिङ जाँच्नुहोस्।'
    },
    notePathIsIgnored: 'नोट पाथ बेवास्ता गरिएको छ'
  },
  obsidianDevUtils: {
    buttons: {
      cancel: 'रद्द गर्नुहोस्',
      ok: 'ठिक छ'
    },
    dataview: {
      itemsPerPage: 'प्रति पृष्ठ वस्तुहरू:',
      jumpToPage: 'पृष्ठमा जानुहोस्:'
    },
    notices: {
      attachmentIsStillUsed: 'संलग्नक {{attachmentPath}} अझै पनि अन्य नोटहरूद्वारा प्रयोग हुँदैछ। यो मेटिनेछैन।',
      unhandledError: 'एउटा नसुल्झिएको त्रुटि भयो। कृपया थप जानकारीका लागि कन्सोल जाँच्नुहोस्।'
    }
  },
  pluginSettings: {
    attachmentRenameMode: {
      all: {
        description: 'सबै फाइलहरू पुनः नामकरण गरिन्छन्।',
        displayText: 'सबै'
      },
      none: {
        description: 'तिनीहरूका नामहरू संरक्षित हुन्छन्।',
        displayText: 'कुनै पनि होइन'
      },
      onlyPastedImages: {
        description: 'केवल टाँसिएका छविहरू पुनः नामकरण गरिन्छन्। यो केवल तब लागू हुन्छ जब PNG छवि सामग्री क्लिपबोर्डबाट सीधै टाँसिएको हुन्छ। सामान्यतया, स्क्रिनशट टाँस्नका लागि।',
        displayText: 'केवल टाँसिएका छविहरू'
      }
    },
    collectAttachmentUsedByMultipleNotesMode: {
      cancel: {
        description: 'संलग्नक संकलन रद्द गर्नुहोस्।',
        displayText: 'रद्द गर्नुहोस्'
      },
      copy: {
        description: 'संलग्नकलाई नयाँ स्थानमा प्रतिलिपि गर्नुहोस्।',
        displayText: 'प्रतिलिपि गर्नुहोस्'
      },
      move: {
        description: 'संलग्नकलाई नयाँ स्थानमा सार्नुहोस्।',
        displayText: 'सार्नुहोस्'
      },
      prompt: {
        description: 'प्रयोगकर्तालाई कार्य छनोट गर्न प्रेरित गर्नुहोस्।',
        displayText: 'प्रेरित गर्नुहोस्'
      },
      skip: {
        description: 'संलग्नकलाई छोड्नुहोस् र अर्कोमा जानुहोस्।',
        displayText: 'छोड्नुहोस्'
      }
    },
    defaultImageSizeDimension: {
      height: 'उचाइ',
      width: 'चौडाइ'
    },
    emptyAttachmentFolderBehavior: {
      delete: {
        description: 'खाली संलग्नक फोल्डर मेटाउनेछ।',
        displayText: 'मेटाउनुहोस्'
      },
      deleteWithEmptyParents: {
        description: 'खाली संलग्नक फोल्डर र यसका खाली माता-पिता फोल्डरहरू मेटाउनेछ।',
        displayText: 'खाली माता-पिताहरूसहित मेटाउनुहोस्'
      },
      keep: {
        description: 'खाली संलग्नक फोल्डर राख्नेछ।',
        displayText: 'राख्नुहोस्'
      }
    }
  },
  pluginSettingsManager: {
    customToken: {
      codeComment:
        '// कस्टम टोकनहरू टिप्पणी गरिएका छन् किनभने तिनीहरूलाई प्लगइन संस्करण 9.0.0 मा परिचय गरिएको नयाँ ढाँचामा अपडेट गर्नुपर्छ।\n// थप जानकारीका लागि कागजात (https://github.com/RainCat1998/obsidian-custom-attachment-location?tab=readme-ov-file#custom-tokens) हेर्नुहोस्।',
      deprecated: {
        part1: 'प्लगइन संस्करण 9.0.0 मा, कस्टम टोकन दर्ताको ढाँचा परिवर्तन भयो। कृपया तपाईँका टोकनहरूलाई तदनुसार अपडेट गर्नुहोस्।',
        part2: 'कागजात',
        part3: 'मा थप जानकारीका लागि सन्दर्भ लिनुहोस्'
      }
    },
    legacyRenameAttachmentsToLowerCase: {
      part1: 'प्लगइन संस्करण 9.0.0 मा,',
      part2: 'सेटिङ पुरानो छ।',
      part3: 'ढाँचा प्रयोग गर्नुहोस्।',
      part4: 'कागजात',
      part5: 'मा थप जानकारीका लागि हेर्नुहोस्'
    },
    markdownUrlFormat: {
      deprecated: {
        part1: 'तपाईँसँग',
        part2: 'ढाँचाका लागि सम्भावित गलत मान सेट गरिएको छ। कृपया',
        part3: 'कागजात',
        part4: 'मा थप जानकारीका लागि सन्दर्भ लिनुहोस्।',
        part5: 'यो सन्देश फेरि देखाइनेछैन।'
      }
    },
    specialCharacters: {
      part1: 'प्लगइन संस्करण 9.16.0 मा,',
      part2: 'पूर्वनिर्धारित सेटिङ मान परिवर्तन भयो। तपाईँको सेटिङ मान नयाँ पूर्वनिर्धारित मानमा अपडेट गरियो।'
    },
    validation: {
      defaultImageSizeMustBePercentageOrPixels: 'पूर्वनिर्धारित तस्वीरको आकार पिक्सेल या प्रतिशतमा हुनुपर्छ',
      invalidCustomTokensCode: 'अमान्य कस्टम टोकन कोड',
      invalidRegularExpression: 'अमान्य नियमित अभिव्यक्ति {{regExp}}',
      specialCharactersMustNotContainSlash: 'विशेष अक्षरहरूमा / हुनुहुन्न',
      specialCharactersReplacementMustNotContainInvalidFileNamePathCharacters: 'विशेष अक्षर प्रतिस्थापनमा अमान्य फाइल नाम पाथ अक्षरहरू हुनुहुन्न।'
    },
    version: {
      part1: 'तपाईँको सेटिङ फाइल ',
      part2: 'मा संस्करण',
      part3: 'छ जुन हालको प्लगइन संस्करण भन्दा नयाँ छ',
      part4: 'प्लगइनले अपेक्षित रूपमा काम नगर्न सक्छ। कृपया प्लगइनलाई नवीनतम संस्करणमा अपडेट गर्नुहोस् वा सेटिङहरू सही छन् भन्ने निश्चित गर्नुहोस्।'
    }
  },
  pluginSettingsTab: {
    attachmentRenameMode: {
      description: {
        part1: 'जब फाइलहरू संलग्न गर्दै:'
      },
      name: 'संलग्नक पुनः नामकरण मोड'
    },
    collectAttachmentUsedByMultipleNotesMode: {
      description: {
        part1: 'जब संकलित संलग्नक धेरै नोटहरूद्वारा प्रयोग हुन्छ:'
      },
      name: 'धेरै नोटहरूद्वारा प्रयोग हुने संलग्नक संकलन मोड'
    },
    collectedAttachmentFileName: {
      description: {
        part1: 'उपलब्ध',
        part2: 'टोकनहरू हेर्नुहोस्'
      },
      name: 'संकलित संलग्नक फाइल नाम'
    },
    customTokens: {
      description: {
        part1: 'प्रयोग गर्नका लागि कस्टम टोकनहरू।',
        part2: 'थप जानकारीका लागि',
        part3: 'कागजात',
        part4: 'हेर्नुहोस्।',
        part5: '⚠️ कस्टम टोकनहरू मनमाना JavaScript कोड हुन सक्छन्। यदि खराब लेखिएको छ भने, यसले डाटा हानि गर्न सक्छ। आफ्नै जोखिममा प्रयोग गर्नुहोस्।'
      },
      name: 'कस्टम टोकनहरू'
    },
    defaultImageSize: {
      description: {
        part1: 'पूर्वनिर्धारित तस्वीरको आकार।',
        part2: 'पिक्सेलमा निर्दिष्ट गर्न सकिन्छ',
        part3: 'वा पूर्ण तस्वीरको आकारको प्रतिशतमा',
        part4: 'मूल आकार प्रयोग गर्न खाली राख्नुहोस्।'
      },
      name: 'पूर्वनिर्धारित तस्वीरको आकार'
    },
    duplicateNameSeparator: {
      description: {
        part1: 'जब तपाईँ एउटा फाइललाई अवस्थित फाइलसँग उही नामका साथ टाँस्दै/तान्दै हुनुहुन्छ, यो विभाजक फाइल नाममा थपिनेछ।',
        part2: 'उदाहरणका लागि, जब तपाईँ फाइल',
        part3: 'तान्दै हुनुहुन्छ, यो',
        part4: 'मा पुनः नामकरण गरिनेछ, आदि, पहिलो उपलब्ध नाम पाउँदै।'
      },
      name: 'डुप्लिकेट नाम विभाजक'
    },
    emptyAttachmentFolderBehavior: {
      description: {
        part1: 'जब संलग्नक फोल्डर खाली हुन्छ:'
      },
      name: 'खाली संलग्नक फोल्डर व्यवहार'
    },
    excludePaths: {
      description: {
        part1: 'निम्न पाथहरूबाट नोटहरू बाहिर निकाल्नुहोस्।',
        part2: 'प्रत्येक पाथलाई नयाँ लाइनमा राख्नुहोस्।',
        part3: 'तपाईँ पाथ स्ट्रिङ वा',
        part4: 'प्रयोग गर्न सक्नुहुन्छ। यदि सेटिङ खाली छ भने, कुनै पनि नोटहरू बाहिर निकालिनेछैन।'
      },
      name: 'पाथहरू बाहिर निकाल्नुहोस्'
    },
    excludePathsFromAttachmentCollecting: {
      description: {
        part1: 'जब',
        part2: 'संलग्नकहरू संकलन गर्नुहोस्',
        part3: 'आदेश कार्यान्वयन गरिन्छ, निम्न पाथहरूबाट संलग्नकहरू बाहिर निकाल्नुहोस्।',
        part4: 'प्रत्येक पाथलाई नयाँ लाइनमा राख्नुहोस्।',
        part5: 'तपाईँ पाथ स्ट्रिङ वा',
        part6: 'प्रयोग गर्न सक्नुहुन्छ। यदि सेटिङ खाली छ भने, संलग्नक संकलनबाट कुनै पनि पाथहरू बाहिर निकालिनेछैन।'
      },
      name: 'संलग्नक संकलनबाट पाथहरू बाहिर निकाल्नुहोस्'
    },
    generatedAttachmentFileName: {
      description: {
        part1: 'उपलब्ध',
        part2: 'टोकनहरू हेर्नुहोस्'
      },
      name: 'उत्पन्न संलग्नक फाइल नाम'
    },
    includePaths: {
      description: {
        part1: 'निम्न पाथहरूबाट नोटहरू समावेश गर्नुहोस्।',
        part2: 'प्रत्येक पाथलाई नयाँ लाइनमा राख्नुहोस्।',
        part3: 'तपाईँ पाथ स्ट्रिङ वा',
        part4: 'प्रयोग गर्न सक्नुहुन्छ। यदि सेटिङ खाली छ भने, सबै नोटहरू समावेश गरिन्छन्।'
      },
      name: 'पाथहरू समावेश गर्नुहोस्'
    },
    jpegQuality: {
      description: 'गुणस्तर जति सानो, कम्प्रेसन अनुपात त्यति ठूलो।',
      name: 'JPEG गुणस्तर'
    },
    locationForNewAttachments: {
      description: {
        part1: 'सापेक्ष पाथ प्रयोग गर्नका लागि',
        part2: 'सँग सुरु गर्नुहोस्।',
        part3: 'उपलब्ध',
        part4: 'टोकनहरू हेर्नुहोस्।',
        part5: 'डट-फोल्डरहरू जस्तै',
        part6: 'सिफारिस गरिएको छैन, किनभने Obsidian ले तिनीहरूलाई ट्र्याक गर्दैन। तिनीहरूलाई व्यवस्थापन गर्नका लागि तपाईँलाई',
        part7: 'प्लगइन प्रयोग गर्न आवश्यक हुन सक्छ।'
      },
      name: 'नयाँ संलग्नकहरूका लागि स्थान'
    },
    markdownUrlFormat: {
      description: {
        part1: 'मार्कडाउन मा समावेश गरिने यूआरएल का लागि ढाँचा।',
        part2: 'उपलब्ध',
        part3: 'टोकनहरू हेर्नुहोस्।',
        part4: 'पूर्वनिर्धारित ढाँचा प्रयोग गर्नका लागि खाली छोड्नुहोस्।'
      },
      name: 'मार्कडाउन यूआरएल ढाँचा'
    },
    renameAttachmentsToLowerCase: 'संलग्नकहरूलाई सानो अक्षरमा पुनः नामकरण गर्नुहोस्',
    renamedAttachmentFileName: {
      description: {
        part1: 'उपलब्ध',
        part2: 'टोकनहरू हेर्नुहोस्'
      },
      name: 'पुनः नामकरण गरिएको संलग्नक फाइल नाम'
    },
    resetToSampleCustomTokens: {
      message: 'के तपाईँ कस्टम टोकनहरूलाई नमुना कस्टम टोकनहरूमा रिसेट गर्न चाहनुहुन्छ? तपाईँका परिवर्तनहरू हराउनेछन्।',
      title: 'नमुना कस्टम टोकनहरूमा रिसेट गर्नुहोस्'
    },
    shouldConvertPastedImagesToJpeg: {
      description: 'के टाँसिएका छविहरूलाई JPEG मा रूपान्तरण गर्ने। यो केवल तब लागू हुन्छ जब PNG छवि सामग्री क्लिपबोर्डबाट सीधै टाँसिएको हुन्छ। सामान्यतया, स्क्रिनशट टाँस्नका लागि।',
      name: 'टाँसिएका छविहरूलाई JPEG मा रूपान्तरण गर्नुपर्छ'
    },
    shouldDeleteOrphanAttachments: {
      description: 'यदि सक्षम गरिएको छ भने, जब नोट मेटाइन्छ, यसका अनाथ संलग्नकहरू पनि मेटाइनेछन्।',
      name: 'अनाथ संलग्नकहरू मेटाउनुपर्छ'
    },
    shouldRenameAttachmentFiles: {
      description: {
        part1: 'यदि सक्षम गरिएको छ भने, जब नोट पुनः नामकरण वा सारिन्छ, यसका संलग्नकहरू',
        part2: 'सेटिङ अनुसार पुनः नामकरण गरिनेछन्।'
      },
      name: 'संलग्नक फाइलहरू पुनः नामकरण गर्नुपर्छ'
    },
    shouldRenameAttachmentFolders: {
      description: 'जब नोट पुनः नामकरण वा सारिन्छ, संलग्नक फोल्डरहरू पुनः नामकरण गर्ने वा नगर्ने।',
      name: 'संलग्नक फोल्डरहरू पुनः नामकरण गर्नुपर्छ'
    },
    shouldRenameCollectedAttachments: {
      description: {
        part1: 'यदि सक्षम गरिएको छ भने,',
        part2: 'संलग्नकहरू संकलन गर्नुहोस्',
        part3: 'आदेशहरू मार्फत प्रशोधित संलग्नकहरू',
        part4: 'सेटिङ अनुसार पुनः नामकरण गरिनेछन्।'
      },
      name: 'संकलित संलग्नकहरू पुनः नामकरण गर्नुपर्छ'
    },
    specialCharacters: {
      description: {
        part1: 'संलग्नक फोल्डर र फाइल नाममा प्रतिस्थापन वा हटाउनका लागि विशेष अक्षरहरू।',
        part2: 'विशेष अक्षरहरू संरक्षित गर्नका लागि खाली छोड्नुहोस्।'
      },
      name: 'विशेष अक्षरहरू'
    },
    specialCharactersReplacement: {
      description: {
        part1: 'संलग्नक फोल्डर र फाइल नाममा विशेष अक्षरहरूका लागि प्रतिस्थापन स्ट्रिङ।',
        part2: 'विशेष अक्षरहरू हटाउनका लागि खाली छोड्नुहोस्।'
      },
      name: 'विशेष अक्षरहरू प्रतिस्थापन'
    },
    timeoutInSeconds: {
      description: {
        part1: 'सबै कार्यहरूका लागि सेकेन्डमा टाइमआउट।',
        part2: 'यदि',
        part3: 'सेट गरिएको छ भने, कार्यहरू कार्यान्वयन टाइमआउट अक्षम गरिनेछ।'
      },
      name: 'सेकेन्डमा टाइमआउट'
    },
    treatAsAttachmentExtensions: {
      description: {
        part1: 'यी एक्सटेन्सनहरू भएका फाइलहरूलाई संलग्नकहरूको रूपमा व्यवहार गर्नुहोस्।',
        part2: 'पूर्वनिर्धारित रूपमा',
        part3: 'र',
        part4: 'लिंक गरिएका फाइलहरू संलग्नकहरूको रूपमा व्यवहार गरिनेछैनन् र नोटसँग सारिनेछैनन्।',
        part5: 'तपाईँ कस्टम एक्सटेन्सनहरू थप्न सक्नुहुन्छ, उदाहरणका लागि',
        part6: ', यो व्यवहार ओभरराइड गर्नका लागि।'
      },
      name: 'संलग्नक एक्सटेन्सनहरूको रूपमा व्यवहार गर्नुहोस्'
    }
  },
  promptWithPreviewModal: {
    previewModal: {
      title: 'संलग्नक फाइल \'{{fullFileName}}\' को पूर्वावलोकन'
    },
    title: 'प्रोम्प्ट टोकनका लागि मान प्रदान गर्नुहोस्'
  },
  regularExpression: '/नियमित अभिव्यक्ति/'
};
