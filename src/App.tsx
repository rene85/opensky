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
    switchMap,
} from 'rxjs'
import { sampleOpenSkyResponse } from './sample'
import { axiosGet } from './wrap/axios'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'

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

const axiosGet$ = (url: string) => {
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

    useEffect(() => {
        const tick$ = combineLatest([
            interval$(UPDATE_INTERVAL_MS),
            documentVisibility$(DOCUMENT),
        ]).pipe(
            filter(([, visibility]) => visibility === 'visible'),
            switchMap(() =>
                useSampleData
                    ? from([sampleOpenSkyResponse()])
                    : axiosGet$('https://opensky-network.org/api/states/all')
            )
        )
        const subscription = tick$.subscribe({
            next: console.log,
            error: console.error,
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const [count, setCount] = useState(0)

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
