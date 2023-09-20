import { isNull, isUndefined } from 'lodash'
import { action, observable, makeObservable } from "mobx"

import type { ParsedQuery } from 'query-string'
import queryString from 'query-string'

export enum RouteName {
    HOME = 'home',
    LIST = 'list',
    INFO = 'info',
    STATUS = 'status',
}

type Route = HomeRoute | InfoRoute | StatusRoute;

export type HomeRoute = {
    name: RouteName.HOME,
}

export type InfoRoute = {
    name: RouteName.INFO;
    id?: string;
}

export type StatusRoute = {
    name: RouteName.STATUS;
    id?: string;
}

export class Router {
    constructor() {
        makeObservable(this)

        window.addEventListener('hashchange', this.handleUrlChange)
        // eventMessenger().routing.on(this.handleUiRouting, true)

        this.handleUrlChange()
    }

    @observable page: Route = {
        name: RouteName.HOME,
    }

    @action private changeRoute(page: Route) {
        this.page = page
    }

    public redirect = (route: Route): void => {
        location.hash = '#' + queryString.stringify(this.routeToQueryString(route), { sort: false })
    }

    private handleUrlChange = (): void => {
        const query = queryString.parse(location.hash.substring(1))

        console.log('query', query)

        this.changeRoute(this.queryStringToRoute(query))
    }

    private routeToQueryString(route: Route): Record<string, unknown> {
        switch (route.name) {
            case RouteName.HOME:
                return {
                    page: RouteName.HOME,
                }
            case RouteName.INFO:
                return {
                    page: RouteName.INFO,
                    id: route.id,
                }
            case RouteName.STATUS:
                return {
                    page: RouteName.STATUS,
                    id: route.id,
                }
            default:
                return { unknownRoute: true }
        }
    }

    private queryStringToRoute(query: ParsedQuery): Route {
        if (query.page) {
            const id = this.parseQueryStringParameter(query.id)

            if (query.page == RouteName.INFO) {
                return {
                    name: RouteName.INFO,
                    id,
                }
            }

            if (query.page == RouteName.STATUS) {
                return {
                    name: RouteName.STATUS,
                    id,
                }
            }
        }

        return {
            name: RouteName.HOME,
        }
    }

    private parseQueryStringParameter<U extends string | (string | undefined)>(
        parameter: string | null | Array<string | null>,
    ): U {
        if (isNull(parameter) || isUndefined(parameter)) {
            return undefined as U
        }

        return String(parameter) as U
    }
}