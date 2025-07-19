import React  from "react";
import { useParams, useNavigate, useLocation} from "react-router-dom";

export default function NewsDetails() {
  const { title } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
 console.log(title);
  const newsItem = location.state;

  if (!newsItem) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-500">News Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto bg-white p-8 dark:bg-navy-800 dark:text-white">
        <button
          onClick={() => navigate(-1)}
          className="mt-6 text-blue-600 underline mb-3"
        >
          ← Back to News
        </button>
        <img
          src={newsItem.image}
          alt={newsItem.title}
          className="mb-6 w-full rounded-xl"
        />
        <h1 className="mb-2 text-3xl font-bold">{newsItem.title}</h1>
        <p className="mb-4 text-gray-700">{newsItem.description}</p>
        <p className="text-gray-600">{newsItem.content}</p>
      </div>
      
        
      
    </>
  );
}
