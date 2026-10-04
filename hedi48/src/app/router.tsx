// Hedi Life route map
export const hediRoutes = [
  '/login',
  '/dashboard',
  '/journal',
  '/thesis',
  '/studio',
  '/journey',
  '/wellness',
  '/hedi'
] as const;

export type HediRoute = typeof hediRoutes[number];

export function isValidRoute(path: string): path is HediRoute {
  return hediRoutes.includes(path as HediRoute);
}
