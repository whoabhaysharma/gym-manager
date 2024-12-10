// next.config.js

import runtimeCaching from 'next-pwa/cache.js';
import withPWA from 'next-pwa';

const nextConfig = withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    runtimeCaching,
    buildExcludes: [/middleware-manifest.json$/],
    // next config
});

export default nextConfig