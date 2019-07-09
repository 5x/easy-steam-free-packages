export const MS_IN_MINUTE = 60000;

export function escapeStringRegExp(str) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}
