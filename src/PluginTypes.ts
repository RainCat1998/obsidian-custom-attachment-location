import type { PluginTypesBase } from 'obsidian-dev-utils/obsidian/Plugin/PluginTypesBase';

import type { defaultTranslations } from './i18n/locales/default.ts';
import type { Plugin } from './Plugin.ts';
import type { PluginSettings } from './PluginSettings.ts';
import type { PluginSettingsManager } from './PluginSettingsManager.ts';
import type { PluginSettingsTab } from './PluginSettingsTab.ts';

export interface PluginTypes extends PluginTypesBase {
  defaultTranslations: typeof defaultTranslations;
  plugin: Plugin;
  pluginSettings: PluginSettings;
  pluginSettingsManager: PluginSettingsManager;
  pluginSettingsTab: PluginSettingsTab;
}
