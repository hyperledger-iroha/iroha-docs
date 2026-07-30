import type { HeadConfig } from 'vitepress'

export const DOCS_ORIGIN = 'https://docs.iroha.tech'

export type TextDirection = 'ltr' | 'rtl'

export interface NavigationLabels {
  getStarted: string
  guides: string
  architecture: string
  reference: string
  help: string
}

export interface SearchLabels {
  buttonText: string
  noResultsText: string
}

export interface DocsLocale {
  key: string
  path: string
  lang: string
  label: string
  direction: TextDirection
  navigation: NavigationLabels
  search: SearchLabels
}

const englishNavigation: NavigationLabels = {
  getStarted: 'Get Started',
  guides: 'Guides',
  architecture: 'Architecture',
  reference: 'Reference',
  help: 'Help',
}

export const ROOT_LOCALE: DocsLocale = {
  key: 'root',
  path: '',
  lang: 'en',
  label: 'English',
  direction: 'ltr',
  navigation: englishNavigation,
  search: {
    buttonText: 'Search',
    noResultsText: 'No results found',
  },
}

export const TRANSLATED_LOCALES: readonly DocsLocale[] = [
  {
    key: 'es',
    path: 'es',
    lang: 'es',
    label: 'Español',
    direction: 'ltr',
    navigation: {
      getStarted: 'Primeros pasos',
      guides: 'Guías',
      architecture: 'Arquitectura',
      reference: 'Referencia',
      help: 'Ayuda',
    },
    search: { buttonText: 'Buscar', noResultsText: 'No se encontraron resultados' },
  },
  {
    key: 'pt',
    path: 'pt',
    lang: 'pt',
    label: 'Português',
    direction: 'ltr',
    navigation: {
      getStarted: 'Primeiros passos',
      guides: 'Guias',
      architecture: 'Arquitetura',
      reference: 'Referência',
      help: 'Ajuda',
    },
    search: { buttonText: 'Pesquisar', noResultsText: 'Nenhum resultado encontrado' },
  },
  {
    key: 'fr',
    path: 'fr',
    lang: 'fr',
    label: 'Français',
    direction: 'ltr',
    navigation: {
      getStarted: 'Bien démarrer',
      guides: 'Guides',
      architecture: 'Architecture',
      reference: 'Référence',
      help: 'Aide',
    },
    search: { buttonText: 'Rechercher', noResultsText: 'Aucun résultat trouvé' },
  },
  {
    key: 'ru',
    path: 'ru',
    lang: 'ru',
    label: 'Русский',
    direction: 'ltr',
    navigation: {
      getStarted: 'Начало работы',
      guides: 'Руководства',
      architecture: 'Архитектура',
      reference: 'Справочник',
      help: 'Помощь',
    },
    search: { buttonText: 'Поиск', noResultsText: 'Результаты не найдены' },
  },
  {
    key: 'ar',
    path: 'ar',
    lang: 'ar',
    label: 'العربية',
    direction: 'rtl',
    navigation: {
      getStarted: 'البدء',
      guides: 'الأدلة',
      architecture: 'البنية',
      reference: 'المرجع',
      help: 'المساعدة',
    },
    search: { buttonText: 'بحث', noResultsText: 'لم يتم العثور على نتائج' },
  },
  {
    key: 'ur',
    path: 'ur',
    lang: 'ur',
    label: 'اردو',
    direction: 'rtl',
    navigation: {
      getStarted: 'آغاز کریں',
      guides: 'رہنما',
      architecture: 'ساخت',
      reference: 'حوالہ',
      help: 'مدد',
    },
    search: { buttonText: 'تلاش', noResultsText: 'کوئی نتیجہ نہیں ملا' },
  },
  {
    key: 'ja',
    path: 'ja',
    lang: 'ja',
    label: '日本語',
    direction: 'ltr',
    navigation: {
      getStarted: 'はじめに',
      guides: 'ガイド',
      architecture: 'アーキテクチャ',
      reference: 'リファレンス',
      help: 'ヘルプ',
    },
    search: { buttonText: '検索', noResultsText: '結果が見つかりません' },
  },
  {
    key: 'he',
    path: 'he',
    lang: 'he',
    label: 'עברית',
    direction: 'rtl',
    navigation: {
      getStarted: 'תחילת העבודה',
      guides: 'מדריכים',
      architecture: 'ארכיטקטורה',
      reference: 'חומר עזר',
      help: 'עזרה',
    },
    search: { buttonText: 'חיפוש', noResultsText: 'לא נמצאו תוצאות' },
  },
  {
    key: 'my',
    path: 'my',
    lang: 'my',
    label: 'မြန်မာ',
    direction: 'ltr',
    navigation: {
      getStarted: 'စတင်ရန်',
      guides: 'လမ်းညွှန်များ',
      architecture: 'ဗိသုကာ',
      reference: 'ကိုးကား',
      help: 'အကူအညီ',
    },
    search: { buttonText: 'ရှာဖွေရန်', noResultsText: 'ရလဒ်မတွေ့ပါ' },
  },
  {
    key: 'ka',
    path: 'ka',
    lang: 'ka',
    label: 'ქართული',
    direction: 'ltr',
    navigation: {
      getStarted: 'დაწყება',
      guides: 'სახელმძღვანელოები',
      architecture: 'არქიტექტურა',
      reference: 'ცნობარი',
      help: 'დახმარება',
    },
    search: { buttonText: 'ძიება', noResultsText: 'შედეგები ვერ მოიძებნა' },
  },
  {
    key: 'hy',
    path: 'hy',
    lang: 'hy',
    label: 'Հայերեն',
    direction: 'ltr',
    navigation: {
      getStarted: 'Սկիզբ',
      guides: 'Ուղեցույցներ',
      architecture: 'Ճարտարապետություն',
      reference: 'Տեղեկատու',
      help: 'Օգնություն',
    },
    search: { buttonText: 'Որոնել', noResultsText: 'Արդյունքներ չկան' },
  },
  {
    key: 'az',
    path: 'az',
    lang: 'az',
    label: 'Azərbaycanca',
    direction: 'ltr',
    navigation: {
      getStarted: 'Başlanğıc',
      guides: 'Bələdçilər',
      architecture: 'Arxitektura',
      reference: 'İstinad',
      help: 'Kömək',
    },
    search: { buttonText: 'Axtar', noResultsText: 'Nəticə tapılmadı' },
  },
  {
    key: 'kk',
    path: 'kk',
    lang: 'kk',
    label: 'Қазақша',
    direction: 'ltr',
    navigation: {
      getStarted: 'Жұмысты бастау',
      guides: 'Нұсқаулықтар',
      architecture: 'Архитектура',
      reference: 'Анықтама',
      help: 'Көмек',
    },
    search: { buttonText: 'Іздеу', noResultsText: 'Нәтиже табылмады' },
  },
  {
    key: 'ba',
    path: 'ba',
    lang: 'ba',
    label: 'Башҡортса',
    direction: 'ltr',
    navigation: {
      getStarted: 'Эш башлау',
      guides: 'Ҡулланмалар',
      architecture: 'Архитектура',
      reference: 'Белешмә',
      help: 'Ярҙәм',
    },
    search: { buttonText: 'Эҙләү', noResultsText: 'Һөҙөмтәләр табылманы' },
  },
  {
    key: 'am',
    path: 'am',
    lang: 'am',
    label: 'አማርኛ',
    direction: 'ltr',
    navigation: {
      getStarted: 'መጀመሪያ',
      guides: 'መመሪያዎች',
      architecture: 'ንድፈ ሕንፃ',
      reference: 'ማጣቀሻ',
      help: 'እገዛ',
    },
    search: { buttonText: 'ፈልግ', noResultsText: 'ምንም ውጤት አልተገኘም' },
  },
  {
    key: 'dz',
    path: 'dz',
    lang: 'dz',
    label: 'རྫོང་ཁ',
    direction: 'ltr',
    navigation: {
      getStarted: 'འགོ་བཙུགས།',
      guides: 'ལམ་སྟོན།',
      architecture: 'བཟོ་བཀོད།',
      reference: 'གཞི་བསྟུན།',
      help: 'རོགས་རམ།',
    },
    search: { buttonText: 'འཚོལ།', noResultsText: 'གྲུབ་འབྲས་མ་ཐོབ།' },
  },
  {
    key: 'uz',
    path: 'uz',
    lang: 'uz',
    label: 'Oʻzbekcha',
    direction: 'ltr',
    navigation: {
      getStarted: 'Boshlash',
      guides: 'Qoʻllanmalar',
      architecture: 'Arxitektura',
      reference: 'Maʼlumotnoma',
      help: 'Yordam',
    },
    search: { buttonText: 'Qidirish', noResultsText: 'Natija topilmadi' },
  },
  {
    key: 'mn',
    path: 'mn',
    lang: 'mn',
    label: 'Монгол',
    direction: 'ltr',
    navigation: {
      getStarted: 'Эхлэх',
      guides: 'Гарын авлага',
      architecture: 'Архитектур',
      reference: 'Лавлагаа',
      help: 'Тусламж',
    },
    search: { buttonText: 'Хайх', noResultsText: 'Үр дүн олдсонгүй' },
  },
  {
    key: 'zh-hant',
    path: 'zh-hant',
    lang: 'zh-Hant',
    label: '繁體中文',
    direction: 'ltr',
    navigation: {
      getStarted: '開始使用',
      guides: '指南',
      architecture: '架構',
      reference: '參考',
      help: '說明',
    },
    search: { buttonText: '搜尋', noResultsText: '找不到結果' },
  },
  {
    key: 'zh-hans',
    path: 'zh-hans',
    lang: 'zh-Hans',
    label: '简体中文',
    direction: 'ltr',
    navigation: {
      getStarted: '快速开始',
      guides: '指南',
      architecture: '架构',
      reference: '参考',
      help: '帮助',
    },
    search: { buttonText: '搜索', noResultsText: '未找到结果' },
  },
] as const

