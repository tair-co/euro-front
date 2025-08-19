import { useState } from "react";

// data of servises
const INITIAL_SERVICES = [
  { name: "ChatterBlast", url: "chatter" },
  { name: "DreamWeaver", url: "generator" },
  { name: "MindReader", url: "recognizer" },
];

/**
 *
 * @returns screen of home
 */
const Home = () => {
  const [token, setToken] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    localStorage.setItem("token", token);
  };
  return (
    <>
      <h1 className=" mb-1">HOME</h1>
      <p>*Enter Token to use AI Services</p>
      <form className="" onSubmit={submitHandler}>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your token"
          onChange={(e) => setToken(e.target.value)}
        />
        <button type="submit" className="btn btn-primary mt-2">
          Submit
        </button>
      </form>
      <div style={{ marginTop: "20px" }} className="mt-5">
        <h2>Enabled Services:</h2>
        <ul className="list-group home__list">
          {INITIAL_SERVICES.sort((a, b) => a.name.localeCompare(b.name)).map(
            (item, index) => (
              <li key={index} className=" list-group-item">
                <a className=" link " href={`${item.url}`}>
                  {item.name}
                </a>
              </li>
            )
          )}
        </ul>
      </div>
    </>
  );
};

export default Home;
