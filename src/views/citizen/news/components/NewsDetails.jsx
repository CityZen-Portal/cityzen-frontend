import React ,{useState} from "react";
import { useParams, useNavigate, useLocation} from "react-router-dom";

export default function NewsDetails() {
  const { title } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
 console.log(title);
  const newsItem = location.state;
const [comments, setComments] = useState([]);
const [commentText, setCommentText] = useState("");
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
const handleCommentSubmit = (e) => {
  e.preventDefault();
  if (commentText.trim() === "") return;
  setComments((prev) => [...prev, commentText.trim()]);
  setCommentText("");
};
  return (
    <>
      <div className="mx-auto bg-white p-8">
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
      <div className="mt-10 rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Leave a Comment
        </h2>
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            rows="3"
            placeholder="Write your comment here..."
          />
          <button
            type="submit"
            className="mt-3 rounded-lg bg-blue-500 px-5 py-2 text-white hover:bg-blue-600"
          >
            Submit
          </button>
        </form>

        <h3 className="mb-3 text-lg font-medium">Comments:</h3>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-2">
            {comments.map((comment, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-gray-200 bg-gray-100 p-3"
              >
                {comment}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
