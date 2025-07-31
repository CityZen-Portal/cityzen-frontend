import {useEffect,useState} from "react"; 
import DashboardCard from "../DashboardCard";
import axios from "axios";

const url = process.env.REACT_APP_API_UTILITY_URL;
export default function ServiceRequestsCard() {
  const[num, setNum] = useState(0);
  useEffect(()=> {
    const fetchData = async() =>{
      const response = await axios.get(`${url}/api/admin/service/task`);
      console.log(response.serviceCount);
      setNum(response.data.serviceCount);
    };
    fetchData();
  },[]);

  return <DashboardCard title="Service Requests" count ={num}/>;
}
