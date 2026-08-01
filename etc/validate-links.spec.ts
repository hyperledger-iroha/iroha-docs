import { describe, expect, test } from 'vitest'
import { LinkOtherFile, LinkSelfAnchor, assertUrlWithinPublicPath, parseLink } from './validate-links'

describe('Parse link', () => {
  test('Parse self link', () => {
    const result = parseLink({
      root: '.',
      source: './a/b.html',
      href: '#afse',
    })

    expect(result).toEqual({ type: 'self', anchor: 'afse' } satisfies LinkSelfAnchor)
  })

  test('Accept a navigation link to the current page without an anchor', () => {
    const result = parseLink({
      root: '/root',
      source: '/root/guide/index.html',
      href: '/pub/guide/',
      publicPath: '/pub/',
    })

    expect(result).toEqual({
      type: 'other',
      file: '/root/guide/index.html',
    } satisfies LinkOtherFile)
  })

  test('Parse link with public path', () => {
    const result = parseLink({
      root: '/root',
      source: '/root/foo/bar.html',
      href: '/pub/baz.html',
      publicPath: '/pub/',
    })

    expect(result).toEqual({
      type: 'other',
      file: '/root/baz.html',
    } satisfies LinkOtherFile)
  })

  test('Reject root-relative link that escapes the public path', () => {
    expect(() =>
      parseLink({
        root: '/root',
        source: '/root/foo/bar.html',
        href: '/baz.html',
        publicPath: '/pub/',
      }),
    ).toThrow('root-relative URL escapes public path /pub/: /baz.html')
  })

  test.each(['/assets/app.js', '/styles/site.css', '/images/hero.webp'])(
    'Reject built resource URL that escapes the public path: %s',
    (url) => {
      expect(() => assertUrlWithinPublicPath(url, '/pub/')).toThrow(
        `root-relative URL escapes public path /pub/: ${url}`,
      )
    },
  )

  test.each(['/pub/assets/app.js', 'assets/app.js', 'https://cdn.example/app.js', '//cdn.example/app.js'])(
    'Accept built resource URL within or independent of the public path: %s',
    (url) => {
      expect(() => assertUrlWithinPublicPath(url, '/pub/')).not.toThrow()
    },
  )

  test('Reject an escaping URL extracted from srcset', () => {
    const urls = '/pub/images/small.webp 1x, /images/large.webp 2x'
      .split(',')
      .map((candidate) => candidate.trim().split(/\s+/u)[0])

    expect(() => urls.forEach((url) => assertUrlWithinPublicPath(url, '/pub/'))).toThrow(
      'root-relative URL escapes public path /pub/: /images/large.webp',
    )
  })

  test('Fallback to index.html when public path is specified', () => {
    const result = parseLink({
      root: '/root',
      source: '/root/foo/bar.html',
      href: '/pub/#zzz',
      publicPath: '/pub/',
    })

    expect(result).toEqual({
      type: 'other',
      file: '/root/index.html',
      anchor: 'zzz',
    } satisfies LinkOtherFile)
  })

  test('Fallback to index.html without public path', () => {
    const result = parseLink({
      root: '/root',
      source: '/root/foo/bar.html',
      href: '/#zzz',
    })

    expect(result).toEqual({
      type: 'other',
      file: '/root/index.html',
      anchor: 'zzz',
    } satisfies LinkOtherFile)
  })
})
