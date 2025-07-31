import {useEffect, useState} from "react";
import axios from "axios";
import DashboardCard from "../DashboardCard";
export default function ResolvedComplaintsCard() {
  
    const [num,setNum] = useState(0);
      useEffect(()=>{
        const fetchData = async() =>{
          const response = await axios.get("https://hepldesk-backend-1.onrender.com/api/helpdesk/admin/complaints/count");
          console.log(response.data.resolvedComplaintsCount);
          setNum(response.data.data.resolvedComplaintsCount);
        };
        fetchData();
      },[]);
  return <DashboardCard title="Resolved Complaints" count = {num}/>;
}
