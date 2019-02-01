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
}

export const api = new Api();
