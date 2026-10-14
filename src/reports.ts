import type { ReportData, ReportImage, ReportVideo } from './reportData'

export * from './reportData'

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
