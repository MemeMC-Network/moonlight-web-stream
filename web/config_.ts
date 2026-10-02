import CONFIG from "./config.js"

const CLEAN_URL_PAGE_SEGMENTS = new Set(["index", "admin", "stream"])

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
    const config = (CONFIG as { path_prefix?: string } | undefined) ?? {}
    return config.path_prefix ?? inferPathPrefix(window.location.pathname)
}

export function buildUrl(path: string): string {
    return `${window.location.origin}${getPathPrefix()}${path}`
}
