export const env = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigins: (process.env.CORS_ORIGINS ?? "").split(",").filter(Boolean),
};