import { useEffect, useState } from "react"
import axios from "axios"

export const CustomReactQuery = (urlPath: string) => {
    const [data,setData] = useState([])
    const [error,setError] = useState(false)
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        try {
            ;(async() =>{
                setLoading(true)
                setError(false)
    
                const response = await axios.get(urlPath)
                setData(response.data)
                setLoading(false)
            })()
        } catch (error) {
            setError(true)
            setLoading(false)
            console.log(error)
        }
    },[urlPath])


    return [data,error,loading]
}