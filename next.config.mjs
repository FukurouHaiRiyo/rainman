/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        domains: ['eu.ui-avatars.com']
    },

    experimental: {
        appDir: true,
    }
};

export default nextConfig;
