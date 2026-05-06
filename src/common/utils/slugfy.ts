export function slugfy(text: string): string {
  return text
    .normalize('NFKD') // Separa acentos de letas. Ex: "á" vira "a" + "´"
    .toLocaleLowerCase() // Converte para minúsculas
    .replace(/[\u0300-\u036f]/g, '') // Remove os acentos (marcadores Unicode)
    .replace(/[^a-z0-9]+/g, ' ') // Troca tudo que não for letra ou número por espaço
    .trim() // Remove espaços no início e no fim
    .replace(/\s+/g, '-'); // Substitui espaços por hífens
}
