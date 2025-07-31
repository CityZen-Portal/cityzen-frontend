import {useEffect, useState} from "react";
import axios from "axios";
import DashboardCard from "../DashboardCard";
export default function GrievancesRaisedCard() {

  const [num,setNum] = useState(0);
    useEffect(()=>{
      const fetchData = async() =>{
        const response = await axios.get("https://hepldesk-backend-1.onrender.com/api/helpdesk/admin/complaints/count");
        console.log(response.data.totalComplaintsCount);
        setNum(response.data.data.totalComplaintsCount);
      };
      fetchData();
    },[]);
  return <DashboardCard title="Grievences Raised" count={num}/>;
}
