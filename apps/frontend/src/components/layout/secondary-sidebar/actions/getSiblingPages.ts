'use server'

import { getSdk } from '@/gql/client'
import { getSiblingPagesQueryVariables } from '@gql/graphql'
import { createClient, localeToGraphLocale, type IOptiGraphClient } from '@remkoj/optimizely-graph-client'

export interface SiblingPage {
  key: string
  displayName: string
  url: string
  hierarchicalPath: string
  depth: number
}

export interface GetSiblingPagesParams {
  currentPath: string
  locale?: string
  depth?: number // How many levels up to go for finding siblings
}

export interface GetSiblingPagesResult {
  parentPath: string
  currentPath: string
  pages: SiblingPage[]
  error?: unknown
}

/**
 * Get sibling pages for a given path
 * This finds the parent directory and returns all pages at the same level
 */
export async function getSiblingPages(
  options: GetSiblingPagesParams,
  client?: IOptiGraphClient
): Promise<GetSiblingPagesResult> {
  try {
    const graphClient = client ?? createClient(undefined, undefined, {
      nextJsFetchDirectives: true,
      cache: true,
      queryCache: true
    })

    // Extract parent path from current path
    // e.g., "/kollektivavtal/apoteksavtalet/standard22" -> "/kollektivavtal/apoteksavtalet"
    const pathParts = options.currentPath.split('/').filter(Boolean)
    const depth = options.depth ?? 1

    // Go up 'depth' levels to find the parent
    const parentParts = pathParts.slice(0, Math.max(1, pathParts.length - depth))
    const parentPath = '/' + parentParts.join('/')

    const graphLocale = options.locale
      ? localeToGraphLocale(options.locale) as getSiblingPagesQueryVariables['locale']
      : undefined

    // Add trailing slash to ensure exact parent match
    // e.g., "/kollektivavtal/apoteksavtalet/" won't match "/kollektivavtal/apoteksavtalet-2/"
    const parentPathWithSlash = parentPath.endsWith('/') ? parentPath : `${parentPath}/`

    const response = await getSdk(graphClient).getSiblingPages({
      parentPath: parentPathWithSlash,
      locale: graphLocale,
      limit: 100
    })

    const allPages: SiblingPage[] = (response?.pages?.items ?? [])
      .filter((item): item is NonNullable<typeof item> => item !== null && item !== undefined)
      .map(item => ({
        key: item._metadata?.key ?? '',
        displayName: item._metadata?.displayName ?? 'Untitled',
        url: item._metadata?.url?.default ?? '',
        hierarchicalPath: item._metadata?.url?.hierarchical ?? '',
        depth: (item._metadata?.url?.hierarchical ?? '').split('/').filter(Boolean).length
      }))
      // Filter to only include pages that are direct children of the parent
      // (same depth as current page or one level deeper than parent)
      .filter(page => {
        const parentDepth = parentParts.length
        return page.depth === parentDepth + 1
      })

    // Deduplicate by URL (in case of multiple locales/versions/keys)
    const seen = new Set<string>()
    const pages = allPages
      .filter(page => {
        if (!page.url || seen.has(page.url)) return false
        seen.add(page.url)
        return true
      })
      // Sort by display name
      .sort((a, b) => a.displayName.localeCompare(b.displayName, options.locale ?? 'sv'))

    return {
      parentPath,
      currentPath: options.currentPath,
      pages
    }
  } catch (e) {
    console.warn("Error fetching sibling pages", e)
    return {
      parentPath: '',
      currentPath: options.currentPath,
      pages: [],
      error: e
    }
  }
}

export default getSiblingPages
