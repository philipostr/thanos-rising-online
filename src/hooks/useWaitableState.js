import { useState, useRef, useEffect, useCallback } from "react"

/* 
   Used to create a state with the following properties:
    - Has initial value of `initialVal`
    - None of the returned values (except `state`) will cause rerenders,
      and can be safely added to dependency lists without extra reruns/rerenders
    - Changes in value can be sequentially waited for in logic (await or .then)

   Returns: [
      state (like with useState),
      setState (like with useState),
      stateVal (ref with dependency-safe value of `state`),
      stateWait (returns promise that resolves when `state` is next changed)
   ]
*/
const useWaitableState = (initialVal) => {
    const [state, setState] = useState(initialVal)
    const stateVal = useRef(initialVal)
    const stateResolve = useRef(null)
    const stateWait = useCallback(() => {
        return new Promise((resolve) => stateResolve.current = resolve)
    }, [])

    useEffect(() => {
        stateVal.current = state
        if (stateResolve.current) {
            stateResolve.current()
            stateResolve.current = null
        }
    }, [state])

    return [state, setState, stateVal, stateWait]
}

export default useWaitableState
