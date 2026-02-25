import { list } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

// Cache files list for 5 minutes to reduce API calls
const CACHE_DURATION = 5 * 60 * 1000
let cachedFiles: any = null
let cacheTime = 0

export async function GET(request: NextRequest) {
  try {
    // Add cache headers
    const now = Date.now()
    if (cachedFiles && now - cacheTime < CACHE_DURATION) {
      return NextResponse.json({ files: cachedFiles }, {
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=300",
        },
      })
    }

    const { blobs } = await list({
      prefix: "dashboards/",
    })

    const files = blobs
      .map((blob) => {
        const pathname = blob.pathname
        return {
          id: blob.pathname, // Use pathname as unique identifier
          url: blob.url,
          filename: extractFileName(pathname),
          size: formatFileSize(blob.size),
          sizeBytes: blob.size,
          uploadedAt: blob.uploadedAt,
          type: getFileType(pathname),
        }
      })
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    // Update cache
    cachedFiles = files
    cacheTime = now

    return NextResponse.json({ files }, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error listing files:", (error as Error).message)
    }
    
    return NextResponse.json(
      { error: "Failed to list files", files: [] },
      { status: 500 }
    )
  }
}

function extractFileName(pathname: string): string {
  const parts = pathname.split("/")
  const filename = parts[parts.length - 1]
  
  // Remove hash prefix (format: hash-filename.ext)
  const cleaned = filename.replace(/^[a-f0-9]+-/, "")
  return cleaned || "unknown"
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`
}

function getFileType(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase()
  const typeMap: Record<string, string> = {
    pbix: "Power BI",
    twbx: "Tableau",
    pdf: "PDF",
    png: "Image",
    jpg: "Image",
    jpeg: "Image",
    pptx: "PowerPoint",
    xlsx: "Excel",
    csv: "CSV",
  }
  
  return typeMap[extension || ""] || "Document"
}
