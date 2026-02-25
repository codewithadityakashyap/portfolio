import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Password hash (same as upload route)
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "9b74c9897bac770ffc029102cf27b630fc1a40d5a01416e8946a534180c7ccbb"

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export async function DELETE(request: NextRequest) {
  try {
    const { url, password } = await request.json()

    // Validate password
    if (!password || hashPassword(password) !== ADMIN_PASSWORD_HASH) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL provided" }, { status: 400 })
    }

    // Validate URL belongs to blob storage (security check)
    if (!url.includes("blob.vercelusercontent.com")) {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 403 })
    }

    // Delete from Vercel Blob
    await del(url)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Delete error:", (error as Error).message)
    }
    
    return NextResponse.json(
      { error: "Delete operation failed" },
      { status: 500 }
    )
  }
}
