#!/usr/bin/env node

/**
 * sync-translations.cjs
 *
 * Reads public/locales/en/translation.json as the source of truth.
 * For every other language file:
 *   - Reports missing keys
 *   - Reports extra keys
 *   - Translates missing keys via Amazon Translate (if AWS credentials available)
 *   - Falls back to "[NEEDS TRANSLATION] English value" if translation fails
 *   - Removes extra keys not present in English
 *   - Preserves existing translated values
 *
 * Usage:
 *   node scripts/sync-translations.cjs          # sync and write files
 *   node scripts/sync-translations.cjs --check  # check only, exit 1 if out of sync
 *
 * Environment:
 *   AWS_REGION (default: eu-west-2)
 *   AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (for Amazon Translate)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const LOCALES_DIR = path.resolve(__dirname, '../src/i18n/locales');
const SOURCE_LANG = 'en';
const CHECK_ONLY = process.argv.includes('--check');
const PLACEHOLDER_PREFIX = '[NEEDS TRANSLATION] ';
const AWS_REGION = process.env.AWS_REGION || 'eu-west-2';

// i18next language code -> Amazon Translate language code
const LANG_MAP = {
  en: 'en', fr: 'fr', bg: 'bg', es: 'es', de: 'de',
  ar: 'ar', el: 'el', pt: 'pt', ro: 'ro', nl: 'nl',
  fi: 'fi', it: 'it', he: 'he', iw: 'he', sv: 'sv',
  cy: 'cy', is: 'is', gs: 'gd',
};

// --- Key helpers ---

const getKeys = (obj, prefix = '') => {
  const keys = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
};

const getNestedValue = (obj, keyPath) => {
  let current = obj;
  for (const part of keyPath.split('.')) {
    if (current == null) return undefined;
    current = current[part];
  }
  return current;
};

const setNestedValue = (obj, keyPath, value) => {
  const parts = keyPath.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in current) || typeof current[parts[i]] !== 'object') {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
};

const deleteNestedValue = (obj, keyPath) => {
  const parts = keyPath.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in current)) return;
    current = current[parts[i]];
  }
  delete current[parts[parts.length - 1]];
};

const rebuildInOrder = (target, source) => {
  const result = {};
  for (const key of Object.keys(source)) {
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      result[key] = rebuildInOrder(target[key] || {}, source[key]);
    } else if (key in (target || {})) {
      result[key] = target[key];
    }
  }
  return result;
};

// --- AWS Signature V4 ---

const hmac = (key, data) => crypto.createHmac('sha256', key).update(data).digest();
const hash = (data) => crypto.createHash('sha256').update(data).digest('hex');

const signRequest = (method, url, headers, body, service) => {
  const accessKey = process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SESSION_TOKEN;

  if (!accessKey || !secretKey) return null;

  const parsedUrl = new URL(url);
  const now = new Date();
  const dateStamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dateOnly = dateStamp.slice(0, 8);

  headers['x-amz-date'] = dateStamp;
  headers['host'] = parsedUrl.hostname;
  if (sessionToken) headers['x-amz-security-token'] = sessionToken;

  const signedHeaderKeys = Object.keys(headers).sort().map(k => k.toLowerCase());
  const signedHeaders = signedHeaderKeys.join(';');
  const canonicalHeaders = signedHeaderKeys.map(k => `${k}:${headers[k]}\n`).join('');

  const canonicalRequest = [
    method,
    parsedUrl.pathname,
    '',
    canonicalHeaders,
    signedHeaders,
    hash(body),
  ].join('\n');

  const scope = `${dateOnly}/${AWS_REGION}/${service}/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', dateStamp, scope, hash(canonicalRequest)].join('\n');

  let signingKey = hmac(`AWS4${secretKey}`, dateOnly);
  signingKey = hmac(signingKey, AWS_REGION);
  signingKey = hmac(signingKey, service);
  signingKey = hmac(signingKey, 'aws4_request');

  const signature = hmac(signingKey, stringToSign).toString('hex');
  headers['Authorization'] = `AWS4-HMAC-SHA256 Credential=${accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return headers;
};

// --- Amazon Translate ---

const translateText = (text, targetLang) => {
  return new Promise((resolve, reject) => {
    const awsTargetLang = LANG_MAP[targetLang];
    if (!awsTargetLang) {
      reject(new Error(`No Amazon Translate mapping for: ${targetLang}`));
      return;
    }

    const body = JSON.stringify({
      SourceLanguageCode: 'en',
      TargetLanguageCode: awsTargetLang,
      Text: text,
    });

    const url = `https://translate.${AWS_REGION}.amazonaws.com/`;
    const headers = {
      'content-type': 'application/x-amz-json-1.1',
      'x-amz-target': 'AWSShineFrontendService_20170701.TranslateText',
    };

    const signed = signRequest('POST', url, headers, body, 'translate');
    if (!signed) {
      reject(new Error('No AWS credentials'));
      return;
    }

    const parsedUrl = new URL(url);
    const req = https.request(
      {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname,
        method: 'POST',
        headers: signed,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const result = JSON.parse(data);
              resolve(result.TranslatedText);
            } catch (e) {
              reject(new Error(`Parse error: ${data}`));
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      },
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
};

const hasAwsCredentials = () => {
  // Check env vars first (CI or explicit)
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) return true;

  // Check project .env file
  try {
    const envPath = require('path').resolve(__dirname, '../.env');
    const envContent = require('fs').readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      const [key, ...rest] = line.split('=');
      const value = rest.join('=').trim();
      if (key.trim() === 'AWS_TRANSLATE_ACCESS_KEY_ID' && value) {
        process.env.AWS_ACCESS_KEY_ID = value;
      }
      if (key.trim() === 'AWS_TRANSLATE_SECRET_ACCESS_KEY' && value) {
        process.env.AWS_SECRET_ACCESS_KEY = value;
      }
    }
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) return true;
  } catch (e) {
    // No .env file
  }
  return false;
};

const translateBatch = async (texts, targetLang) => {
  const results = [];
  for (const text of texts) {
    try {
      // Skip interpolation-only or very short strings
      if (!text || text === 'OK' || text === 'QES PAdES') {
        results.push(text);
        continue;
      }

      // Protect i18next interpolation tokens like {{name}}
      const tokens = [];
      const cleaned = text.replace(/\{\{(\w+)\}\}/g, (match) => {
        tokens.push(match);
        return `<x${tokens.length}>`;
      });

      // Protect HTML tags
      const htmlTags = [];
      const withoutHtml = cleaned.replace(/<[^>]+>/g, (match) => {
        htmlTags.push(match);
        return `<h${htmlTags.length}>`;
      });

      let translated = await translateText(withoutHtml, targetLang);

      // Restore HTML tags
      htmlTags.forEach((tag, i) => {
        translated = translated.replace(new RegExp(`<h${i + 1}>`, 'g'), tag);
      });

      // Restore interpolation tokens
      tokens.forEach((token, i) => {
        translated = translated.replace(new RegExp(`<x${i + 1}>`, 'g'), token);
      });

      results.push(translated);

      // Small delay to avoid throttling
      await new Promise((r) => setTimeout(r, 50));
    } catch (err) {
      results.push(null);
    }
  }
  return results;
};

// --- Main ---

const main = async () => {
  const sourcePath = path.join(LOCALES_DIR, SOURCE_LANG, 'translation.json');
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
  const sourceKeys = getKeys(source);

  const langDirs = fs
    .readdirSync(LOCALES_DIR)
    .filter((dir) => {
      const fullPath = path.join(LOCALES_DIR, dir);
      return fs.statSync(fullPath).isDirectory() && dir !== SOURCE_LANG;
    })
    .sort();

  const useTranslate = hasAwsCredentials();

  console.log(`\n📋 Source: ${SOURCE_LANG} (${sourceKeys.length} keys)`);
  console.log(`🌐 Amazon Translate: ${useTranslate ? 'enabled' : 'disabled (no credentials, using placeholders)'}\n`);

  let hasIssues = false;
  let totalMissing = 0;
  let totalExtra = 0;
  let totalTranslated = 0;

  for (const lang of langDirs) {
    const targetPath = path.join(LOCALES_DIR, lang, 'translation.json');

    if (!fs.existsSync(targetPath)) {
      console.log(`⚠️  ${lang}: translation.json not found, creating`);
      if (!CHECK_ONLY) {
        const placeholder = {};
        const texts = sourceKeys.map((k) => getNestedValue(source, k));

        let translations;
        if (useTranslate) {
          translations = await translateBatch(texts, lang);
        }

        for (let i = 0; i < sourceKeys.length; i++) {
          const enValue = texts[i];
          const translated = translations?.[i];
          setNestedValue(placeholder, sourceKeys[i], translated || `${PLACEHOLDER_PREFIX}${enValue}`);
        }

        fs.mkdirSync(path.join(LOCALES_DIR, lang), { recursive: true });
        fs.writeFileSync(targetPath, JSON.stringify(placeholder, null, 2) + '\n', 'utf-8');
      }
      hasIssues = true;
      continue;
    }

    const target = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
    const targetKeys = getKeys(target);

    const missing = sourceKeys.filter((k) => !targetKeys.includes(k));
    const extra = targetKeys.filter((k) => !sourceKeys.includes(k));

    if (missing.length === 0 && extra.length === 0) {
      console.log(`✅ ${lang}: all ${sourceKeys.length} keys in sync`);
      continue;
    }

    hasIssues = true;
    totalMissing += missing.length;
    totalExtra += extra.length;

    if (missing.length > 0) {
      console.log(`❌ ${lang}: ${missing.length} missing key(s)`);
      for (const key of missing) {
        console.log(`   + ${key}`);
      }
    }

    if (extra.length > 0) {
      console.log(`🗑️  ${lang}: ${extra.length} extra key(s)`);
      for (const key of extra) {
        console.log(`   - ${key}`);
      }
    }

    if (!CHECK_ONLY) {
      if (missing.length > 0) {
        const textsToTranslate = missing.map((k) => getNestedValue(source, k));
        let translations;

        if (useTranslate) {
          translations = await translateBatch(textsToTranslate, lang);
          const translatedCount = translations.filter((t) => t !== null).length;
          totalTranslated += translatedCount;
        }

        for (let i = 0; i < missing.length; i++) {
          const enValue = textsToTranslate[i];
          const translated = translations?.[i];
          setNestedValue(target, missing[i], translated || `${PLACEHOLDER_PREFIX}${enValue}`);
        }
      }

      for (const key of extra) {
        deleteNestedValue(target, key);
      }

      const ordered = rebuildInOrder(target, source);
      fs.writeFileSync(targetPath, JSON.stringify(ordered, null, 2) + '\n', 'utf-8');
      console.log(`   ✏️  ${lang}: updated`);
    }
  }

  console.log('');

  if (hasIssues) {
    console.log(`📊 Summary: ${totalMissing} missing, ${totalExtra} extra across ${langDirs.length} languages`);
    if (useTranslate) {
      console.log(`🌐 Auto-translated: ${totalTranslated} strings via Amazon Translate`);
    }
    if (CHECK_ONLY) {
      console.log('❌ Translations are out of sync. Run: pnpm i18n:sync');
      process.exit(1);
    } else {
      if (totalTranslated < totalMissing) {
        console.log('⚠️  Some strings could not be translated. Search for "[NEEDS TRANSLATION]" to find placeholders.');
      }
      console.log('✅ All files synced.');
    }
  } else {
    console.log('✅ All translations are in sync.');
  }
};

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
