export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
};

export const getJwtExpiresIn = () => process.env.JWT_EXPIRES_IN ?? '7d';
