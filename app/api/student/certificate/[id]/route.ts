import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient()

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url: string): string | null => {
    try {
        // handle both image and raw (PDF) URLs
        // example: https://res.cloudinary.com/xxx/image/upload/v123/folder/filename.jpg
        // example: https://res.cloudinary.com/xxx/raw/upload/v123/folder/filename.pdf
        const regex = /\/(?:image|raw)\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch {
        return null;
    }
};

const deleteFromCloudinary = async (url: string): Promise<boolean> => {
    const publicId = getPublicIdFromUrl(url);
    if (!publicId) return false;

    try {
        const resourceType = url.includes('/raw/') ? 'raw' : 'image';
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        return true;
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        return false;
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const session = await auth()

    if (!session || session.user.role !== "student") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { id } = await params

        const certificate = await prisma.certificate.findUnique({
            where: { id },
        })

        if (!certificate) {
            return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
        }

        if (certificate.studentId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        if (certificate.certificateUrl) {
            await deleteFromCloudinary(certificate.certificateUrl)
        }

        await prisma.certificate.delete({
            where: { id },
        })

        return NextResponse.json({ message: "Certificate deleted successfully" })
    } catch (error) {
        console.error("Delete certificate error:", error)
        return NextResponse.json({ error: "Failed to delete certificate" }, { status: 500 })
    }
}
