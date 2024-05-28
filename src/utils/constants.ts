
export const HOST = {
    production: window.location.host.includes('.vercel.app')?'https://xyz.indelivtest.in':"https://" + window.location.host,
    development:'https://xyz.indelivtest.in',
    test:'https://abc.indelivtest.in',
};
export const TOKEN_STORAGE = 'token'