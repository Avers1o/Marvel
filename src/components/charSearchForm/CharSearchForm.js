import { useState } from "react";
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

import ErrorMessage from "../errorMessage/ErrorMessage";
import useMarvelService from "../../services/MarvelService";

import "./charSearchForm.scss";

const setContent = (process, data) => {
  switch (process) {
    case "waiting":
      return null;
    case "loading":
      return null;
    case "confirmed":
      return !data ? null : data.length > 0 ? (
        data.map((item) => (
          <div key={item.id} className="char__search-wrapper">
            <div className="char__search-success">There is! Visit {item.name} page?</div>
            <Link to={`/characters/${item.id}`} className="button button__secondary">
              <div className="inner">To page</div>
            </Link>
          </div>
        ))
      ) : (
        <div className="char__search-error">The character was not found. Check the name and try again</div>
      );
    case "error":
      return (
        <div className="char__search-critical-error">
          <ErrorMessage />
        </div>
      );
    default:
      throw new Error("Unecpected process state");
  }
};

const CharSearchForm = () => {
  const [charList, setChar] = useState(null);
  const { process, setProcess, getCharactersByName, clearError } = useMarvelService();

  const onCharLoaded = (char) => {
    setChar(char);
  };

  const updateChar = (name) => {
    clearError();

    getCharactersByName(name)
      .then(onCharLoaded)
      .then(() => setProcess("confirmed"));
  };

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
            <button type="submit" className="button button__main" disabled={process === "loading"}>
              <div className="inner">find</div>
            </button>
          </div>
          <FormikErrorMessage component="div" className="char__search-error" name="charName" />
        </Form>
      </Formik>
      {setContent(process, charList)}
    </div>
  );
};

export default CharSearchForm;
