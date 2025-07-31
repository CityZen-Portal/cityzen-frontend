import {useEffect, useState} from "react";
import axios from "axios";
import DashboardCard from "../DashboardCard";

const url = process.env.REACT_APP_API_UMS_URL;
export default function CitizenRegisteredCard() {
  const [num,setNum] = useState(0);
  useEffect(()=>{
    const fetchData = async() =>{
      const response = await axios.get(`${url}/api/auth/allusers`);
      setNum(response.data.data.length);
    };
    fetchData();
  },[]);
  return <DashboardCard title="Citizen Registered" count = {num} />;
}
