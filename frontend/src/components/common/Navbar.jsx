import { useContext } from "react";
import { authContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../config/axios";
import { disconnectSocket } from "../../config/socket";
import { toast } from "react-toastify";
import LoadingBar from "./LoadingBar";
import { useState } from "react";

const Navbar = () => {
  const { user, setUser } = useContext(authContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  async function logout() {
    setLoading(true)
   const res = await axiosClient.post('/api/users/logout')
  //  console.log(res)
    setUser(null);
    disconnectSocket()
    toast.success('User logged out!')
    navigate("/login");
    setLoading(false)
  }

  const email = user?.user?.email || user?.email

  if(loading){
    return <div className="min-h-screen  w-full bg-[#0f0f0f] flex items-center justify-center" >
      <LoadingBar />
    </div>
  }

  return (
    <div className="h-[6vh] w-full bg-[#0f0f0f] border-b border-[#222] flex items-center justify-between px-6">
      
      {/* LEFT: Brand */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <span className="text-purple-500 text-xl font-bold">⚡</span>
        <h1 className="text-lg text-white font-semibold">DevCollab</h1>
      </div>

     

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-4">
        

        {/* User */}
        {!user?'':<div className="flex items-center gap-2 text-sm">
          <div className="bg-purple-600 rounded-full flex items-center justify-center uppercase font-bold h-7 w-7 text-sm text-purple-200"><span>{email[0]}</span></div>
          <button
            onClick={logout}
            className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md text-white text-m"
          >
            Logout
          </button>
        </div>}
      </div>

    </div>
  );
};

export default Navbar;
