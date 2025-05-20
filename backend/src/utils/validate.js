import validator from 'validator'

export const validate = (req)=>{
    
     if (req.body.email && !validator.isEmail(req.body.email)) {
        throw new Error("invalid email")
    }
    if(req.body.password &&!validator.isLength(req.body.password, {min: 8, max: undefined})){
        throw new Error("password must be at least 8 characters")
    }

}