export const ALL_LOCALES: readonly DocsLocale[] = [ROOT_LOCALE, ...TRANSLATED_LOCALES]

const translatedLocalePaths = new Set(TRANSLATED_LOCALES.map((locale) => locale.path))

export function localeForRelativePath(relativePath: string): DocsLocale {
  const firstSegment = relativePath.replace(/^\/+/u, '').split('/')[0]
  return TRANSLATED_LOCALES.find((locale) => locale.path === firstSegment) ?? ROOT_LOCALE
}

export function englishRelativePath(relativePath: string): string {
  const normalized = relativePath.replace(/^\/+/u, '')
  const [firstSegment, ...rest] = normalized.split('/')
  return translatedLocalePaths.has(firstSegment) ? rest.join('/') : normalized
}

export function prefixRoute(route: string, locale: DocsLocale): string {
  if (locale === ROOT_LOCALE || !route.startsWith('/')) return route
  return `/${locale.path}${route}`
}

function publishedRoute(relativePath: string): string {
  const withoutExtension = relativePath.replace(/\.md$/u, '')
  if (withoutExtension === 'index') return '/'
  if (withoutExtension.endsWith('/index')) return `/${withoutExtension.slice(0, -'/index'.length)}/`
  return `/${withoutExtension}.html`
}

