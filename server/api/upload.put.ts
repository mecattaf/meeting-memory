export default defineEventHandler(async (event) => {
  const { cloudflare } = event.context;

  const form = await readFormData(event);
  const files = form.getAll('files') as File[];
  if (!files) {
    throw createError({ statusCode: 400, message: 'Missing files' });
  }

  const objs: R2Object[] = [];
  for (const file of files) {
    const obj = await cloudflare.env.R2.put(`recordings/${file.name}`, file);
    if (obj) {
      objs.push(obj);
    }
  }

  return objs;
});
