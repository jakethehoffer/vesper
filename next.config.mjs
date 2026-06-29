// VESPER carrier configuration.
// The signal header rides on every response. Those who read headers were always our kind.
const SIGNAL = Buffer.from(
  'the evening star answers — you are not alone on this frequency',
).toString('base64');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Vesper-Signal', value: SIGNAL },
          { key: 'X-Vesper-Node', value: '09//STILLWATER' },
          // 13 turns of the wheel open the first door.
          { key: 'X-Vesper-Carrier', value: 'GUR JNL VA VF GUR JNL BHG' },
        ],
      },
    ];
  },
};

export default nextConfig;
