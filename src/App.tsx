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
import { FlightsPerHourTable } from './view/flightsPerHourTable'
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

interface App {
    useSample: boolean
}

function App({ useSample: useSampleData }: App) {
    const DOCUMENT = document
    const UPDATE_INTERVAL_MS = 1000 * 10

    const [model, setModel] = useState(inflateViewmodel(init()))

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
                          'https://opensky-network.org/api/states/all'
                      ).pipe(map((val) => val.data as OpenSkyResponse))
            ),
            scan(
                (model, response) => withGetAllStatesResponse(model, response),
                init()
            ),
            map(inflateViewmodel)
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
        <>
            <FlightsPerHourTable data={model.flightsPerHour} />
        </>
    )
}

export default App
