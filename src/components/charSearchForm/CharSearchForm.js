import { useState } from "react";
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charSearchForm.scss";

const CharSearchForm = () => {
  const [charList, setChar] = useState(null);
  const { loading, error, getCharactersByName, clearError } = useMarvelService();

  const onCharLoaded = (char) => {
    setChar(char);
  };

  const updateChar = (name) => {
    clearError();

    getCharactersByName(name).then(onCharLoaded);
  };

  const errorMessage = error ? (
    <div className="char__search-critical-error">
      <ErrorMessage />
    </div>
  ) : null;
  const results = !charList ? null : charList.length > 0 ? (
    charList.map((char) => (
      <div key={char.id} className="char__search-wrapper">
        <div className="char__search-success">There is! Visit {char.name} page?</div>
        <Link to={`/characters/${char.id}`} className="button button__secondary">
          <div className="inner">To page</div>
        </Link>
      </div>
    ))
  ) : (
    <div className="char__search-error">The character was not found. Check the name and try again</div>
  );

  return (
    <div className="char__search-form">
      <Formik
        initialValues={{
          charName: "",
        }}
        validationSchema={Yup.object({
          charName: Yup.string().required("This field is required"),
        })}
        onSubmit={({ charName }) => {
          updateChar(charName);
        }}
      >
        <Form onChange={(e) => (!e.target.value ? setChar(null) : null)}>
          <label className="char__search-label" htmlFor="charName">
            Or find a character by name:
          </label>
          <div className="char__search-wrapper">
            <Field id="charName" name="charName" type="text" placeholder="Enter name" />
            <button type="submit" className="button button__main" disabled={loading}>
              <div className="inner">find</div>
            </button>
          </div>
          <FormikErrorMessage component="div" className="char__search-error" name="charName" />
        </Form>
      </Formik>
      {results}
      {errorMessage}
    </div>
  );
};

export default CharSearchForm;