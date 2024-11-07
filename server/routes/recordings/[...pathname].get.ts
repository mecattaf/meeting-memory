export default defineEventHandler(async (event) => {
  const { cloudflare, params } = event.context;

  const { pathname } = params || {};

  return cloudflare.env.R2.get(`recordings/${pathname}`);
});
