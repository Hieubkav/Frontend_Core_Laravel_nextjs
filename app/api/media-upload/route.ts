import { NextResponse } from 'next/server';
import sharp from 'sharp';

const RAW_BACKEND_API =
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://127.0.0.1:8000/api/v1';
// Tránh lỗi khi backend chỉ bind IPv4 mà localhost resolve IPv6 (::1)
const BACKEND_API = RAW_BACKEND_API.replace('localhost', '127.0.0.1');

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const form = await request.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: 'File is required' },
        { status: 422 },
      );
    }

    const isImage = (file.type || '').startsWith('image/');
    let outputBuffer: Uint8Array;
    let outputType = file.type;
    let outputName = file.name;

    const inputBuffer = new Uint8Array(await file.arrayBuffer());

    if (isImage && file.type !== 'image/svg+xml') {
      try {
        const converted = await sharp(inputBuffer).webp({ quality: 82 }).toBuffer();
        outputBuffer = new Uint8Array(converted);
        outputType = 'image/webp';
        const baseName = file.name.replace(/\.[^.]+$/, '');
        outputName = `${baseName}.webp`;
      } catch (err) {
        console.warn('Sharp convert failed, fallback to original', err);
        outputBuffer = inputBuffer;
      }
    } else {
      outputBuffer = inputBuffer;
    }

    // Build multipart payload to backend
    const payload = new FormData();
    const arrayBuffer = new ArrayBuffer(outputBuffer.byteLength);
    new Uint8Array(arrayBuffer).set(outputBuffer);
    payload.append('file', new Blob([arrayBuffer], { type: outputType }), outputName);

    // forward optional fields
    const forwardFields = ['name', 'title', 'alt', 'collection_name'];
    forwardFields.forEach((key) => {
      const val = form.get(key);
      if (typeof val === 'string' && val.trim() !== '') {
        payload.append(key, val);
      }
    });

    const targetUrl = `${BACKEND_API}/media`;
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
      },
      body: payload,
    });

    const data = await res.json();

    if (!res.ok) {
      // Log chi tiết để theo dõi trên Vercel dev logs
      console.error('[media-upload] Backend error', {
        targetUrl,
        status: res.status,
        statusText: res.statusText,
        message: data?.message,
        errors: data?.errors,
      });

      return NextResponse.json(
        {
          success: false,
          message: data?.message || 'Backend từ chối upload',
          errors: data?.errors,
        },
        { status: res.status || 500 },
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('Upload via sharp failed', {
      message: error?.message,
      cause: error?.cause,
      stack: error?.stack,
      backend: BACKEND_API,
    });
    return NextResponse.json(
      { success: false, message: 'Media upload failed', error: error?.message },
      { status: 500 },
    );
  }
}
