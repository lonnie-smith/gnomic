const ENTITY_RX = [
    { rx: /&/g, replace: '&amp;' },
    { rx: /"/g, replace: '&quot;' },
    { rx: /'/g, replace: '&apos;' },
    { rx: />/g, replace: '&gt;' },
    { rx: /</g, replace: '&lt;' },
]

module.exports = data => {
    let str = JSON.stringify(data);
    ENTITY_RX.forEach(entity => {
        str = str.replace(entity.rx, entity.replace);
    });
    return str;
};