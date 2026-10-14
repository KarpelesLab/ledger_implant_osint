// Page titles and descriptions, shared by the app and the build step that writes each page's <head>.
import { statusLabel, summary, type ReportData } from './reportData.ts'

export const siteName = 'Ledger Implant OSINT'
export const siteUrl = 'https://karpeleslab.github.io/ledger_implant_osint/'
export const siteTitle = 'Tampered and fake Ledger wallets, and where they were bought'
export const siteDescription =
  'Ledger hardware wallets found with spy implants or sold as counterfeits: where each one was bought, what was inside, and the photos that show it.'

export function homeTitle(): string {
  return `${siteTitle} | ${siteName}`
}

export function reportTitle(r: ReportData): string {
  return `${r.title} | ${siteName}`
}

/** Cuts text at a word boundary so it fits in a search result or link preview. */
function clip(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.]$/, '') + '…'
}

/** The verdict, where the device came from, then the start of the notes. */
export function reportDescription(r: ReportData): string {
  const gen = r.implant.generation ? ` (${r.implant.generation})` : ''
  const lead = `${statusLabel[r.implant.status]}${gen}. ${summary(r)}`
  const firstNote = r.implant.notes?.match(/^.*?[.!?](?=\s|$)/)?.[0]
  return clip(firstNote ? `${lead} ${firstNote}` : lead, 220)
}
