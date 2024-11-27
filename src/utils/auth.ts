export const ADMIN_PASSWORD = 'ub2015';

export const verifyPassword = (password: string): boolean => {
  return password === ADMIN_PASSWORD;
};

export const requirePassword = async (): Promise<boolean> => {
  const password = prompt('Por favor, ingrese la contraseña para continuar:');
  return password ? verifyPassword(password) : false;
};