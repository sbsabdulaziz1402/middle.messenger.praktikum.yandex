function trim(str: string, chars?: string): string {
  if (typeof str !== 'string') {
    return '';
  }

  if (chars === undefined) {
    return str.trim();
  }

  const escapedChars = chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const trimRegex = new RegExp(`^[${escapedChars}]+|[${escapedChars}]+$`, 'g');

  return str.replace(trimRegex, '');
}

export default trim;
