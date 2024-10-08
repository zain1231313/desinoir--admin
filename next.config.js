/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/home/teamMember/**',
            },
            {
                protocol: 'https',
                hostname: 'api.desinoir.com',
                port: '',
                pathname: '/**', // Define the path where the images are hosted
            },
        ],
    },
};
module.exports = {
    images: {
        domains: ['localhost', 'desinoir.com', 'api.desinoir.com'], // Add 'localhost' to the list of allowed domains
    },
};

//   const webpack = require('webpack');

// module.exports = {
//   webpack: (config) => {
//     config.plugins.push(
//       new webpack.ProvidePlugin({
//         $: 'jquery',
//         jQuery: 'jquery',
//       })
//     );
//     return config;
//   },
// };
