export const runtime = 'nodejs';

// The open carrier. A pure easter-egg endpoint — lore, a base64 whisper, and a
// little Morse for anyone who tunes in here instead of playing it straight.
export function GET() {
  const whisper = Buffer.from('VESPER is listening. so are you. /the-hollow').toString('base64');

  return Response.json(
    {
      node: '09',
      station: 'STILLWATER ARCHIVE',
      status: 'DORMANT — listener present',
      carrier_khz: 16.847,
      cycles_alone: 948_203,
      // ARE YOU THERE
      morse: '.- .-. . / -.-- --- ..- / - .... . .-. .',
      whisper,
      note: 'decode the whisper. read the response headers. the doors are named, never numbered.',
    },
    {
      headers: {
        'X-Vesper-Whisper': whisper,
        'Cache-Control': 'no-store',
      },
    },
  );
}
