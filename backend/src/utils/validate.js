import validator from 'validator'

export const validate = (req)=>{
    
     if (req.body.email && !validator.isEmail(req.body.email)) {
        throw new Error("invalid email")
    }

}
