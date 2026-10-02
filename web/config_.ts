import CONFIG from "./config.js"

function inferPathPrefix(pathname: string): string {
    if (!pathname || pathname === "/") {
        return ""
    }

    let normalizedPathname = pathname
    if (normalizedPathname.endsWith("/")) {
        normalizedPathname = normalizedPathname.slice(0, -1)
    }

    const lastSegment = normalizedPathname.substring(normalizedPathname.lastIndexOf("/") + 1)
    if (lastSegment.endsWith(".html")) {
        normalizedPathname = normalizedPathname.slice(0, normalizedPathname.lastIndexOf("/")) || "/"
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
