import Spinner from "../components/spinner/Spinner";
import ErrorMessage from "../components/errorMessage/ErrorMessage";
import Skeleton from "../components/skeleton/Skeleton";

const setContent = (process, Component, data) => {
  switch (process) {
    case "waiting":
      return <Skeleton />;
      break;
    case "loading":
      return <Spinner />;
      break;
    case "confirmed":
      return <Component data={data} key={data.id} />;
      break;
    case "error":
      return <ErrorMessage />;
      break;
    default:
      throw new Error("Unecpected process state");
  }
};

export default setContent;
