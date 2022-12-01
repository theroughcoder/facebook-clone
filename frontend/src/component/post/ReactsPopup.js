import { useState } from "react";

const reactsArray = [
  {
    name: "like",
    image: "../../../reacts/like.gif",
  },
  {
    name: "love",
    image: "../../../reacts/love.gif",
  },
  {
    name: "haha",
    image: "../../../reacts/haha.gif",
  },
  {
    name: "wow",
    image: "../../../reacts/wow.gif",
  },
  {
    name: "sad",
    image: "../../../reacts/sad.gif",
  },
  {
    name: "angry",
    image: "../../../reacts/angry.gif",
  },
];
export default function ReactsPopup({ visible, setVisible, reactHandler}) {
  return (
    <>
      {visible && (
        <div
          className="reacts_popup"
          // onMouseOver={() => {
         
          //     setVisible(true);
           
          // }}
          // onMouseLeave={() => {
          //   setTimeout(() => {
          //     setVisible(false);
          //   }, 500);
          // }}
          onClick={()=> setVisible(false)}
        >
          {reactsArray.map((react, i) => (
            <div className="react" key={i} onClick={()=> reactHandler( react.name)}>
              <img src={react.image} alt="" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}