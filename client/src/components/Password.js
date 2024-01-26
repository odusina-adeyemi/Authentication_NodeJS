
import React from 'react'
import { Link } from 'react-router-dom';
import avatar from '../assets/profile.png';
import styles from '../styles/Username.module.css'
import {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik';
import { passwordValidate } from '../helper/validate';
import useFetch from '../hooks/fetch.hook';
import {useAuthStore} from '../store/store'





export default function Password() {

  const {username} = useAuthStore(state => state.auth)
    const  [{isLoading, apiData, serverError}] = useFetch(`/user/${username}`)
  
  const formik = useFormik({
    initialValues : {
      password: 'admin@123'
    },
    validate: passwordValidate,
    validateOnBlur: false, 
    validateOnChange: false,
    onSubmit: async values => {
      console.log(values)

    }
  })


if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
if(serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>


  
  return ( 
  <div  className="container mx-auto"> 

  <Toaster position='top-center'  reverseOrder={false} ></Toaster>

    <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>  

        <div className='title flex flex-col items-center'> 
        
        <h4 className='text-5xl font-bold'>{apiData.firstName || apiData?.username}</h4>
        <span className='py-4 text-xl w-2/3 text-center text-grey-500 '>Explore more by connection with us!   </span>
        
        </div>

        <form onSubmit={formik.handleSubmit} className='py-1' >

            <div className='profile flex justify-center py-4' >
            <img src={apiData?.profile || avatar} className={styles.profile_img} alt="avatar"/>
            </div>


            <div className=' text-box flex flex-col items-center gap-6 ' >
                 <input  {...formik.getFieldProps('password')}  className={styles.textbox} type="text" placeholder="Password"/>
                <button className={styles.btn} type="submit"> let's Go</button>
            </div>

        <div className='text-center py-4' >
        <span className='text-grey-500'> Forgot Password?   <Link className='text-red-500' to='/recovery'>Recover Now</Link></span>
        </div>

        </form>

        </div>
    </div>
   </div>

  
  
  
  


     
  )
}
