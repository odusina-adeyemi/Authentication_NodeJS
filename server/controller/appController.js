import UserModel from '../model/user.model.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import ENV from '../config.js';
import otpGenerator from 'otp-generator';







/** middleware for verify user */

export async function verifyUser(req, res, next){
    try {
        const {username} = req.method === "GET" ? req.query : req.body;
        
        // check the user existence
        let exist = await UserModel.findOne({username});
        if(!exist) return res.status(404).send({error: "User not Found...!"})
        next();
    } catch (error) {
        return res.status(404).send({error: " Authentication Error"})
    }
}


 


/** POST : http://localhost:80080/api/register 
 * @param : {
 "username": "example123",
 "password": "admin123",
 "email": "example@gmail.com",
 "firstName": "bill",
 "lastName": "william",
 "mobile": "081688017523",
 "address" ; "L. Jakande Estate, Ajah Lagos"
 "profile": "",

 }
*/

//check existing user


export async function register(req, res) {
    try {
        const { username, email, profile, password } = req.body;

        // Check for existing username
        const existUsername = await UserModel.findOne({ username });
        if (existUsername) {
            return res.status(400).send({ error: "Please use a unique username" });
        }

        // Check for existing email
        const existEmail = await UserModel.findOne({ email });
        if (existEmail) {
            return res.status(400).send({ error: "Please use a unique email" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        const user = new UserModel({
            username,
            password: hashedPassword,
            profile: profile || " ",
            email,
        });

        await user.save();

        return res.status(201).send({ msg: "User registered successfully" });
    } catch (error) {
        return res.status(500).send({ error: error.message || "Internal Server Error" });
    }
}




// export async function register(req, res) {
//     try {

//         const {username, email, profile, password} = req.body;

//         const existUsername = new Promise((resolve, reject) => {
//             UserModel.findOne({username}, function(error, user) {
//                 if (error) reject(new Error(error));
//                 if (user) reject({error: "Please use unique username"});

//                 resolve();
//             })   

//         })


//         //check for existing email
//         const existEmail = new Promise((resolve, reject) => {
//             UserModel.findOne({email}, function(error, email) {
//                 if (error) reject(new Error(error));
//                 if (email) reject({error: "Please use unique email"});

//                 resolve();
//             })   

//         })


//         Promise.all([existUsername, existEmail])
//         .then(()=> {
//             if (password){
//                 bcrypt.hash(password, 10)
//                 .then(hashedPassword => {
//                     const user = new UserModel({
//                         username,
//                         password: hashedPassword,
//                         profile: profile  ||  " ",
//                         email   
//                     });

//                     user.save()

//                     .then(result => res.status(201).send({msg: "User registred successfully"}))
//                     .catch(error => res.status(500).send({error}))

//                 }).catch(error => {
//                 return res.status(500).send({
//                     error: "Enable hashed password"})
//                 }) 

                
//             }

//         }).catch(error => {
//             return res.status(500).send({error})

//         })



        
//     } catch (error) {
//        return  res.status(500).send(error); 
        
//     }
// }


/** POST : http://localhost:80080/api/login
 * @param:  {
    "username": "example123",
 "password": "admin123",
 }
  */

 export async function login(req, res) {
    const {username, password} = req.body;


        try {
            UserModel.findOne({username})
            .then(user =>{
                bcrypt.compare(password, user.password)
                .then(passwordCheck => {
                    if(!passwordCheck) {
                        return res.status(400).send({error: "Password  incorrect or not found"})
                    }

                    //create jwtwebtoken
                     const token = jwt.sign({
                        userId : user._id,
                        username: user.username
                     }, ENV.JWT_SECRET, {expiresIn : '24hrs'});

                     return res.status(200).send({
                        msg : "Login Successful! ", 
                        username: user.username, 
                        token
                    })
                })
                .catch(error =>{
                    return res.status(400).send({error: "Password does not match"})
                })
            })
            .catch( error => {
                return res.status(400).send("username not found")
            })
                
            
            
        } catch (error) {
            
            return res.status(500).send({error})
        }

 }










/** GET : http://localhost:80080/api/user/example123 */


export async function getUser(req, res) {
    const { username } = req.params;

    try {
        if (!username) {
            return res.status(400).send({ error: "Invalid Username, Please provide a username" });
        }

        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).send({ error: "Couldn't find User" });
        }


        /** Remove password from user */
        //mongoose returns unnecessary data, so we convert it into JSON
        

       // return res.status(200).send(user);

       const {password, ...rest} = Object.assign({}, user.toJSON());
       return res.status(201).send(rest)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
}




/** PUT: http://localhost:80080/api/updateuser
 * @param: {
    "id": "<userid>",
}

body: {
    firstName: '',
    address: '',
    profile: '',
}
 */



export async function updateUser(req, res) {
    try {
       // const id = req.query.id;
       const {userId} = req.user

        if (userId) {
            const body = req.body;

            // Update the data
            const update = await UserModel.updateOne({ _id: userId }, body);

            // Check if the update operation was successful
            if (update) {
                return res.status(201).send({ msg: "Record Updated Successfully...!" });
            } else {
                return res.status(404).send({ msg: "No record found for the provided ID." });
            }
        } else {
            return res.status(400).send({ msg: "Missing 'id' parameter." });
        }
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
 }











/** GET : http://localhost:80080/api/generateOTP*/

export async function generateOTP(req, res) {
   req.app.locals.OTP = await otpGenerator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP});
}


/** GET : http://localhost:80080/api/verifyOTP*/

export async function verifyOTP(req, res) {
 const {code} = req.query 
 if(parseInt(req.app.locals.OTP) === parseInt(code)){
   req.app.locals.OTP = null ;  //reset the OTP value
   req.app.resetSession = true; // start session for rest password
   return res.status(200).send({msg: "Verified Successfully...!"});
 }
 return res.status(400).send({error: "Invalid OTP"})

}



//Sucessfully redirect user when OTP is valid 
/** GET : http://localhost:80080/api/createResetSession*/


export async function createResetSession(req, res) {
if (req.app.locals.resetSession) {
req.app.locals.resetSession = false; // allows access to this route once
return res.status(201).send({msg:"Access Granted"})
}
return res.status(440).send({error: "Session Expired"})
}

// export async function createResetSession(req, res) {
//     const sessionTimeout = 3600; // Assuming a session timeout of 1 hour in seconds
  
//     // Check if the session has timed out
//     const lastActiveTime = req.app.locals.lastActiveTime || 0;
//     const currentTime = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
//     const elapsedTimeSinceLastActive = currentTime - lastActiveTime;
  
//     if (elapsedTimeSinceLastActive > sessionTimeout) {
//       return res.status(440).send({ error: "Session Expired" });
//     }
  
//     // Reset the session only if it hasn't been reset before
//     if (!req.app.locals.resetSession) {
//       req.app.locals.resetSession = true;
//       req.app.locals.lastActiveTime = currentTime; // Update last active time
//       return res.status(201).send({ msg: "Access Granted" });
//     }
  
//     return res.status(201).send({ msg: "Access Granted" });
//   }





//update the password when we have valid session




/** PUT : http://localhost:80080/api/resetPassword*/


export async function resetPassword(req, res) {
    try {

        // if(req.app.locals.resetSession=true) return res.status(440).send({error: "Session Expired"})
      const { username, password } = req.body;
  
      // Check if username and password are provided
      if (!username || !password) {
        return res.status(400).send({ error: 'Username and password are required.' });
      }
  
      try {
        const user = await UserModel.findOne({ username });
  
        if (!user) {
          return res.status(404).send({ error: 'Username not found.' });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        await UserModel.updateOne({ username: user.username }, { password: hashedPassword });
  
        // Reset the session after the password is successfully updated
        req.app.locals.resetSession = false;
  
        return res.status(200).send({ msg: 'Record Updated Successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
      }
    } catch (error) {
      console.error(error);
      return res.status(401).send({ error: 'Unauthorized' });
    }
  }
  












// export async function resetPassword(req, res) {
//     try {
//       const { username, password } = req.body;
  
//       // Check if username and password are provided
//       if (!username || !password) {
//         return res.status(400).send({ error: 'Username and password are required.' });
//       }
  
//       try {
//         const user = await UserModel.findOne({ username });
  
//         if (!user) {
//           return res.status(404).send({ error: 'Username not found.' });
//         }
  
//         const hashedPassword = await bcrypt.hash(password, 10);
  
//         await UserModel.updateOne({ username: user.username }, { password: hashedPassword });
  
//         // Reset the session only if it hasn't been reset before
//         if (!req.app.locals.resetSession) {
//           req.app.locals.resetSession = true;
//           // Other session reset logic can go here if needed
//         }
  
//         return res.status(200).send({ msg: 'Record Updated Successfully' });
//       } catch (error) {
//         console.error(error);
//         return res.status(500).send({ error: 'Internal Server Error' });
//       }
//     } catch (error) {
//       console.error(error);
//       return res.status(401).send({ error: 'Unauthorized' });
//     }
//   }
  





// export async function resetPassword(req, res) {
//   try {
//     const {username, password} = req.body;
//     try {
//         UserModel.findOne({username})
//         .then(user => {
//             bcrypt.hash(password, 10)
//             .then(hashedPassword => {
//                 UserModel.UpdateOne({username: user.username},
//                     {password:hashedPassword}, function (error, data) {
//                         if(error) throw error;
//                         return res.status(200).send({msg:"Record Updated Successfully"});
                        
                        
//             }).catch(e => {
//                 return res.status(500).send({error: "Unable to has password"})
//             })
//         })
//         .catch( error => {
//             return res.status(404).send({
//                 error: "Username not found"
//             })
//         })
//     } catch (error) {
//       return res.status(500).send({error})  
//     }
    
//   } catch (error) {
//     res.status(401).send(error)
//   }
// }


 