import { useEffect, useState } from "react";
import DashboardCard from "../DashboardCard";
import axios from "axios";
const url = process.env.REACT_APP_API_UTITLITY_URL;
export default function FeedbackReceivedCard() {
  const [num, setNum] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${url}/api/feedback/all`);

      console.log(response.data.data.length);
      setNum(response.data.data.length);
    };
    fetchData();
  }, []);
  return <DashboardCard title="Feedback Received" count={num} />;
}
