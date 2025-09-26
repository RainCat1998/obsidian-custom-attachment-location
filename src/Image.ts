import { blobToDataUrl } from 'obsidian-dev-utils/Blob';
import { trimEnd } from 'obsidian-dev-utils/String';

import type { Plugin } from './Plugin.ts';

import { DefaultImageSizeDimension } from './PluginSettings.ts';

const IMAGE_MIME_TYPE_IMAGE_MAP: Record<string, string> = {
  avif: 'image/avif',
  bmp: 'image/bmp',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  webp: 'image/webp'
};

export async function getImageSize(plugin: Plugin, extension: string, content: ArrayBuffer): Promise<null | string> {
  const mimeType = IMAGE_MIME_TYPE_IMAGE_MAP[extension.toLowerCase()];
  if (!mimeType) {
    return null;
  }

  if (!plugin.settings.defaultImageSize) {
    return null;
  }

  const blob = new Blob([content], { type: mimeType });
  const dataUrl = await blobToDataUrl(blob);
  const image = new Image();
  await new Promise((resolve) => {
    image.addEventListener('load', () => {
      resolve();
    });
    image.src = dataUrl;
  });

  let width: number;
  let height: number;

  const PX = 'px';
  const PERCENTAGE = '%';

  if (plugin.settings.defaultImageSize.endsWith(PX)) {
    const dimensionInPixels = Number(trimEnd(plugin.settings.defaultImageSize, PX));
    if (plugin.settings.defaultImageSizeDimension === DefaultImageSizeDimension.Width) {
      width = dimensionInPixels;
      height = Math.trunc(width / image.width * image.height);
    } else {
      height = dimensionInPixels;
      width = Math.trunc(height / image.height * image.width);
    }
  } else {
    const percentage = Number(trimEnd(plugin.settings.defaultImageSize, PERCENTAGE));
    const FULL_IMAGE_PERCENTAGE = 100;
    width = Math.trunc(image.width / FULL_IMAGE_PERCENTAGE * percentage);
    height = Math.trunc(image.height / FULL_IMAGE_PERCENTAGE * percentage);
  }

  return `${String(width)}x${String(height)}`;
}
