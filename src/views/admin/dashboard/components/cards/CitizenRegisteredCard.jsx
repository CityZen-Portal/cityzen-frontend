import {useEffect, useState} from "react";
import axios from "axios";
import DashboardCard from "../DashboardCard";

const url = process.env.REACT_APP_API_CITIZEN_COUNT_URL;
export default function CitizenRegisteredCard() {
  const [num,setNum] = useState(0);
  useEffect(()=>{
    const fetchData = async() =>{
      console.log()
      const response = await axios.get(`${url}/auth/get-count/citizen`);
      setNum(response.data.data);
    };
    fetchData();
  },[]);
  return <DashboardCard title="Citizen Registered" count = {num} />;
}
