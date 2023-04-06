import { Component } from "react";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";

import "./charList.scss";

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
  };

  marvelService = new MarvelService();

  onCharListLoaded = (charList) => {
    this.setState({
      charList,
      loading: false,
    });
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  componentDidMount() {
    this.marvelService.getAllCharacters().then(this.onCharListLoaded).catch(this.onError);
  }

  // Этот метод создан для оптимизации, чтобы не помещать такую конструкцию в метод render.

  renderCharListItems(charList) {
    const charListItems = charList.map((item) => {
      const { id, name, thumbnail } = item;
      const { onCharSelected } = this.props;

      return <CharListItem key={id} name={name} thumbnail={thumbnail} onCharSelected={() => onCharSelected(id)} />;
    });
    // А эта конструкция вынесена для центровки спиннера/ошибки.
    return <ul className="char__grid">{charListItems}</ul>;
  }

  render() {
    const { charList, loading, error } = this.state;
    const items = this.renderCharListItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

const CharListItem = ({ name, thumbnail, onCharSelected }) => {
  let imgStyle = thumbnail.match(/image_not_available/) ? { objectFit: "unset" } : { objectFit: "cover" };

  return (
    <li className="char__item" onClick={onCharSelected}>
      <img src={thumbnail} alt={name} style={imgStyle} />
      <div className="char__name">{name}</div>
    </li>
  );
};

export default CharList;
