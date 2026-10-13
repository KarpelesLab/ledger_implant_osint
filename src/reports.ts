export type ImplantStatus = 'confirmed' | 'suspected' | 'unverified' | 'clean'

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
}

export interface Report extends ReportData {
  id: string
  images: (ReportImage & { url: string })[]
  videos: (ReportVideo & { url: string; posterUrl?: string })[]
}

// Each report lives in reports/<id>/report.json, with its pictures (stored in LFS) next to it.
const data = import.meta.glob<ReportData>('/reports/*/report.json', {
  eager: true,
  import: 'default',
})
const media = import.meta.glob<string>('/reports/*/*.{jpg,jpeg,png,webp,mp4}', {
  eager: true,
  query: '?url',
  import: 'default',
})

function mediaUrl(dir: string, file: string): string {
  const url = media[`${dir}/${file}`]
  if (!url) throw new Error(`${dir}/report.json: missing file ${file}`)
  return url
}

export const reports: Report[] = Object.entries(data)
  .map(([path, r]) => {
    const dir = path.slice(0, path.lastIndexOf('/'))
    return {
      ...r,
      id: dir.slice(dir.lastIndexOf('/') + 1),
      images: r.images.map((img) => ({ ...img, url: mediaUrl(dir, img.file) })),
      videos: (r.videos ?? []).map((v) => ({
        ...v,
        url: mediaUrl(dir, v.file),
        posterUrl: v.poster ? mediaUrl(dir, v.poster) : undefined,
      })),
    }
  })
  .sort((a, b) => b.reportedAt.localeCompare(a.reportedAt))

export function findReport(id: string): Report | undefined {
  return reports.find((r) => r.id === id)
}

export const statusLabel: Record<ImplantStatus, string> = {
  confirmed: 'Implant confirmed',
  suspected: 'Implant suspected',
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
