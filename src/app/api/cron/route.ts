
// This file can be used for future Cloud Function logic deployed via Next.js routes.
// The previous Realtime Database trigger has been removed.

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Cron job endpoint.' });
}
