// Política central de password partilhada por todos os formulários do admin.
// Espelha exatamente o que o backend valida em config/password_policy.php.

export const PASSWORD_REQUIREMENTS: ReadonlyArray<string> = [
  'Pelo menos 8 carateres',
  'Pelo menos uma letra maiúscula',
  'Pelo menos um número',
  'Pelo menos um carater especial',
];

/**
 * Devolve um array com os requisitos que a password ainda não cumpre.
 * Array vazio significa que a password é válida.
 */
export function getPasswordIssues(password: string): string[] {
  const issues: string[] = [];
  if (!password || password.length < 8) {
    issues.push('Pelo menos 8 carateres');
  }
  if (!/[A-Z]/.test(password)) {
    issues.push('Pelo menos uma letra maiúscula');
  }
  if (!/[0-9]/.test(password)) {
    issues.push('Pelo menos um número');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    issues.push('Pelo menos um carater especial');
  }
  return issues;
}

export function isPasswordStrong(password: string): boolean {
  return getPasswordIssues(password).length === 0;
}
