import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layout/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import ProfilePhotoSelector from '../../components/input/ProfilePhotoSelector'
import AuthInput from '../../components/input/AuthInput'
import { validateEmail } from '../../utils/helper'
import { UserContext } from '../../context/UserContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import uploadImage from '../../utils/uplaodImage'

const SignUpForm = () => {
  const [profilePic, setProfilePic] = useState(null)
  const [fullName, setFullName] = useState("")
  const [email, setPEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = ""

    if (!fullName) {
      setError("Full Name is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!username) {
      setError("Username is required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError("");

    // SignUP API
    try {
      // Upload image if present
      if(profilePic){
        const imgUplaodRes = await uploadImage(profilePic);
        profileImageUrl = imgUplaodRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        fullName,
        username,
        email,
        password,
        profileImageUrl
      });

      const  { token , user} = response.data;

      if(token){
        localStorage.setItem("token", token);   
        updateUser(user);
        navigate('/dashboard');
      }

    } catch (error) {
      console.log(error);
      
      if(error.response && error.response.data.message){
        setError(error.response.data.message)
      }else{
        setError("Something went wrong. Please try again")
      }
    }
  }

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto mg:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            <AuthInput
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
              type="text"
            />
            <AuthInput
              value={email}
              onChange={(e) => setPEmail(e.target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="text"
            />
            <AuthInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Username"
              placeholder="@"
              type="text"
            />
            <AuthInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
            />
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary mt-4">
            CREATE ACCOUNT
          </button>
        </form>

        <p className="text-[13px] text-slate-800 mt-3">
          Already have an account?{" "}
          <Link className="font-medium text-primary underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default SignUpForm
