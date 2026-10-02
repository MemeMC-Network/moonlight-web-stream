import CONFIG from "./config.js"

const CLEAN_URL_PAGE_SEGMENTS = new Set(["index", "admin", "stream"])
const API_PATH = "/api"
const ABSOLUTE_URL_PATTERN = /^https?:\/\//i

type RuntimeConfig = {
    path_prefix?: string
    api_base_url?: string
}

function inferPathPrefix(pathname: string): string {
    if (!pathname || pathname === "/") {
        return ""
    }

    let normalizedPathname = pathname
    if (normalizedPathname.endsWith("/")) {
        normalizedPathname = normalizedPathname.slice(0, -1)
    }

    const segments = normalizedPathname.split("/").filter(segment => segment.length > 0)
    const lastSegment = segments[segments.length - 1]?.toLowerCase() ?? ""

    if (lastSegment.endsWith(".html") || CLEAN_URL_PAGE_SEGMENTS.has(lastSegment)) {
        segments.pop()
        return segments.length === 0 ? "" : `/${segments.join("/")}`
    }

    return normalizedPathname === "/" ? "" : normalizedPathname
}

function getPathPrefix(): string {
    const config = (CONFIG as RuntimeConfig | undefined) ?? {}
    return config.path_prefix ?? inferPathPrefix(window.location.pathname)
}

function normalizeUrlWithoutTrailingSlash(url: string): string {
    return url.endsWith("/") ? url.slice(0, -1) : url
}

function getConfiguredApiBaseUrl(): string | null {
    const config = (CONFIG as RuntimeConfig | undefined) ?? {}
    const apiBaseUrl = config.api_base_url?.trim()
    if (!apiBaseUrl) {
        return null
    }

    if (ABSOLUTE_URL_PATTERN.test(apiBaseUrl)) {
        const parsedUrl = new URL(apiBaseUrl)
        if (!parsedUrl.pathname || parsedUrl.pathname === "/") {
            parsedUrl.pathname = API_PATH
        }
        return normalizeUrlWithoutTrailingSlash(parsedUrl.toString())
    }

    const path = apiBaseUrl.startsWith("/") ? apiBaseUrl : `/${apiBaseUrl}`
    return `${window.location.origin}${normalizeUrlWithoutTrailingSlash(path)}`
}

export function buildUrl(path: string): string {
    return `${window.location.origin}${getPathPrefix()}${path}`
}

export function buildApiBaseUrl(): string {
    return getConfiguredApiBaseUrl() ?? buildUrl(API_PATH)
}
