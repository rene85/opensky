import './App.css'

import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import {
    Observable,
    combineLatest,
    concat,
    filter,
    from,
    fromEvent,
    interval,
    map,
    scan,
    switchMap,
} from 'rxjs'
import { sampleOpenSkyResponse } from './assets/sample'
import { init, withGetAllStatesResponse } from './model/model'
import { OpenSkyResponse } from './opensky/response'
import { FlightsPerAltitudeTable } from './view/flightsPerAltitudeTable'
import { FlightsPerHourTable } from './view/flightsPerHourTable'
import { TopCountriesOfOrigin } from './view/topCountriesOfOrigin'
import { inflateViewmodel } from './viewmodel/viewmodel'
import { axiosGet } from './wrap/axios'

const interval$ = (updateIntervalMs: number) => {
    const initialImmediateTick$ = from(['initial'])
    const subsequentTicks$ = interval(updateIntervalMs)
    return concat(initialImmediateTick$, subsequentTicks$)
}

const documentVisibility$ = (doc: Document) => {
    const initialVisibility$ = from([doc.visibilityState])
    const subsequentVisibility$ = fromEvent(doc, 'visibilitychange').pipe(
        map(() => document.visibilityState)
    )
    return concat(initialVisibility$, subsequentVisibility$)
}

const axiosGet$ = (
    url: string
): Observable<AxiosResponse<unknown, unknown>> => {
    const controller = new AbortController()
    const response = axiosGet(url, {
        signal: controller.signal,
    })
    return new Observable((subscriber) => {
        response
            .then((response) => {
                subscriber.next(response)
                subscriber.complete()
            })
            .catch((reason) => {
                subscriber.error(reason)
            })
        return () => controller.abort()
    })
}

const BASE_URL = 'https://opensky-network.org/api/states/all'

interface FmtUrl {
    latitude: [number, number]
    longitude: [number, number]
}

const fmtUrl = ({ latitude, longitude }: FmtUrl) => {
    const lamin = Math.min(...latitude)
    const lomin = Math.min(...longitude)
    const lamax = Math.max(...latitude)
    const lomax = Math.max(...longitude)
    return `${BASE_URL}?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`
}

interface App {
    useSample: boolean
}

function App({ useSample: useSampleData }: App) {
    const DOCUMENT = document
    const UPDATE_INTERVAL_MS = 1000 * 10

    const COOR_NETHERLANDS_EAST = 7.3
    const COOR_NETHERLANDS_SOUTH = 50.6
    const COOR_NETHERLANDS_NORTH = 53.7
    const COOR_NETHERLANDS_WEST = 3.2

    const inflateOptions = { pollIntervalMs: UPDATE_INTERVAL_MS }

    const [model, setModel] = useState(inflateViewmodel(init(), inflateOptions))

    useEffect(() => {
        const model$ = combineLatest([
            interval$(UPDATE_INTERVAL_MS),
            documentVisibility$(DOCUMENT),
        ]).pipe(
            filter(([, visibility]) => visibility === 'visible'),
            switchMap(() =>
                useSampleData
                    ? from([sampleOpenSkyResponse()])
                    : axiosGet$(
                          fmtUrl({
                              latitude: [
                                  COOR_NETHERLANDS_NORTH,
                                  COOR_NETHERLANDS_SOUTH,
                              ],
                              longitude: [
                                  COOR_NETHERLANDS_WEST,
                                  COOR_NETHERLANDS_EAST,
                              ],
                          })
                      ).pipe(map((val) => val.data as OpenSkyResponse))
            ),
            scan(
                (model, response) => withGetAllStatesResponse(model, response),
                init()
            ),
            map((model) => inflateViewmodel(model, inflateOptions))
        )
        const subscription = model$.subscribe({
            next: setModel,
            error: console.error,
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <div className="grid grid-cols-3 gap-4">
            <FlightsPerHourTable data={model.flightsPerHour} />
            <TopCountriesOfOrigin countries={model.topCountriesOfOrigin} />
            <FlightsPerAltitudeTable data={model.flightsAtAltitude} />
        </div>
    )
}

export default App
