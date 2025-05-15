import validator from 'validator'

export const validate = (req)=>{
    
     if (!validator.isEmail(req.body.email)) {
        throw new Error("invalid email")
    }

}
