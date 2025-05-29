import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const stations = await prisma.station.findMany();
  return NextResponse.json(stations);
}
