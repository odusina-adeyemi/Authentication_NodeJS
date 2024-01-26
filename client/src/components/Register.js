
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import avatar from '../assets/profile.png';
import styles from '../styles/Username.module.css'
import {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik';
import { registerValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert'






export default function Register() {


  const [file, setFile] = useState()



  
  const formik = useFormik({
    initialValues : {
      email: 'ade@gmail.com',
      username: 'example123',
      password: 'admin@123'
    },
    validate: registerValidation,
    validateOnBlur: false, 
    validateOnChange: false,
    onSubmit: async values => {
      console.log(values)
      values = await Object.assign(values, {profile: file || ''})
      console.log(values)

    }
  })


  /**  Formik doesnt suport file uploads, so we need to create a function */

   
const onUpload = async e => {
  const base64 = await convertToBase64(e.target.files[0]) ;
  setFile(base64)
  }

   
  return ( 
  <div  className="container mx-auto "> 

  <Toaster position='top-center'  reverseOrder={false} ></Toaster>

    <div className='flex justify-center items-center  h-screen'>
        <div className={styles.glass} style={{width:'45%', height:'90%', display:'flex', flexDirection: 'column', flex: 'flex-box' }} >  

        <div className='title flex flex-col flex-wrap items-center'> 
        
        <h4 className='text-5xl font-bold'> Register </h4>
        <span className='py-4 text-xl w-2/3 text-center text-grey-500 '>Happy to join us   </span>
        
        </div>

        <form onSubmit={formik.handleSubmit} className='py-1' >

            <div className='profile flex justify-center py-2' >

              <label htmlFor='profile'>
              <img src={file || avatar} className={styles.profile_img} alt="avatar"/>
              </label>
              <input onChange={onUpload} type='file' id='profile' name='profile' />
          
            </div>


            <div className=' text-box flex flex-col items-center gap-4 ' >
                <input  {...formik.getFieldProps('email')}  className={styles.textbox} type="email" placeholder="Email"/>
                <input  {...formik.getFieldProps('username')}  className={styles.textbox} type="text" placeholder="Username"/>
                <input  {...formik.getFieldProps('password')}  className={styles.textbox} type="password" placeholder="Password"/>
                <button className={styles.btn} type="submit"> let's Go</button>
            </div>
 
        <div className='text-center py-4' >
        <span className='text-grey-500'> Already a member?  <Link className='text-red-500' to='/'>Login Now</Link></span>
        </div>

        </form>

        </div>
    </div>
   </div>

  
  
  
  


     
  )
}
