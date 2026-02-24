import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const password = formData.get("password") as string

    console.log("[v0] Received password:", password)
    console.log("[v0] Expected password: aditya2025")

    // Simple password protection - trim whitespace and make case-insensitive
    const expectedPassword = "aditya2025"
    if (!password || password.trim().toLowerCase() !== expectedPassword.toLowerCase()) {
      console.log("[v0] Password mismatch")
      return NextResponse.json({ error: "Invalid password. Use: aditya2025" }, { status: 401 })
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file type
    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    const allowedExtensions = ["pdf", "pbix", "twbx", "png", "jpg", "jpeg", "pptx", "xlsx"]

    if (!allowedExtensions.includes(fileExtension || "")) {
      return NextResponse.json(
        { error: `File type .${fileExtension} not allowed. Allowed: ${allowedExtensions.join(", ")}` },
        { status: 400 },
      )
    }

    // Upload to Vercel Blob with organized folder structure
    const timestamp = new Date().toISOString().split("T")[0]
    const fileName = `dashboards/${timestamp}-${file.name}`

    console.log("[v0] Uploading file:", fileName)

    const blob = await put(fileName, file, {
      access: "public",
    })

    console.log("[v0] Upload successful:", blob.url)

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed: " + (error as Error).message }, { status: 500 })
  }
}
