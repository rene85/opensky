import { useEffect, useState } from 'react'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'
import { axiosGet } from './wrap/axios'

function App() {
    useEffect(() => {
        let ignore = false
        const controller = new AbortController()
        const aff = async () => {
            const response = await axiosGet(
                'https://opensky-network.org/api/states/all',
                { signal: controller.signal }
            )
            if (!ignore) console.dir(response)
        }
        aff().catch((err) => {
            // TODO: only ignore cancellation errors (if applicable)
            if (!ignore) console.error(err)
        })
        return () => {
            ignore = true
            controller.abort()
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
