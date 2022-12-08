import { useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import ProfilePicture from "../../component/profielPicture";
import Friendship from "./Friendship";
export default function ProfielPictureInfos({
  profile,
  visitor,
  photos,
  othername,
  setFetch,
  loading: skeletonLoading,
}) {
  const [show, setShow] = useState(false);
  const pRef = useRef(null);
  return (
    <div className="profile_img_wrap">
      {show && (
        <ProfilePicture
          setShow={setShow}
          pRef={pRef}
          photos={photos}
          setFetch={setFetch}
        />
      )}

      <div className="profile_w_left">
        <div className="profile_w_img">
          {skeletonLoading ? (
            <Skeleton
              circle
              height="180px"
              width="180px"
              containerClassName="avatar-skeleton"
            />
          ) : (
            <>
              <div
                className="profile_w_bg"
                ref={pRef}
                style={{
                  backgroundSize: "cover",
                  backgroundImage: `url(${profile.picture})`,
                }}
              ></div>
              {!visitor && (
                <div
                  className="profile_circle hover1"
                  onClick={() => setShow(true)}
                >
                  <i className="camera_filled_icon"></i>
                </div>
              )}
            </>
          )}
        </div>
        <div className="profile_w_col">
          <div className="profile_name">
          {skeletonLoading ? <Skeleton height= "100%" /> : <>
          
          {profile.first_name} {profile.last_name}
          <div className="othername">{othername && `(${othername})`}</div>
          </>
              }
          </div>
          <div className="profile_friend_count"></div>
          <div className="profile_friend_imgs"></div>
        </div>
      </div>
      {visitor ? (
        <Friendship friendshipp={profile?.friendship} profileid={profile._id} skeletonLoading={skeletonLoading}/>
      ) : (
        <div className="profile_w_right">
          <div className="blue_btn add_to_story_btn">
            <img src="../../../icons/plus.png" alt="" className="invert" />
            <span>Add to story</span>
          </div>
          <div className="gray_btn">
            <i className="edit_icon"></i>
            <span>Edit profile</span>
          </div>
        </div>
      )}
    </div>
  );
}
