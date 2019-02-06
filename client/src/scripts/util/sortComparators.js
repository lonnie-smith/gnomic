const participles = ['de', 'du', 'van', 'tee', 'von', 'da', 'di'];
export function surname(string) {
    const words = string.toLowerCase()
        .replace(/[^a-z]/g, '')
        .split(/\s+/);
    if (words.length === 1) {
        return words[0];
    }
    const filtered = words.filter(word => {
        return !(participles.includes(word));
    });
    if (filtered.length === 0) {
        return words.join(' ');
    }
    return filtered.join(' ');
}

const articles = ['a', 'an', 'the'];
export function title(string) {
    const words = string.toLowerCase()
        .replace(/[^a-z]/g, '')
        .split(/\s+/);
    if (words.length === 1) {
        return words[0];
    }
    const filtered = words.filter(word => {
        return !(articles.includes(word));
    });
    if (filtered.length === 0) {
        return words.join(' ');
    }
    return filtered.join(' ');
}

export function caseInsensitive(string) {
    return string.toLowerCase();
}

const BC_RX = /BCE|BC|B\.\s*C\.\s*E\.|B\.\s*C\./;
export function yearString(string) {
    if (BC_RX.test(string)) {
        return -1 * parseInt(string, 10);
    } else {
        return parseInt(string, 10);
    }
}
