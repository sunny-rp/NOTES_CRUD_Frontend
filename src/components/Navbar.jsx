"use client"

import { useState } from "react"
import SearchBar from "./SearchBar/SearchBar"
import ProfileInfo from "./Cards/ProfileInfo"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import {
  signoutFailure,
  signoutStart,
  signoutSuccess
} from "../redux/user/userSlice"
import { logoutUser } from "../api/authApi.js"

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSearch = () => {
    if (searchQuery) onSearchNote(searchQuery)
  }

  const onClearSearch = () => {
    setSearchQuery("")
    handleClearSearch()
  }

  const onLogout = async () => {
  dispatch(signoutStart());

  try {
    await logoutUser(); // best effort
  } catch (e) {
    // ignore API fail (token expired etc.)
  }

  dispatch(signoutSuccess());
  toast.success("Logged out");
  navigate("/login");
};


  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <Link to="/">
        <h2 className="text-xl font-medium text-black py-2">
          <span className="text-slate-500">Note</span>
          <span className="text-slate-900">Nest</span>
        </h2>
      </Link>

      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  )
}

export default Navbar
