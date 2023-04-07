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
    newItemLoading: false,
    offset: 210,
    charEnded: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService.getAllCharacters(offset).then(this.onCharListLoaded).catch(this.onError);
  };

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true,
    });
  };

  onCharListLoaded = (newCharList) => {
    let ended = newCharList.length < 9 ? true : false;

    this.setState(({ charList, offset }) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

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
    const { charList, loading, error, newItemLoading, offset, charEnded } = this.state;
    const items = this.renderCharListItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          onClick={() => this.onRequest(offset)}
          style={{ display: charEnded ? "none" : "block" }}
        >
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
