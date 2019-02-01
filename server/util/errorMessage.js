module.exports = (err, res) => {
    res.status(500);
    if (process.env.DEBUG === 'true') {
        const message = `
            <h1 style="color: red">${err.toString()}</h1>
            <p style="white-space: pre">${err.stack}</p>
        `;
        res.send(message);
    } else {
        res.send('Server error');
    }
};

