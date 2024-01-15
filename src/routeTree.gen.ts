import { Route as rootRoute } from './routes/__root'
import { Route as ProjectsImport } from './routes/projects'
import { Route as ContactImport } from './routes/contact'
import { Route as IndexImport } from './routes/index'

const ProjectsRoute = ProjectsImport.update({
  path: '/projects',
  getParentRoute: () => rootRoute,
} as any)

const ContactRoute = ContactImport.update({
  path: '/contact',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/contact': {
      preLoaderRoute: typeof ContactImport
      parentRoute: typeof rootRoute
    }
    '/projects': {
      preLoaderRoute: typeof ProjectsImport
      parentRoute: typeof rootRoute
    }
  }
}
export const routeTree = rootRoute.addChildren([
  IndexRoute,
  ContactRoute,
  ProjectsRoute,
])
