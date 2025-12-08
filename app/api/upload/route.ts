import { v2 as cloudinary } from 'cloudinary'
import { NextRequest, NextResponse } from "next/server"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File
        const folder = formData.get('folder') as string || 'uploads'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // convert file to base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

        const isPdf = file.type === 'application/pdf'
        const resourceType = isPdf ? 'raw' : 'auto'

        const result = await cloudinary.uploader.upload(base64, {
            folder: folder,
            resource_type: resourceType,
        })

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
        })
    } catch (err) {
        console.error('Cloudinary upload error:', err)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}

export const deleteFromCloudinary = async (publicIds: string | string[], resourceType: 'image' | 'raw' | 'video' = 'raw'): Promise<{
    success: boolean;
    deleted?: string[];
    error?: string;
}> => {
    try {
        const ids = typeof publicIds === 'string' ? [publicIds] : publicIds

        if (ids.length === 0) {
            return { success: true, deleted: [] }
        }

        const results = await Promise.all(
            ids.map(id => cloudinary.uploader.destroy(id, { resource_type: resourceType }))
        )

        const deleted = ids.filter((_, index) => results[index].result === 'ok')

        return { success: true, deleted }
    } catch (err: any) {
        console.error('Cloudinary delete error:', err)
        return { success: false, error: err.message || 'Unknown error during delete' }
    }
}

// helper to extract public_id from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string | null => {
    try {
        // Cloudinary URLs look like: 
        // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{ext}
        const regex = /\/(?:image|raw|video)\/upload\/(?:v\d+\/)?(.+)$/
        const match = url.match(regex)
        if (match) {
            // remove the file extension for the public_id
            const pathWithExt = match[1]
            const lastDotIndex = pathWithExt.lastIndexOf('.')
            return lastDotIndex > 0 ? pathWithExt.substring(0, lastDotIndex) : pathWithExt
        }
        return null
    } catch {
        return null
    }
}