'use server'

import { getSdk } from '@/gql/client'
import { getContentUrlQueryVariables } from '@gql/graphql'
import { createClient, localeToGraphLocale, type IOptiGraphClient } from '@remkoj/optimizely-graph-client'

export interface GetContentUrlParams {
  key: string
  locale?: string
}

export interface GetContentUrlResult {
  url: string | null
  hierarchicalPath: string | null
  error?: unknown
}

/**
 * Get the URL for a content item by its key
 * Used in preview mode where the pathname is /preview and we need the actual content URL
 */
export async function getContentUrl(
  options: GetContentUrlParams,
  client?: IOptiGraphClient
): Promise<GetContentUrlResult> {
  try {
    const graphClient = client ?? createClient(undefined, undefined, {
      nextJsFetchDirectives: true,
      cache: true,
      queryCache: true
    })

    const graphLocale = options.locale
      ? localeToGraphLocale(options.locale) as getContentUrlQueryVariables['locale']
      : undefined

    const response = await getSdk(graphClient).getContentUrl({
      key: options.key,
      locale: graphLocale,
    })

    const item = response?.content?.items?.[0]

    return {
      url: item?._metadata?.url?.default ?? null,
      hierarchicalPath: item?._metadata?.url?.hierarchical ?? null,
    }
  } catch (e) {
    console.warn("Error fetching content URL", e)
    return {
      url: null,
      hierarchicalPath: null,
      error: e
    }
  }
}

export default getContentUrl
