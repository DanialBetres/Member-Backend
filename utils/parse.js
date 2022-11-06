exports.parseJWT = (token) => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

