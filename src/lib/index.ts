export { default as withAuth } from './withAuth'
export { default as redirectIfAuthenticated } from './redirectIfAuthenticated'
export { serializeCookie } from './cookie'

/**
 * to check if the string ends with any of the given strings
 */
export const endsWithAny = (str: string, suffixes: string[]) => suffixes.some((suffix) => str.endsWith(suffix))

export const Values = {
  NairaSymbol: '₦',
  DollarSymbol: '$',
  OptimizationUrl: 'https://res.cloudinary.com/sammxin/image/fetch/t_media_lib_thumb/',
}

export const splitWithModify: (str: string, splitter: string, mod: string) => string = (str, splitter, mod) => {
  const splitted = str.split(splitter)
  return [splitted[0], splitter, mod, splitted[1]].join('')
}

export const getCookie = (cname: string) => {
  const name = `${cname}=`
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}
