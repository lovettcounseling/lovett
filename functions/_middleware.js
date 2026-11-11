/**
 * Sends anyone who lands on the default Pages address (lovett-8hj.pages.dev)
 * to the real domain with a permanent redirect, so search engines index one
 * copy of the site instead of two. Branch previews
 * (<branch>.lovett-8hj.pages.dev) are left alone.
 */
const PAGES_HOST = 'lovett-8hj.pages.dev';
const CANONICAL = 'https://lovettcounselingandconsulting.com';

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === PAGES_HOST) {
    return Response.redirect(CANONICAL + url.pathname + url.search, 301);
  }
  return next();
}
