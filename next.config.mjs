import { env } from "./src/env/server.mjs";
import withBundleAnalyzer from "@next/bundle-analyzer";
/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */

function defineNextConfig(config) {
	return config;
}

const analyzer = withBundleAnalyzer({
	enabled: env.ANALYZE === "true",
	openAnalyzer: false,
});

// find-unused-exports:ignore-next-line-exports
export default analyzer(
	defineNextConfig({
		reactStrictMode: true,
		swcMinify: true,
		images: {
			domains: ["lh3.googleusercontent.com", "cdn.pixabay.com", "res.cloudinary.com", "s.gravatar.com"],
		},
	})
);
