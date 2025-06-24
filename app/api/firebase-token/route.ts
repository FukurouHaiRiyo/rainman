import { NextRequest, NextResponse } from "next/server";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    console.log("🔥 Firebase token API called");

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ Missing or invalid Authorization header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionToken = authHeader.replace("Bearer ", "").trim();

    const { userId } = getAuth(req);

    if (!userId) {
      console.log("❌ Invalid Clerk session token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ Clerk User ID:", userId);

    const { initializeFirebaseAdmin, admin } = await import("@/app/lib/firebase-admin");
    initializeFirebaseAdmin();

    const clerk = await clerkClient();
    const userData = await clerk.users.getUser(userId);

    console.log("✅ Clerk User Data fetched");

    const role = userData.publicMetadata?.role || "guest";
    console.log("✅ Resolved Role:", role);

    const token = await admin.auth().createCustomToken(userId, {
      role,
      email: userData.emailAddresses?.[0]?.emailAddress,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });

    console.log("✅ Firebase Custom Token created");
    return NextResponse.json({ token });
  } catch (error: any) {
    console.error("🔥 Error in Firebase token API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
