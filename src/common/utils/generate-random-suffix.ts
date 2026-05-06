export function generateRandomSuffix(): string {
  return Math.random().toString(36).substring(2, 8); // Gera uma string aleatória de 6 caracteres
}
