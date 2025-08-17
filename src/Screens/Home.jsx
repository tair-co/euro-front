import Card from "../UI/Card";

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
  return (
    <Card>
      <h1 className=" mb-1">HOME</h1>
      <div style={{ marginTop: "20px" }} className="mt-5">
        <h2>Enabled Services:</h2>
        <ul className="list-group home__list">
          {INITIAL_SERVICES.map((item, index) => (
            <li key={index} className=" list-group-item">
              <a className=" link " href={`${item.url}`}>
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default Home;
