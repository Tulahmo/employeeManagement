// /localization/localization.js

import { messages } from './messages.js';

export function getLocalizedMessage(key) {
  const lang = document.documentElement.lang || 'en'; // Default to 'en' if no lang is set
  return messages[lang][key] || key; // Fallback to key if translation is missing
}
