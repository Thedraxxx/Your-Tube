
'use client'
import { useEffect, useState } from "react"
import { useAuth } from "@/app/context/authcontext";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";


export default function editVideo () {
    const {id} = useParams();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [ description, setDescription] = useState('');
    const [isLoading , setIsLoading] = useState(true);
    const {isAuthenticated} = useAuth();
    const [error, setError] = useState('');

    useEffect(()=>{
        if(!isAuthenticated){
            console.log("you need to login first");
            setError("failed to authenticate")
            router.push("/auth/login");
        }
        setIsLoading(false);
    },[isAuthenticated,router]);

   const handleUpdate = (async(e)=>{
    e.preventDefault();
    setIsLoading(true)
             try {
               const res =  await axios.patch(`http://localhost:8000/api/v2/videos/editVideo/${id}`,{
                title,description,
               },{
                withCredentials: true,
               });
               console.log(res.data)
               router.push('/auth/profile')
             } catch (error) {
                console.log(error)
               setError("error in updated handeling")
             } finally{
                setIsLoading(false);
             }
   })

    return (
        <div className="max-w-lg mx-auto mt-12">
          <h2 className="text-2xl font-semibold mb-4">Edit Video</h2>
    
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block mb-1">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
    
            <div>
              <label className="block mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                rows={4}
                required
              />
            </div>
    
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
    
           
          </form>
        </div>
      )
}