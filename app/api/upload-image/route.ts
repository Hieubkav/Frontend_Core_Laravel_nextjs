"use server"

import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { promises as fs } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const sharp = (await import("sharp")).default
    const webpBuffer = await sharp(buffer).webp({ quality: 90 }).toBuffer()

    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadDir, { recursive: true })

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const filename = `${Date.now()}-${safeName}.webp`
    const filepath = path.join(uploadDir, filename)

    await fs.writeFile(filepath, webpBuffer)

    const url = `/uploads/${filename}`

    return NextResponse.json({ url, alt: file.name })
  } catch (error) {
    console.error("Upload failed", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
