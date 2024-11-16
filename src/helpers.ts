export function serviceLinkToServerDeclaration(serviceLink: string) {
    try {
        const url = new URL(serviceLink);
        const hostname = url.hostname;

        const parts = hostname.split(".");

        if (parts[0] === "www") {
            parts.shift(); // Remove 'www'
        }

        const reverseDns = parts.reverse().join(".");
        return reverseDns;
    } catch (error) {
        console.error("Invalid URL:", error);
        return null;
    }
}

export function regexEscape(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}