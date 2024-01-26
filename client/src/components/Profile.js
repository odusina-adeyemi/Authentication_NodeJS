
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import avatar from '../assets/profile.png';
import {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik';
import { profileValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import styles from '../styles/Username.module.css';
import extend from '../styles/Profile.module.css';






export default function Register() {


  const [file, setFile] = useState()



  
  const formik = useFormik({
    initialValues : {
      firstName: '',
      lastName: '',
      email: 'ade@gmail.com',
      mobile: '',
      address: '',
    },
    validate: profileValidation,
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
        <div className={`${styles.glass} ${extend.glass}`} style={{width:'45%', height:'90%', display:'flex', flexDirection: 'column', flex: 'flex-box' }} >  

        <div className='title flex flex-col flex-wrap items-center'> 
        
        <h4 className='text-5xl font-bold'> Profile</h4>
        <span className='py-4 text-xl w-2/3 text-center text-grey-500 '>You can update your details   </span>
        
        </div>

        <form onSubmit={formik.handleSubmit} className='py-1' >

            <div className='profile flex justify-center py-2' >

              <label htmlFor='profile'>
              <img src={file || avatar} className={`${styles.profile_img} ${extend.profile_img} `} alt="avatar"/>
              </label>
              <input onChange={onUpload} type='file' id='profile' name='profile' />
          
            </div>


            <div className=' text-box flex flex-col items-center gap-4 ' >

               <div className='name flex w-3/4 gap-10' >
               <input {...formik.getFieldProps('firstName')} className={`${styles.textbox} ${extend.textbox}`}  type='text' placeholder='FirstName'/> 
               <input {...formik.getFieldProps('lastName')} className={`${styles.textbox} ${extend.textbox}`}  type='text' placeholder='LastName'/>
               </div>

               <div className='name flex w-3/4 gap-10' >
               <input {...formik.getFieldProps('mobile')} className={`${styles.textbox} ${extend.textbox}`}  type='text' placeholder='Mobile no.'/>
               <input {...formik.getFieldProps('email')} className={`${styles.textbox} ${extend.textbox}`}  type='text' placeholder='Email*'/>
               </div>


         
               <input {...formik.getFieldProps('address')} className={`${styles.textbox} ${extend.textbox}`}  type='text' placeholder='Address'/>
               <button className={styles.btn} type="submit"> Update</button>
               
                </div>
 
        <div className='text-center py-4' >
        <span className='text-grey-500'> Come back later?  <Link className='text-red-500' to='/'>Logout</Link></span>
        </div>

        </form>

        </div>
    </div>
   </div>

  
  
  


     
  )
}
