export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
};

export const getJwtExpiresIn = () => process.env.JWT_EXPIRES_IN ?? '7d';

export const validateJwtEnv = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET is missing. Set JWT_SECRET to start the API.');
    process.exit(1);
  }

  if (!process.env.JWT_EXPIRES_IN) {
    console.warn('JWT_EXPIRES_IN is not set. Using default: 7d.');
  }
};
