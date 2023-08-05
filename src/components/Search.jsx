import React, { useEffect, useState, useRef } from "react";
import { currentMonitor, getCurrent } from "@tauri-apps/api/window";

export default function Wrapper() {
  const [suggestions, setSuggestions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isAutocompleteActive, setIsAutocompleteActive] = useState(false);
  const [contentData, setContentData] = useState([]);
  const pythonBackendIURL = "https://nlp.spoolapp.co";
  const existingDomain = localStorage.getItem("domain");
  const autocomBox = useRef(null);

 

  async function resizeWindow(width, height) {
    const monitor = await currentMonitor();
    const physicalSize = await getCurrent().innerSize();
    const scaleFactor = monitor.scaleFactor;
    const logicalSize = physicalSize.toLogical(scaleFactor);
    const minWidth = width;
    const minHeight = height;

    if (logicalSize.width !== minWidth || logicalSize.height !== minHeight) {
      logicalSize.width = minWidth;
      logicalSize.height = minHeight;
      await getCurrent().setSize(logicalSize);
    }
  }

  let getKeySearch = (obj) => {
    return fetch(`${pythonBackendIURL}/keysearch`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
  };


  const addContent = (res) => {
    setContentData(res);
  };

  function select(element) {
    let selectData = element.textContent;
    setSearchText(selectData);

    getKeySearch({
      keyword: `${selectData}`,
      domain: `${localStorage.getItem("domain")}`,
    }).then((response) => {
      response.json().then((resObj) => {
        addcontent(resObj);
        console.log(resObj);

        ////changes by deval - 15/07, to record user click event BEGIN
        let ID = localStorage.getItem("userID");
        let obj = selectData;
        let beURL = "https://api.spoolapp.co/adminPanel";
        return fetch(`${beURL}/putUserSearch/${ID}/${selectData}`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
        });
      });
    });

    searchText.classList.remove("active");
  }
  function showSuggestions(list) {
    let listData;
    if (!list.length) {
      listData = '<li class="no-results">No results found</li>';
    } else {
      listData = list.join("");
    }

    if (autocomBox.current) {
      autocomBox.current.style.display = "block";
      const height = autocomBox.current.clientHeight + 155;
      resizeWindow(300, height).catch(console.error);
    }
  }

  function showSuggestions(list) {
    let listData;
    if (!list.length) {
      listData = '<li class="no-results">No results found</li>';
    } else {
      listData = list.join("");
    }

    setIsAutocompleteActive(true)
    if(autocomBox.current){
      const height = autocomBox.current.clientHeight + 155;
      resizeWindow(300,height).catch(console.error)
          }
  }

  async function fetchKeyword(obj) {
    try {
      const response = await fetch(`${pythonBackendIURL}/getKeywords`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json(); // Parse the response body as JSON
      return data;
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  }

  useEffect(() => {
    resizeWindow(300, 155).catch(console.error);
  }, []);

  useEffect(() => {
    if (autocomBox.current) {
      const height = autocomBox.current.clientheight + 155;
      if (height > 400) {
        height = 400;
        // div.style.overflowY = "auto";
      }
      resizeWindow(300, height).catch(console.error);
    }

    let emptyArray = [];
    let checkarray = [];
    let checkdata = true;
    let suggestions = [];

    if (searchText) {
      checkarray = suggestions.map((data) => {
        if (data === undefined) {
          checkdata = false;
        }
      });

      if (checkdata) {
        emptyArray = suggestions.filter((data) => {
          return data
            .toLocaleLowerCase()
            .startsWith(searchText.toLocaleLowerCase());
        });

        emptyArray = emptyArray.map((data) => {
          return (data = `<li>${data}</li>`);
        });
        setIsAutocompleteActive(true); //show
        showSuggestions(emptyArray);
        for (let i = 0; i < allList.length; i++) {
          const li = allList[i];
          li.onclick = function () {
            select(this);
          };
        }
      } else {
        setIsAutocompleteActive(true); //show
        emptyArray.push('<li class="no-results">No results found</li>');
        showSuggestions(emptyArray);
      }
    } else {
      setIsAutocompleteActive(false); //hide
    }

setContentData([])
// resizeWindow(300,contentdiv.height)

console.log(suggestions);
    if (suggestions.length === 0) {
      console.log("suggestion array empty");
    }

    fetchKeyword({ companyDomain: `${existingDomain}` })
      .then((resObj) => {
        suggestions = suggestions.concat(resObj.data.keyword);
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Error fetching data:", error);
      });

if (autocomBox.current) {
      autocomBox.current.style.display = "block";
      const height = autocomBox.current.clientHeight + 155;
      resizeWindow(300,350+ height).catch(console.error);
    }

    fetchKeyword({ companyDomain: `${existingDomain}` })
      .then((resObj) => {
        setSuggestions(suggestions.concat(resObj.data.keyword));
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Error fetching data:", error);
      });

    console.log(suggestions);

    if (suggestions.length === 0) {
      console.log("suggestion array empty");
    }

    async function fetchSuggestions() {
      try {
        // Replace this with the appropriate API call to fetch suggestions from the backend
        const suggestionsFromBackend = await fetchSuggestionsFromBackend();
        setSuggestions(suggestionsFromBackend);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }

    resizeWindow(300, 350).catch(console.error);

    fetchSuggestions();
  }, [searchText]);

  const handleInputChange = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);
    if (searchText == "") {
      setIsAutocompleteActive(false);
    } else {
      const emptyArray = suggestions.filter((data) =>
        data.toLowerCase().startsWith(searchText.toLowerCase())
      );

      setIsAutocompleteActive(true);
    }
    // showSuggestions(emptyArray);
  };

  const handleClearInput = () => {
    setSearchText("");
    setIsAutocompleteActive(false);
  };

  const handleSelect = (element) => {
    const selectData = element.textContent;
    setSearchText(selectData);
    setIsAutocompleteActive(false);

    // Call the function to process the selected data
    getKeySearch({
      keyword: selectData,
      domain: localStorage.getItem("domain"),
    }).then((response) => {
      response.json().then((resObj) => {
        addContent(resObj);
        console.log(resObj);
      });
    });
  };

  return (
    <>
      {/* <div className="UserLogin">
        <h2>Search</h2>
      </div> */}

      <div className="wrapper">
        <div className="search-input" id="searchbox">
          <div id="search-bar-btn">
            <input
              type="text"
              placeholder="Type to search.."
              id="search-input"
              value={searchText}
              onChange={handleInputChange}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              fill="black"
              className="bi bi-x-lg"
              viewBox="0 0 16 16"
              onClick={handleClearInput}
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
            </svg>
          </div>

          {isAutocompleteActive && (
            <div className="autocom-box" id="autocom-div" ref={autocomBox}>
              {suggestions.map((data, index) => (
                <div
                  key={index}
                  className="suggestion"
                  onClick={() => handleSelect(data)}
                >
                  {data}
                </div>
              ))}
            </div>
          )}
        </div>

        <div id="content-div">
          {contentData.map((item, index) => (
            <div key={index} className="content">
              <button
                className="collapsible"
                style={{
                  backgroundColor: index % 2 !== 0 ? "black" : "#ffc905",
                  color: index % 2 !== 0 ? "white" : "black",
                }}
              >
                {item.sub_cat}
              </button>
              <div className="content-text">{item.message}</div>
            </div>
          ))}
        </div>
        {/* <button onClick={resizeWindow(300,155)}>Resize</button> */}
      </div>
    </>
  );
}
