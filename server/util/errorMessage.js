module.exports = err => {
    return `
        <h1 style="color: red">${err.toString()}</h1>
        <p style="white-space: pre">${err.stack}</p>
    `;
};

