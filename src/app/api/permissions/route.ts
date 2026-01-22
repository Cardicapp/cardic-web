import { getPermissions } from '@/lib/serverProps';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Example: Fetch data
  const data = await getPermissions();
  return NextResponse.json(data, { status: 200 });
}