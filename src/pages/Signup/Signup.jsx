import React, { useState } from "react"
import PasswordInput from "../../components/Input/PasswordInput"
import { Link, useNavigate } from "react-router-dom"
import { validateEmail } from "../../utils/helper"
import { toast } from "react-toastify"
import { registerUser } from "../../api/authApi"

const Signup = () => {
  const [fullname, setName] = useState("")
  const [username, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()

    if (!fullname) return setError("Please enter your name")
    if (!validateEmail(email)) return setError("Please enter a valid email address")
    if (!password) return setError("Please enter the password")

    setError("")

    try {
      const res = await registerUser({ fullname, username, email, password })

      // ✅ success case
      if (res.data.success) {
        toast.success(res.data.message || "User registered successfully")
        navigate("/login")
      } 
      // ✅ failure case handled from backend message
      else {
        toast.error(res.data.message || "Registration failed")
      }

    } catch (err) {
      // ✅ handle HTTP errors gracefully
      if (err.response && err.response.data) {
        toast.error(err.response.data.message || "Something went wrong")
      } else {
        toast.error(err.message || "Network error")
      }
      console.error("Signup error:", err)
    }
  }

  return (
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleSignUp}>
          <h4 className="text-2xl mb-7">Sign Up</h4>

          <input
            type="text"
            placeholder="Name"
            className="input-box"
            value={fullname}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="UserName"
            className="input-box"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Email"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm pb-1">{error}</p>}

          <button type="submit" className="btn-primary">
            SIGN UP
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-[#2B85FF] underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
