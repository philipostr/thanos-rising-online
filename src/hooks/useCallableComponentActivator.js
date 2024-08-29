import { useCallback, useState } from "react"

/* 
   Used to make the activation and calling of a callable component
   more streamlined.

   A callable component is a component that appears when some user input is
   required, then disappears and returns an output from the interaction.
   For example, when a selection must be made and used.
   Can use the returned args `returnedArgs` like so:
   <RandomParentComponents>
       {returnedArgs &&
           <CallableComponent args={returnedArgs} />
       }
   </RandomParentComponents>
   The callable component must use its `args.returner` prop, which is set by
   the returned activator function, to return the desired output and trigger
   its disappearance.

   Returns: [
      activator (functional proxy for the component. Makes the component's use 
      simple, as it can be called like any other async function),
      args (`null` when the component should disappear, otherwise contains the
      arguments for the component)
   ]
*/
const useCallableComponentActivator = () => {
    const [args, setArgs] = useState(null)

    const activator = useCallback(async (args) => {
        const promise = new Promise((resolve) => args.returner = resolve)
        setArgs(args)
        const selection = await promise
        setArgs(null)
        return selection
    }, [])

    return [args, activator]
}

export default useCallableComponentActivator
