import toast from 'react-hot-toast'
import { authenticate } from './helper';


// validate login page username

export async function usernameValidate(values){
    const errors = usernameVerify({}, values);

    if (values.username){
        //check user exist or not
        const {status} = await authenticate(values.username);
        if (status !==200){
            errors.exist = toast.error('User does not exist')
        }
    }
    return errors
}




/** validate reset password */

export async function resetPasswordValidation(values) {

    const errors = passwordVerify({}, values)
if (values.password !== values.confirm_pwd) {
    errors.exist = toast.error('Password do not match...!')
}
    

return errors
}

/**  validate register form  */ 
export async function registerValidation(values) {
 const errors = usernameVerify({}, values);
 passwordVerify(errors, values);
 emailVerify(errors, values);
 return errors
}


/**  validate profile page */
export async function profileValidation(values) {
    const errors = emailVerify({}, values)
    return errors
}





/** validate password */

export async function passwordValidate(values){

    const errors = passwordVerify({}, values)
    return errors
}



/** validate password */

const specialChar = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
function passwordVerify(errors = {}, values) {
if(!values.password){
    errors.password = toast.error('Passrword Required...!');
} else if ( values.password.includes(' ')) {
    errors.password = toast.error('Wrong Password...!')
}else if (values.password.length < 4 ) {

    errors.password = toast.error('Password must be more than 4 character')
} else if (!specialChar.test(values.password)) {
    errors.password = toast.error('Password must include a special character!')
}


    
return errors

     
}



/** validate Username */
function usernameVerify(error={}, values) {
    if (!values.username) {
        error.username = toast.error('Username Required...!');
} else if (values.username.includes(" ")){
    error.username = toast.error('Invalid Username...!');
}

return error

}



/** Validate email */
function emailVerify(errors ={}, values){
    if (!values.email) {
        errors.email = toast.error('Email is Required...!')
    } 
    
 else if(values.email.includes(' ')){
    errors.email = toast.error('Email can not include a space')
} else if(!/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>\\/?]/.test(values.email)){
    errors.email = toast.error('Invalid email address')
}
return errors
}