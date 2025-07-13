import React  from "react";
import img1 from "../../../../assets/img/service/govimg-2.jpeg";
import data from "../variables/data"; 
import ServiceForm from "./ServiceForm";
import { useNavigate } from "react-router-dom";
function Servicelist() {
  const navigate = useNavigate();
  console.log(data);
  return (
    <>
      <div
        className="border-r-lg border bg-cover bg-center md:h-60"
        style={{ backgroundImage: `url(${img1})` }}
      >
        <h1 className="flex items-center justify-center pt-6 text-4xl font-bold text-white">
          Services
        </h1>
        <p className="text-center text-sm text-white md:pe-14 md:ps-14 md:pt-4 md:text-lg">
          Municipality services include water supply, waste management, road
          maintenance, street lighting, sanitation, public health, and
          infrastructure development—ensuring essential civic amenities and
          improving the quality of life in urban and rural areas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2 md:p-10 ">
        {data.map((item, index) => (
          <div
            key={index}
            className="border-r-lg mt-6 overflow-hidden rounded border bg-white shadow-lg md:max-w-lg"
          >
            <img
              src={item.img}
              alt={item.nameOfService}
              className="h-60 w-full transform object-cover transition-transform duration-500 hover:scale-110"
            />
            <div className="px-6 py-4">
              <div className=" flex justify-center text-xl font-bold">
                {item.nameOfService}
              </div>
            </div>
            <div className="flex justify-center pb-4">
              <button  onClick={()=>navigate(`/citizen/Services/form/${item.nameOfService}`)} className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                Get service
              </button>
            </div>
          </div>
        ))}

      </div>
      {/* <ServiceForm/> */}
    </>
  );
}

export default Servicelist;
