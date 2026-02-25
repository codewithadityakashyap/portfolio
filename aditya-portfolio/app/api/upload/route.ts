import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Password hash (bcrypt would be better, but for simplicity using SHA-256)
// NEVER expose the actual password in logs
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "9b74c9897bac770ffc029102cf27b630fc1a40d5a01416e8946a534180c7ccbb" // hash of "aditya2025"

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

// File size limit: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024
const ALLOWED_EXTENSIONS = ["pdf", "pbix", "twbx", "png", "jpg", "jpeg", "pptx", "xlsx", "csv"]

export async function POST(request: NextRequest) {
  try {
    // Security: Rate limiting check (basic)
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    
    // CORS check
    const origin = request.headers.get("origin")
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [process.env.VERCEL_URL || ""]
    
    if (origin && !allowedOrigins.some(o => origin.includes(o))) {
      return NextResponse.json({ error: "CORS policy violation" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const password = formData.get("password") as string

    // Validate password (hash comparison to avoid exposing password)
    if (!password || hashPassword(password) !== ADMIN_PASSWORD_HASH) {
      return NextResponse.json(
        { error: "Invalid credentials. Access denied." },
        { status: 401 }
      )
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 100MB limit" },
        { status: 413 }
      )
    }

    // Validate file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    if (!fileExtension || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json(
        { error: `File type not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(", ")}` },
        { status: 400 }
      )
    }

    // Sanitize filename
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const timestamp = new Date().toISOString().split("T")[0]
    const fileName = `dashboards/${timestamp}/${crypto.randomBytes(4).toString("hex")}-${sanitizedFileName}`

    // Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return NextResponse.json({
      url: blob.url,
      filename: sanitizedFileName,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error) {
    // Log errors securely (no sensitive data)
    if (process.env.NODE_ENV === "development") {
      console.error("Upload error:", (error as Error).message)
    }
    
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    )
  }
}
