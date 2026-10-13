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
    price?: string
  }
  implant: {
    version?: string
    generation?: string
    status: ImplantStatus
    marking?: string
    analyzedBy?: string
    components?: string[]
    notes?: string
  }
  sources: Source[]
  images: ReportImage[]
}

export interface Report extends ReportData {
  id: string
  images: (ReportImage & { url: string })[]
}

// Each report lives in reports/<id>/report.json, with its pictures (stored in LFS) next to it.
const data = import.meta.glob<ReportData>('/reports/*/report.json', {
  eager: true,
  import: 'default',
})
const media = import.meta.glob<string>('/reports/*/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const reports: Report[] = Object.entries(data)
  .map(([path, r]) => {
    const dir = path.slice(0, path.lastIndexOf('/'))
    return {
      ...r,
      id: dir.slice(dir.lastIndexOf('/') + 1),
      images: r.images.map((img) => {
        const url = media[`${dir}/${img.file}`]
        if (!url) throw new Error(`${path}: missing image ${img.file}`)
        return { ...img, url }
      }),
    }
  })
  .sort((a, b) => b.reportedAt.localeCompare(a.reportedAt))

export function findReport(id: string): Report | undefined {
  return reports.find((r) => r.id === id)
}

export function formatDate(iso: string): string {
  return iso.slice(0, 10)
}
