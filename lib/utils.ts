import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { promises as fs } from 'fs';
import yaml from 'js-yaml';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getPersona(slug: string) {
  try {
    // First try to read from /data/personas/[slug]/v1.yaml
    try {
      const content = await fs.readFile(`data/personas/${slug}/v1.yaml`, 'utf-8');
      return yaml.load(content) as Record<string, any>;
    } catch {
      // If not found in subfolder, try direct yaml file
      const content = await fs.readFile(`data/personas/${slug}.yaml`, 'utf-8');
      return yaml.load(content) as Record<string, any>;
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}
