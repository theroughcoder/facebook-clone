import { ArrowRight, Plus } from "../../../svg";
import { stories } from "../../../data/home";
import Story from "./Story";
import { useMediaQuery } from "react-responsive";
export default function Stories() {

  const query1175px = useMediaQuery({
    query: "(max-width: 1175px)",
  });
  const query1030px = useMediaQuery({
    query: "(max-width: 1030px)",
  });
  const query885px = useMediaQuery({
    query: "(max-width: 885px)",
  });
  const query850px = useMediaQuery({
    query: "(max-width: 850px)",
  });

  const max =  query885px
    ? stories.length
    : query1030px
    ? 5
    : query1175px
    ? 4
    : 5;
  return (
    <div className= {`stories  ${query850px && `query850pxStories` }`}>
      <div className="create_story_card">
        <img
          src="../../../images/default_pic.png"
          alt=""
          className="create_story_img"
        />
        <div className="plus_story">
          <Plus color="#fff" />
        </div>
        <div className="story_create_text">Create Story</div>
      </div>
      {stories.slice(0, max).map((story, i) => (
        <Story key={i} story={story} />
      ))}
      <div className="white_circle">
        <ArrowRight color="#65676b" />
      </div>
    </div>
  );
}
