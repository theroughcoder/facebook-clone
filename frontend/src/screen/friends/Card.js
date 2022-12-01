import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  acceptRequest,
  cancelRequest,
  deleteRequest,
} from "../../functions/user";
import SyncLoader from "react-spinners/SyncLoader";
export default function Card({ userr, type, getData }) {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const cancelRequestHandler = async (userId) => {
    setLoading(true)
    const res = await cancelRequest(userId, user.token);
    if (res == "ok") {
      getData();
    }
    setLoading(false)
  };
  const confirmHandler = async (userId) => {
    setLoading(true)
    const res = await acceptRequest(userId, user.token);
    if (res == "ok") {
      getData();
    }
    setLoading(false)
  };
  const deleteHandler = async (userId) => {
    setLoading(true)
    const res = await deleteRequest(userId, user.token);
    if (res == "ok") {
      getData();
    }
    setLoading(false)
  };
  return (
    <div className="req_card">
      {loading && 
        <div className="card_blur">
        <SyncLoader color="#fffff0" loading={loading} margin={0} speedMultiplier={0.8} />
      </div>
      }
      <Link to={`/profile/${userr.username}`}>
        <img src={userr.picture} alt="" />
      </Link>
      <div className="req_name">
        {userr.first_name} {userr.last_name}
      </div>
      {type === "sent" ? (
        <button
          className="blue_btn"
          onClick={() => cancelRequestHandler(userr._id)}
        >
          Cancel Request
        </button>
      ) : type === "request" ? (
        <>
          <button
            className="blue_btn"
            onClick={() => confirmHandler(userr._id)}
          >
            Confirm
          </button>
          <button className="gray_btn" onClick={() => deleteHandler(userr._id)}>
            Delete
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
