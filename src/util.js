export const shuffleArray = (array) => {
    let arrayOut = [...array]
    for (let i = arrayOut.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = arrayOut[i]
        arrayOut[i] = arrayOut[j]
        arrayOut[j] = temp
    }
    return arrayOut
}

export const randFromArray = (array) => {
    return array[Math.floor((Math.random()*array.length))]
}
