import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  search,
  addToSearchHistory,
  getSearchHistory,
  removeFromSearch,
} from "../../functions/user";
import useClickOutSide from "../../helpers/clickOutSide";
import { Return, Search } from "../../svg";
import BarLoader from "react-spinners/BarLoader";
export default function SearchMenu({ setShowSearchMenu, token }) {
  const color = "#65676b";
  const menu = useRef(null);
  const input = useRef(null);
  const [iconVisible, setIconVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useClickOutSide(menu, () => {
    setShowSearchMenu(false);
  });
  useEffect(() => {
    input.current.focus();
  }, []);

  useEffect(() => {
    getHistory();
  }, []);
  const getHistory = async () => {
    const res = await getSearchHistory(token);
    setSearchHistory(res);
  };
  const searchHandler = async () => {
    if (searchTerm === "") {
      setResults("");
    } else {
      setLoading(true)
      const res = await search(searchTerm, token);
      var regexObj = new RegExp(searchTerm, "i");
      
      const positionIncludedArray = res.map((user) => ({
        ...user,
        position: user.first_name.concat(" ", user.last_name).search(regexObj),
      }));
      setResults(
        positionIncludedArray.sort(function (a, b) {
          return a.position - b.position;
        })
        );
      }
      setLoading(false)
  };
  const addToSearchHistoryHandler = async (searchUser) => {
    const res = await addToSearchHistory(searchUser, token);
    setShowSearchMenu(false);
  };
  const handleRemove = async (searchUser) => {
    removeFromSearch(searchUser, token);
    getHistory();
  };

  return (
    <div className=".header_left search_area scrollbars" ref={menu}>
      <div className="search_wrap">
        <div className="header_logo">
          <div
            className="circle hover1"
            onClick={() => {
              setShowSearchMenu(false);
            }}
          >
            <Return color={color} />
          </div>
        </div>
        <div className="search" onClick={() => input.current.focus()}>
          {iconVisible && (
            <div>
              {" "}
              <Search color={color} />
            </div>
          )}
          <input
            type="text"
            placeholder="Search Facebook"
            ref={input}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={searchHandler}
            onFocus={() => setIconVisible(false)}
            onBlur={() => setIconVisible(true)}
          />
        </div>
      </div>
      {results == "" && (
        <div className="search_history_header">
          <span>Recent searches</span>
          <a>Edit</a>
        </div>
      )}
      <div className="not_found">
        {searchTerm && results == "" && !loading && <span>Result Not Found</span>}
      </div>
      <div className="not_found">
        {searchTerm && loading && (
          <BarLoader
            speedMultiplier={2}
            color= "#656760"
            loading={loading}
            margin={4}
            size={15}
          />
        )}
      </div>
      <div className="search_history scrollbar">
        {searchHistory &&
          !searchTerm &&
          results == "" &&
          searchHistory
            .sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            })
            .map((user) => (
              <div className="search_user_item_flex hover1" key={user.user._id}>
                <Link
                  to={`/profile/${user.user.username}`}
                  className="search_user_item hover1"
                  onClick={() => addToSearchHistoryHandler(user.user._id)}
                  key={user.user._id}
                >
                  <img src={user.user.picture} alt="" />
                  <span>
                    {user.user.first_name} {user.user.last_name}
                  </span>
                </Link>
                <i
                  className="exit_icon"
                  onClick={() => {
                    handleRemove(user.user._id);
                  }}
                ></i>
              </div>
            ))}
      </div>
      <div className="search_history">
        <div className="search_result scrollbar">
          {results &&
            results.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="search_user_item hover1"
                onClick={() => addToSearchHistoryHandler(user._id)}
                key={user._id}
              >
                <img src={user.picture} alt="" />
                <span>
                  {user.first_name} {user.last_name}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
