import { useState, useEffect } from 'react'

const useDelay = (ms: number, cb: Function) => {
    const [delay, setDelay] = useState<boolean>(false)

    useEffect(() => {
        if (!delay) return
        setTimeout(() => setDelay(false), ms)
    }, [delay])

    const activate = () => {
        setDelay(true)
    }

    return { delay, activate }
}

export default useDelay