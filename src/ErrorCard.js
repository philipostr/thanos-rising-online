import { useEffect, useRef } from 'react'
import './ErrorCard.css'

const ErrorCard = ({ errMessage }) => {
    const card = useRef(null)

    useEffect(() => {
        if (errMessage === '') {
            card.current.style.display = 'none'
        } else {
            card.current.style.display = 'block'
        }
    }, [errMessage])

    return (
        <div id='errorCard' ref={card}>
            <div id='leftThing'></div>
            <p>{errMessage}</p>
        </div>
    )
}

export default ErrorCard
