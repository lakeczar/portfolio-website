/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root';
import { Route as TimelineImport } from './routes/timeline';
import { Route as AboutImport } from './routes/about';
import { Route as SplatImport } from './routes/$';
import { Route as IndexImport } from './routes/index';

// Create/Update Routes

const TimelineRoute = TimelineImport.update({
  id: '/timeline',
  path: '/timeline',
  getParentRoute: () => rootRoute,
} as any);

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any);

const SplatRoute = SplatImport.update({
  id: '/$',
  path: '/$',
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/';
      path: '/';
      fullPath: '/';
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    '/$': {
      id: '/$';
      path: '/$';
      fullPath: '/$';
      preLoaderRoute: typeof SplatImport;
      parentRoute: typeof rootRoute;
    };
    '/about': {
      id: '/about';
      path: '/about';
      fullPath: '/about';
      preLoaderRoute: typeof AboutImport;
      parentRoute: typeof rootRoute;
    };
    '/timeline': {
      id: '/timeline';
      path: '/timeline';
      fullPath: '/timeline';
      preLoaderRoute: typeof TimelineImport;
      parentRoute: typeof rootRoute;
    };
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute;
  '/$': typeof SplatRoute;
  '/about': typeof AboutRoute;
  '/timeline': typeof TimelineRoute;
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute;
  '/$': typeof SplatRoute;
  '/about': typeof AboutRoute;
  '/timeline': typeof TimelineRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  '/': typeof IndexRoute;
  '/$': typeof SplatRoute;
  '/about': typeof AboutRoute;
  '/timeline': typeof TimelineRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths: '/' | '/$' | '/about' | '/timeline';
  fileRoutesByTo: FileRoutesByTo;
  to: '/' | '/$' | '/about' | '/timeline';
  id: '__root__' | '/' | '/$' | '/about' | '/timeline';
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  SplatRoute: typeof SplatRoute;
  AboutRoute: typeof AboutRoute;
  TimelineRoute: typeof TimelineRoute;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  SplatRoute: SplatRoute,
  AboutRoute: AboutRoute,
  TimelineRoute: TimelineRoute,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/$",
        "/about",
        "/timeline"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/$": {
      "filePath": "$.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/timeline": {
      "filePath": "timeline.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
