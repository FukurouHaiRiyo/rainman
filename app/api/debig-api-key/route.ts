import { NextResponse } from "next/server"

export async function GET() {
  try {
    const base64Key = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64
    const directKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY

    const debugInfo: any = {
      hasBase64Key: !!base64Key,
      hasDirectKey: !!directKey,
      base64KeyLength: base64Key?.length || 0,
      directKeyLength: directKey?.length || 0,
    }

    if (base64Key) {
      try {
        const decoded = Buffer.from(base64Key, "base64").toString("utf8")
        debugInfo.decodedKeyLength = decoded.length
        debugInfo.decodedKeyPreview = decoded.substring(0, 100) + "..."
        debugInfo.hasBeginMarker = decoded.includes("-----BEGIN PRIVATE KEY-----")
        debugInfo.hasEndMarker = decoded.includes("-----END PRIVATE KEY-----")
        debugInfo.lineCount = decoded.split("\n").length
      } catch (error) {
        debugInfo.base64DecodeError = (error instanceof Error) ? error.message : String(error);
      }
    }

    if (directKey) {
      debugInfo.directKeyPreview = directKey.substring(0, 100) + "..."
      debugInfo.directHasBeginMarker = directKey.includes("-----BEGIN PRIVATE KEY-----")
      debugInfo.directHasEndMarker = directKey.includes("-----END PRIVATE KEY-----")
    }

    return NextResponse.json(debugInfo)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug failed",
        message: (error instanceof Error) ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
