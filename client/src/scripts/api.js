const INDEX_CACHE_KEY = 'fullTextIndex';

class Api {
    constructor() {
        this.url = '/api';
    }

    async fetchFragmentsByIds(ids) {
        const query = encodeURIComponent(JSON.stringify(ids));
        return fetch(`${this.url}/fragments?ids=${query}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject({
                        status: response.status,
                        message: response.text(),
                    });
                }
            });
    }

    async fetchSearchIndex(expectedVersion) {
        const url = `${this.url}/searchIndex`;
        const hasCache = await window.caches.has(INDEX_CACHE_KEY);
        if (hasCache) {
            const cache = await window.caches.open(INDEX_CACHE_KEY);
            const response = await cache.match(url);
            if (response && response.ok) {
                const data = await response.json();
                if (data.version === expectedVersion) {
                    console.log('Using cached version of full text index');
                    return Promise.resolve({
                        version: data.version,
                        index: JSON.parse(data.index),
                    });
                } else {
                    console.log('Expiring outddated version of full text index');
                    await window.caches.delete(INDEX_CACHE_KEY);
                }
            }
        }

        console.log('Downloading full text index');
        const response = await fetch(url);
        const cache = await window.caches.open(INDEX_CACHE_KEY);
        await cache.put(url, response.clone());
        if (response.ok) {
            const data = await(response.json());
            return {
                version: data.version,
                index: JSON.parse(data.index),
            };
        } else {
            return Promise.reject({
                status: response.status,
                text: response.text(),
            });
        }
    }
}

export const api = new Api();