export function publishedUrl(relativePath: string, locale: DocsLocale): string {
  const route = publishedRoute(englishRelativePath(relativePath))
  const localePrefix = locale === ROOT_LOCALE ? '' : `/${locale.path}`
  return `${DOCS_ORIGIN}${localePrefix}${route}`
}

export function alternateLocaleHead(relativePath: string): HeadConfig[] {
  const canonicalLocale = localeForRelativePath(relativePath)
  const links: HeadConfig[] = ALL_LOCALES.map((locale) => [
    'link',
    {
      rel: 'alternate',
      hreflang: locale.lang,
      href: publishedUrl(relativePath, locale),
    },
  ])

  links.push([
    'link',
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: publishedUrl(relativePath, ROOT_LOCALE),
    },
  ])
  links.push(['link', { rel: 'canonical', href: publishedUrl(relativePath, canonicalLocale) }])
  return links
}

export const SITE_LOCALES = Object.fromEntries(
  ALL_LOCALES.map((locale) => [
    locale.key,
    {
      label: locale.label,
      lang: locale.lang,
      link: locale === ROOT_LOCALE ? '/' : `/${locale.path}/`,
      dir: locale.direction,
    },
  ]),
)

export const SEARCH_LOCALES = Object.fromEntries(
  ALL_LOCALES.map((locale) => [
    locale.key,
    {
      translations: {
        button: {
          buttonText: locale.search.buttonText,
          buttonAriaLabel: locale.search.buttonText,
        },
        modal: {
          noResultsText: locale.search.noResultsText,
        },
      },
    },
  ]),
)
