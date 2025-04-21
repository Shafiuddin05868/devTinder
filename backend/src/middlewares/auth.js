export const adminAuth = (req, res, next)=>{
    const key = '23'
    if (key !== '123'){
        res.status(401).send('unauthorized')
    }else{
        next()
    }
}

export const userAuth = (req, res, next)=>{
    const key = '13'
    if(key !== '123'){
        res.status(401).send('unauthorized')
    }else{
        next()
    }
}