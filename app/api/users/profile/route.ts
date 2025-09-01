import { type NextRequest, NextResponse } from "next/server"
import { getServerCurrentUser } from "@/lib/auth-server"
import { db } from "@/lib/firebase-admin"
import { z } from "zod"

const profileSchema = z.object({
  displayName: z.string().min(3, "Display name must be at least 3 characters long").max(50),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
  favoriteSports: z.array(z.string()).max(5, "You can select up to 5 favorite sports").optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getServerCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = profileSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.flatten().fieldErrors }, { status: 400 })
    }

    const { displayName, bio, favoriteSports } = validationResult.data

    const userRef = db.collection("users").doc(user.uid)
    await userRef.update({
      displayName,
      bio: bio || "",
      favoriteSports: favoriteSports || [],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating profile:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
