import Spinner from "../components/spinner/Spinner";
import ErrorMessage from "../components/errorMessage/ErrorMessage";
import Skeleton from "../components/skeleton/Skeleton";

const setContent = (process, Component, data) => {
  switch (process) {
    case "waiting":
      return <Skeleton />;
    case "loading":
      return <Spinner />;
    case "confirmed":
      return <Component data={data} key={data.id} />;
    case "error":
      return <ErrorMessage />;
    default:
      throw new Error("Unecpected process state");
  }
};

export default setContent;
