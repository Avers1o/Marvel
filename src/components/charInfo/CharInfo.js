import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// import Spinner from "../spinner/Spinner";
// import ErrorMessage from "../errorMessage/ErrorMessage";
// import Skeleton from "../skeleton/Skeleton";

import useMarvelService from "../../services/MarvelService";
import setContent from "../../utils/setContent";

import "./charInfo.scss";

const CharInfo = (props) => {
  const [char, setChar] = useState(null);

  const { loading, error, clearError, process, setProcess, getCharacter } = useMarvelService();

  useEffect(() => {
    updateChar();
  }, []);

  useEffect(() => {
    updateChar();
  }, [props.charId]);

  const updateChar = () => {
    const { charId } = props;

    if (!charId) return;

    clearError();

    getCharacter(charId)
      .then(onCharLoaded)
      .then(() => setProcess("confirmed"));
  };

  const onCharLoaded = (char) => {
    setChar(char);
  };

  // const setContent = (process, char) => {
  //   switch (process) {
  //     case "waiting":
  //       return <Skeleton />;
  //       break;
  //     case "loading":
  //       return <Spinner />;
  //       break;
  //     case "confirmed":
  //       return <View char={char} key={char.id} />;
  //       break;
  //     case "error":
  //       return <ErrorMessage />;
  //       break;
  //     default:
  //       throw new Error("Unecpected process state");
  //   }
  // };

  // const skeleton = char || loading || error ? null : <Skeleton />;
  // const errorMessage = error ? <ErrorMessage /> : null;
  // const spinner = loading ? <Spinner /> : null;
  // const content = !(loading || error || !char) ? <View char={char} key={char.id} /> : null;

  return (
    <div className="char__info">
      {/* {skeleton}
      {errorMessage}
      {spinner}
      {content} */}
      {setContent(process, View, char)}
    </div>
  );
};

const View = ({ data }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = data;
  let imgStyle = thumbnail.match(/image_not_available/) ? { objectFit: "unset" } : { objectFit: "cover" };

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} style={imgStyle} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? null : "There is no comics with this character"}
        {comics.slice(0, 10).map((item, i) => {
          return (
            <li key={i} className="char__comics-item">
              {item.name}
            </li>
          );
        })}
      </ul>
    </>
  );
};

CharInfo.propTypes = {
  charId: PropTypes.number,
};

export default CharInfo;
