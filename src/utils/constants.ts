
export const HOST = {
    production: window.location.host.includes('.vercel.app') ? 'https://def.indelivtest.in' : "https://" + window.location.host,
    development: 'https://def.indelivtest.in',
    test: 'https://def.indelivtest.in',
};
export const TOKEN_STORAGE = 'token'
