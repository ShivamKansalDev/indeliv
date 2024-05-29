
export const HOST = {
    production: window.location.host.includes('.vercel.app')?'https://abc.indelivtest.in':"https://" + window.location.host,
    development:'https://abc.indelivtest.in',
    test:'https://abc.indelivtest.in',
};
export const TOKEN_STORAGE = 'token'