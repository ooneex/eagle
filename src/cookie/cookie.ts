import type { ICookie } from './types.ts';

const FIELD_CONTENT_REGEXP = /^(?=[\x20-\x7E]*$)[^()@<>,;:\\"\[\]?={}\s]+$/;

// biome-ignore lint/suspicious/noShadowRestrictedNames: trust me
function toString(cookie: ICookie): string {
  if (!cookie.name) {
    return '';
  }
  const out: string[] = [];
  validateName(cookie.name);
  validateValue(cookie.name, cookie.value);
  out.push(`${cookie.name}=${cookie.value}`);

  if (cookie.name.startsWith('__Secure')) {
    cookie.secure = true;
  }
  if (cookie.name.startsWith('__Host')) {
    cookie.path = '/';
    cookie.secure = true;
    // biome-ignore lint/performance/noDelete: trust me
    delete cookie.domain;
  }

  if (cookie.secure) {
    out.push('Secure');
  }
  if (cookie.httpOnly) {
    out.push('HttpOnly');
  }
  if (cookie.partitioned) {
    out.push('Partitioned');
  }
  if (typeof cookie.maxAge === 'number' && Number.isInteger(cookie.maxAge)) {
    if (cookie.maxAge < 0) {
      throw new RangeError(
        `Cannot serialize cookie as Max-Age must be >= 0: received ${cookie.maxAge}`,
      );
    }
    out.push(`Max-Age=${cookie.maxAge}`);
  }
  if (cookie.domain) {
    validateDomain(cookie.domain);
    out.push(`Domain=${cookie.domain}`);
  }
  if (cookie.sameSite) {
    out.push(`SameSite=${cookie.sameSite}`);
  }
  if (cookie.path) {
    validatePath(cookie.path);
    out.push(`Path=${cookie.path}`);
  }
  if (cookie.expires) {
    const { expires } = cookie;
    const date = typeof expires === 'number' ? new Date(expires) : expires;
    out.push(`Expires=${date.toUTCString()}`);
  }
  if (cookie.unparsed) {
    out.push(cookie.unparsed.join('; '));
  }
  return out.join('; ');
}

function validateName(name: string | undefined | null) {
  if (name && !FIELD_CONTENT_REGEXP.test(name)) {
    throw new SyntaxError(`Invalid cookie name: "${name}"`);
  }
}

function validatePath(path: string | null) {
  if (path === null) {
    return;
  }
  for (let i = 0; i < path.length; i++) {
    const c = path.charAt(i);
    if (
      c < String.fromCharCode(0x20) ||
      c > String.fromCharCode(0x7e) ||
      c === ';'
    ) {
      throw new SyntaxError(
        `Cookie path "${path}" contains invalid character: "${c}"`,
      );
    }
  }
}

function validateValue(name: string, value: string | null) {
  if (value === null) return;
  for (let i = 0; i < value.length; i++) {
    const c = value.charAt(i);
    if (
      c < String.fromCharCode(0x21) ||
      c === String.fromCharCode(0x22) ||
      c === String.fromCharCode(0x2c) ||
      c === String.fromCharCode(0x3b) ||
      c === String.fromCharCode(0x5c) ||
      c === String.fromCharCode(0x7f)
    ) {
      throw new SyntaxError(
        `RFC2616 cookie '${name}' cannot contain character '${c}'`,
      );
    }
    if (c > String.fromCharCode(0x80)) {
      throw new SyntaxError(
        `RFC2616 cookie '${name}' can only have US-ASCII chars as value: It contains 0x${c.charCodeAt(0).toString(16)}`,
      );
    }
  }
}

function validateDomain(domain: string) {
  const char1 = domain.charAt(0);
  const charN = domain.charAt(domain.length - 1);
  if (char1 === '-' || charN === '.' || charN === '-') {
    throw new SyntaxError(
      `Invalid first/last char in cookie domain: ${domain}`,
    );
  }
}

export const getCookies = (headers: Headers): Record<string, string> => {
  const cookie = headers.get('Cookie');
  if (cookie !== null) {
    const out: Record<string, string> = {};
    const c = cookie.split(';');
    for (const kv of c) {
      const [cookieKey, ...cookieVal] = kv.split('=');
      if (cookieKey === undefined) {
        throw new SyntaxError("Cookie cannot start with '='");
      }
      const key = cookieKey.trim();
      out[key] = cookieVal.join('=');
    }
    return out;
  }
  return {};
};

export const setCookie = (headers: Headers, cookie: ICookie) => {
  const v = toString(cookie);
  if (v) {
    headers.append('Set-Cookie', v);
  }
};

export const deleteCookie = (
  headers: Headers,
  name: string,
  attributes?: Pick<
    ICookie,
    'path' | 'domain' | 'secure' | 'httpOnly' | 'partitioned'
  >,
) => {
  setCookie(headers, {
    name: name,
    value: '',
    expires: new Date(0),
    ...attributes,
  });
};

export function parseSetCookie(value: string): ICookie | null {
  const attrs = value.split(';').map((attr) => {
    const [key, ...values] = attr.trim().split('=');
    // biome-ignore lint/style/noNonNullAssertion: trust me
    return [key!, values.join('=')] as const;
  });

  if (!attrs[0]) {
    return null;
  }

  const cookie: ICookie = {
    name: attrs[0][0],
    value: attrs[0][1],
  };

  for (const [key, value] of attrs.slice(1)) {
    switch (key.toLowerCase()) {
      case 'expires':
        cookie.expires = new Date(value);
        break;
      case 'max-age':
        cookie.maxAge = Number(value);
        if (cookie.maxAge < 0) {
          // deno-lint-ignore no-console
          console.warn(
            'Max-Age must be an integer superior or equal to 0. Cookie ignored.',
          );
          return null;
        }
        break;
      case 'domain':
        cookie.domain = value;
        break;
      case 'path':
        cookie.path = value;
        break;
      case 'secure':
        cookie.secure = true;
        break;
      case 'httponly':
        cookie.httpOnly = true;
        break;
      case 'samesite':
        cookie.sameSite = value as NonNullable<ICookie['sameSite']>;
        break;
      default:
        if (!Array.isArray(cookie.unparsed)) {
          cookie.unparsed = [];
        }
        cookie.unparsed.push([key, value].join('='));
    }
  }
  if (cookie.name.startsWith('__Secure-')) {
    if (!cookie.secure) {
      // deno-lint-ignore no-console
      console.warn(
        'Cookies with names starting with `__Secure-` must be set with the secure flag. Cookie ignored.',
      );
      return null;
    }
  }
  if (cookie.name.startsWith('__Host-')) {
    if (!cookie.secure) {
      // deno-lint-ignore no-console
      console.warn(
        'Cookies with names starting with `__Host-` must be set with the secure flag. Cookie ignored.',
      );
      return null;
    }
    if (cookie.domain !== undefined) {
      // deno-lint-ignore no-console
      console.warn(
        'Cookies with names starting with `__Host-` must not have a domain specified. Cookie ignored.',
      );
      return null;
    }
    if (cookie.path !== '/') {
      // deno-lint-ignore no-console
      console.warn(
        'Cookies with names starting with `__Host-` must have path be `/`. Cookie has been ignored.',
      );
      return null;
    }
  }
  return cookie;
}

export const getSetCookies = (headers: Headers): ICookie[] => {
  return headers
    .getSetCookie()
    .map(parseSetCookie)
    .filter(Boolean) as ICookie[];
};
