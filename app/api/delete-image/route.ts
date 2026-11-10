import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req: Request) {
  const { getRequestSession } = await import("@/lib/auth-guards");
  const session = await getRequestSession(req);
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  if ((session.user.role ?? "user") !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const { public_id, resource_type } = await req.json();

    if (!public_id) {
      return NextResponse.json(
        { error: "public_id required" },
        { status: 400 },
      );
    }

    const primaryType = resource_type || "image";
    let result = await cloudinary.uploader.destroy(public_id, {
      resource_type: primaryType,
      invalidate: true,
    });

    // If Cloudinary didn't delete it under primaryType, try the other resource_type (raw vs image)
    if (result?.result !== "ok") {
      const fallbackType = primaryType === "raw" ? "image" : "raw";
      result = await cloudinary.uploader.destroy(public_id, {
        resource_type: fallbackType,
        invalidate: true,
      });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 },
    );
  }
}
