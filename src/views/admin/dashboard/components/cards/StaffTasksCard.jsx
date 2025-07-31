import {useEffect, useState} from "react";
import DashboardCard from "../DashboardCard";
import axios from "axios";

const url = process.env.REACT_APP_API_UTILITY_URL;
export default function StaffTasksCard() {
  const [num, setNum] = useState(0);
  useEffect(() => {
    const fetchData = async () =>{
      const response = await axios.get(`${url}/api/admin/service/task`);

      console.log(response.data.stafftaskCount);
      setNum(response.data.stafftaskCount);
    };
    fetchData();
  },[]);

  return <DashboardCard title="Staff Tasks" count ={num} />;
}
