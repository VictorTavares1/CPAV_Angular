/**
 * Ambiente de PRODUÇÃO.
 * Usado automaticamente por `ng build` (sem flags) ou `ng build --configuration production`.
 *
 * Para desenvolvimento local, o ficheiro environment.development.ts é
 * substituído automaticamente via fileReplacements no angular.json.
 */
export const environment = {
  production: true,
  apiBaseUrl: 'https://cspslalhosvedros.pt/CPAV_api/api',
  uploadsBaseUrl: 'https://cspslalhosvedros.pt/CPAV_api/uploads',
};
