export function regexEscape(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}