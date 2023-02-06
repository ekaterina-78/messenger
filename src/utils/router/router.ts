import { Block } from '../base-components/block';
import { Observable, TListener } from '../../services/observable';
import { IVirtualDomProps } from '../template/template-types';
import { getPathWithoutTrailingSlash } from '../const-variables/pages';

export const PATH_CHANGE = 'path_change';

export interface IRouteInfo {
  path: string;
  pathRegExp: RegExp;
  component: { new (): Block<unknown, unknown> };
  props: IVirtualDomProps;
}

const getRegExpForPath = (path: string): RegExp =>
  new RegExp('^' + path.replace(/:[^\s/]+/g, '([\\w-]+)') + '$');

export class Router extends Observable {
  listeners: { PATH_CHANGE: Array<TListener> };
  private static __instance: Router;
  private _currentPath: string;
  routes: Array<IRouteInfo>;
  history: History;

  private constructor() {
    super({ PATH_CHANGE: [] });
    this._currentPath = window.location.pathname;
    this.routes = [];
    this.history = window.history;
  }

  public static getInstance() {
    return this.__instance || (this.__instance = new this());
  }

  use(
    pathname: string,
    component: { new (): Block<unknown, unknown> },
    props: IVirtualDomProps
  ): Router {
    this.routes.push({
      path: pathname,
      pathRegExp: getRegExpForPath(pathname),
      component,
      props,
    });
    return this;
  }

  start() {
    window.onpopstate = event => {
      const path = event.currentTarget.location.pathname;
      if (this._currentPath !== path) {
        this._onRoute(path);
      }
    };
  }

  _onRoute(pathname: string) {
    this._currentPath = pathname;
    this.emit(PATH_CHANGE);
  }

  go(pathname: string) {
    if (this._currentPath !== pathname) {
      this.history.pushState({}, '', pathname);
      this._onRoute(pathname);
    }
  }

  replace(pathname: string) {
    if (this._currentPath !== pathname) {
      this.history.replaceState({}, '', pathname);
      this._onRoute(pathname);
    }
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  getRouteInfo(pathname: string): IRouteInfo | undefined {
    return this.routes.find(route =>
      route.pathRegExp.test(getPathWithoutTrailingSlash(pathname))
    );
  }
}
