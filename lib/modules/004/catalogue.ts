const PRODUCTS: { key: string; names: string[] }[] = [
  { key: 'oat_hay', names: ['oat hay', 'hawerhooi'] },
  { key: 'lucerne', names: ['lucerne', 'alfalfa', 'lusern'] },
  { key: 'barley', names: ['barley', 'gars'] },
  { key: 'maize', names: ['white maize', 'yellow maize', 'maize', 'mielies', 'mielie'] },
  { key: 'oats', names: ['oats', 'hawer'] },
  { key: 'soybeans', names: ['soybeans', 'soybean', 'soya', 'soja'] },
  { key: 'sorghum', names: ['sorghum', 'graansorghum'] },
  { key: 'wheat', names: ['wheat', 'koring'] },
  { key: 'beans', names: ['beans', 'bone'] },
  { key: 'chop', names: ['chop', 'mieliechop'] },
  { key: 'bran', names: ['bran', 'semels'] },
  { key: 'hay', names: ['hay', 'hooi'] },
]

const PACKAGING: { key: string; names: string[] }[] = [
  { key: 'bulk', names: ['losmaat', 'bulk'] },
  { key: 'small_bale', names: ['klein bale', 'small bale', 'small bales'] },
  { key: 'bale', names: ['bale', 'bales', 'baal'] },
  { key: 'bag', names: ['bag', 'bags', 'sak'] },
]

const GRADES: { key: string; names: string[] }[] = [
  { key: 'wm1', names: ['wm1', 'wm 1'] },
  { key: 'wm2', names: ['wm2', 'wm 2'] },
  { key: 'wm3', names: ['wm3', 'wm 3'] },
  { key: 'feed', names: ['feed grade', 'feed', 'voergraad'] },
]

function normalise(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ')
}

function matchKey(text: string, rows: { key: string; names: string[] }[]): string | null {
  const value = normalise(text)
  if (!value) return null
  const found = rows
    .flatMap((row) => row.names.map((name) => ({ key: row.key, name: normalise(name) })))
    .filter((row) => row.name === value)
    .sort((a, b) => b.name.length - a.name.length)[0]
  return found?.key ?? null
}

export function canonicalProduct(original: string): { key: string | null } {
  return { key: matchKey(original, PRODUCTS) }
}

export function canonicalPackaging(original: string): { key: string | null } {
  return { key: matchKey(original, PACKAGING) }
}

export function canonicalGrade(original: string): { key: string | null } {
  return { key: matchKey(original, GRADES) }
}

export function productLabel(key: string | null, original: string): string {
  return original.trim() || key || 'Product unknown'
}
