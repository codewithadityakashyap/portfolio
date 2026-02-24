import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: "dashboards/",
    })

    const files = blobs
      .map((blob) => ({
        url: blob.url,
        filename: blob.pathname.split("/").pop() || "unknown",
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        type: getFileType(blob.pathname),
      }))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}

function getFileType(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase()
  switch (extension) {
    case "pbix":
      return "Power BI"
    case "twbx":
      return "Tableau"
    case "pdf":
      return "PDF"
    case "png":
    case "jpg":
    case "jpeg":
      return "Image"
    case "pptx":
      return "PowerPoint"
    case "xlsx":
      return "Excel"
    default:
      return "Document"
  }
}
