// Report types and plain-text helpers. Kept free of Vite-only APIs so the build can use them too.

export type ImplantStatus = 'confirmed' | 'suspected' | 'counterfeit' | 'unverified' | 'clean'

export interface Source {
  url: string
  title?: string
  author?: string
  handle?: string
  postedAt?: string
  text?: string
}

export interface ReportImage {
  file: string
  source?: string
  original?: string
  caption?: string
}

export interface ReportVideo {
  file: string
  /** A still frame shown before the video plays. */
  poster?: string
  source?: string
  original?: string
  caption?: string
}

export interface ReportData {
  title: string
  reportedAt: string
  device: { model: string; variant?: string; ean?: string }
  purchase: {
    retailer?: string
    store?: string
    city?: string
    country?: string
    date: string | null
    dateNote?: string
    shippedFrom?: string
    /** Wholesaler that supplied the seller, when known. */
    distributor?: string
    price?: string
  }
  implant: {
    version?: string
    generation?: string
    status: ImplantStatus
    marking?: string
    /** IMEIs of the implant's cellular modem, read from its label or Data Matrix code. */
    imei?: string[]
    analyzedBy?: string
    components?: string[]
    notes?: string
  }
  sources: Source[]
  images: ReportImage[]
  videos?: ReportVideo[]
  /**
   * The link-preview image, cropped to 1200x630. Defaults to the centre of the first image;
   * set it when that crop would show the wrong thing.
   */
  preview?: { file?: string; position?: 'centre' | 'top' | 'bottom' | 'left' | 'right' }
}

export const statusLabel: Record<ImplantStatus, string> = {
  confirmed: 'Implant confirmed',
  suspected: 'Implant suspected',
  counterfeit: 'Counterfeit device',
  unverified: 'Not yet verified',
  clean: 'No implant found',
}

/** Formats "2026-10-13T12:45:53Z" as "13 Oct 2026", and a bare "2026-06" as "June 2026". */
export function formatDate(iso: string): string {
  if (/^\d{4}-\d{2}$/.test(iso)) {
    return new Date(`${iso}-01T00:00:00Z`).toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

export function countryName(code?: string): string | undefined {
  if (!code) return undefined
  try {
    return regionNames.of(code) ?? code
  } catch {
    return code
  }
}

/** City and country, without repeating city-states like Singapore. */
export function place(p: ReportData['purchase']): string | undefined {
  const country = countryName(p.country)
  const parts = [p.city === country ? undefined : p.city, country].filter(Boolean)
  return parts.length ? parts.join(', ') : undefined
}

/** One plain sentence describing where the device came from. */
export function summary(r: ReportData): string {
  const p = r.purchase
  if (!p.retailer) return `${r.device.model}, purchase details not given.`
  const at = [p.store, place(p)].filter(Boolean).join(', ')
  let s = `${r.device.model} bought from ${p.retailer}`
  if (at) s += ` (${at})`
  if (p.date) s += `${p.date.length > 7 ? ' on' : ' in'} ${formatDate(p.date)}`
  if (p.shippedFrom) s += `, shipped from ${p.shippedFrom}`
  return s + '.'
}
