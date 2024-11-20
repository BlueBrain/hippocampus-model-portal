import { writeFileSync, mkdirSync } from 'fs';

import logger from 'node-color-log';

import { nexus } from './config.mjs'

export function ensureArray(value) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

export function getUUID(url) {
  const urlObj = new URL(url);

  const id = urlObj.pathname
    .replace('/incoming', '')
    .split('/')
    .at(-1);

  const uuid = decodeURIComponent(id).split('/').at(-1);

  return uuid;
}

export async function save(url, basePath, accept = 'application/json' ) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${nexus.accessToken}`,
      'Accept': accept,
    },
  });

  if (!res.ok || res.status !== 200) {
    const resBody = await res.text();

    logger.error(resBody);
    return;
  }

  const fileArrayBuffer = await res.arrayBuffer();

  const uuid = getUUID(url);

  const dirPath = `${basePath}/${uuid[0]}/${uuid[1]}`;
  mkdirSync(dirPath, { recursive: true });

  const filePath = `${dirPath}/${uuid}`;

  const buffer = Buffer.from(fileArrayBuffer);

  writeFileSync(filePath, buffer);

  return buffer;
}
