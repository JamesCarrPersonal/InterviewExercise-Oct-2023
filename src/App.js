import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [isloading, setIsloading] = useState(true);
  const [openData, setOpenData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/OpenDay.json`)
      .then((response) => {
        setOpenData(response.data);
        setIsloading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    var filteredData = [];
    if (openData && openData.topics) {
      filteredData = openData.topics.filter((searchedObj) => {
        var searchString = searchedObj.name + searchedObj.description;
        searchedObj.programs.forEach((element) => {
          searchString += element.title + element.description_short;
        });
        return searchString.toLowerCase().includes(searchInput.toLowerCase());
      });
    }
    setFilteredResults(filteredData);
  }, [openData, searchInput]);

  function ProgramCard(prog) {
    return (
      <li id={prog.id}>
        <div className="program">
          <h3>{prog.title}</h3>
          <p>{prog.description_short}</p>
          <p>
            Location: <a href={prog.location.website}>{prog.room}</a>
            <img className="locThumb" src={prog.location.cover_image} />
          </p>
        </div>
      </li>
    );
  }

  function TopicCard(data) {
    return (
      <article className={"card"} key={"index_" + data.id}>
        <img className="thumb" src={data.cover_image} alt={data.name} />
        <h2 className="name">{data.name}</h2>
        <p className="descr">{data.description}</p>
        <h5>
          Available Programs:{" "}
          <button
            onClick={(e) =>
              e.target.parentElement.parentElement.classList.toggle("expand")
            }
          >
            Expand List
          </button>
        </h5>
        <ul id={data.id}>{data.programs.map((prog) => ProgramCard(prog))}</ul>
      </article>
    );
  }

  return (
    <div className="App">
      <header className="header">
        <h1 className="page-title">{openData.description}</h1>

        <form className="form-input-group">
          <label className="search-input-label" htmlFor="search">
            <input
              className="search-input"
              type="search"
              name="search"
              id="search"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              required
            />
          </label>
        </form>
      </header>

      <main>
        {isloading ? (
          <p className="message">loading...</p>
        ) : (
          <section className="cards-wrapper">
            {searchInput == ""
              ? openData.topics.map((data) => TopicCard(data))
              : filteredResults.map((data) => TopicCard(data))}
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
