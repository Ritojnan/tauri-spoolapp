import React, { useEffect, useState } from "react";
import { currentMonitor, getCurrent } from "@tauri-apps/api/window";

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
export default function Wrapper() {
  const [suggestions, setSuggestions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isAutocompleteActive, setIsAutocompleteActive] = useState(false);
  const [contentData, setContentData] = useState(["e","r","f"]);
  const pythonBackendIURL = "https://nlp.spoolapp.co";
  const existingDomain = localStorage.getItem("domain");


  
  function select(element) {
    let selectData = element.textContent;
    searchInput.value = selectData;

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

    searchInput.classList.remove("active");
  }
  function showSuggestions(list) {
    let listData;
    if (!list.length) {
      listData = '<li class="no-results">No results found</li>';
    } else {
      listData = list.join("");
    }
    AutocomBox.innerHTML = listData;

    const div = document.getElementById("autocom-div");
    div.style.display = "block";
    const width = 300;
    const height = div.clientHeight + 155;
    ipcRenderer.send("resize-me-please", { width, height });
  }

  // useEffect(() => {
  //   let height = div.clientHeight + 155;
  //   if (height > 400) {
  //     height = 400;
  //     div.style.overflowY = "auto";
  //   }
  //   resizeWindow(width, height).catch(console.error);
  // };
  //   let userData = {searchText}
  //   let emptyArray = [];
  //   let checkarray = [];
  //   let checkdata = true;
  //   if (userData) {
  //     checkarray = suggestions.map((data) => {
  //       if (data === undefined) {
  //         checkdata = false;
  //       }
  //     });

  //     if (checkdata) {
  //       emptyArray = suggestions.filter((data) => {
  //         return data
  //           .toLocaleLowerCase()
  //           .startsWith(userData.toLocaleLowerCase());
  //       });
  //       emptyArray = emptyArray.map((data) => {
  //         return (data = `<li>${data}</li>`);
  //       });
  //       searchInput.classList.add("active"); //show autocomplete box
  //       showSuggestions(emptyArray);
  //       let allList = AutocomBox.querySelectorAll("li");
  //       for (let i = 0; i < allList.length; i++) {
  //         const li = allList[i];
  //         li.onclick = function () {
  //           select(this);
  //         };
  //       }
  //     } else {
  //       searchInput.classList.add("active"); //show autocomplete box
  //       emptyArray.push('<li class="no-results">No results found</li>');
  //       showSuggestions(emptyArray);
  //     }
  //   } else {
  //     searchInput.classList.remove("active"); //hide autocomplete box
  //   }
    
  // // searchInput.addEventListener("click", function () {
  // //   const div = document.getElementById("autocom-div");
  // //   const width = 300;
  // //   const height = div.clientHeight + 155;
  // //   div.innerHTML = "";
  // //   div.style.display = "none";
  // //   ipcRenderer.send("resize-me-please", { width, height });
  // // });


  // console.log(suggestions);
  // if (suggestions.length === 0) {
  //   console.log("suggestion array empty");
  // }
  

  //   async function fetchKeyword(obj) {
  //     try {
  //       const response = await fetch(`${pythonBackendIURL}/getKeywords`, {
  //         method: "post",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(obj),
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch data");
  //       }

  //       const data = await response.json(); // Parse the response body as JSON
  //       return data;
  //     } catch (error) {
  //       console.log("Error:", error);
  //       throw error;
  //     }
  //   }

  //   async function fetchSuggestionsFromBackend() {
  //     // Implement the logic to fetch suggestions from the backend here
  //     // For example:
  //     // const response = await fetch('API_ENDPOINT');
  //     // const data = await response.json();
  //     // return data;
  //     return ["suggestion1", "suggestion2", "suggestion3"];
  //   }

  //   // const div = document.getElementById("autocom-div");
  //   // let height =div.clientHeight;
  //   // if (height==null){height=0}
  //   // resizeWindow(300, 350 + div.clientHeight);

  //   fetchKeyword({ companyDomain: `${existingDomain}` })
  //     .then((resObj) => {
  //       setSuggestions(suggestions.concat(resObj.data.keyword));
  //     })
  //     .catch((error) => {
  //       // Handle any errors that occurred during the fetch
  //       console.error("Error fetching data:", error);
  //     });

  //   console.log(suggestions);

  //   if (suggestions.length === 0) {
  //     console.log("suggestion array empty");
  //   }

  //   async function fetchSuggestions() {
  //     try {
  //       // Replace this with the appropriate API call to fetch suggestions from the backend
  //       const suggestionsFromBackend = await fetchSuggestionsFromBackend();
  //       setSuggestions(suggestionsFromBackend);
  //     } catch (error) {
  //       console.error("Error fetching suggestions:", error);
  //     }
  //   }

  //   resizeWindow(300, 350).catch(console.error);

  //   fetchSuggestions();
  // }, [searchText]);

  const handleInputChange = (e) => {
    
    const searchText = e.target.value;
    setSearchText(searchText);
    if(searchText==""){setIsAutocompleteActive(false)}
    else{
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

  const addContent = (res) => {
    setContentData(res);

      const values = res;

      const dataContainer = document.contentdiv

      if (dataContainer.innerHTML.trim() === "") {
      } else {
        dataContainer.innerHTML = "";
      }

      values.map((item, index) => {
        var button = document.createElement("button");
        button.className = "collapsible";
        button.textContent = item.sub_cat;
        button.style.backgroundColor = index % 2 !== 0 ? "black" : "#ffc905";
        button.style.color = index % 2 !== 0 ? "white" : "black";
        var content = document.createElement("div");
        content.className = "content";
        content.innerHTML = item.message;

        button.addEventListener("click", function () {
          this.classList.toggle("active");
          resizeWindow(300, 400).catch(console.error);

        // searchInput.addEventListener("click", function () {
        //   const div = document.getElementById("autocom-div");
        //   const width = 300;
        //   const height = div.clientHeight + 155;
        //   ipcRenderer.send("resize-me-please", { width, height });
        // });

          if (content.style.display === "block") {
            content.style.display = "none";
          } else {
            content.style.display = "block";
          }
        });

        dataContainer.appendChild(button);
        dataContainer.appendChild(content);
      });
    

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

  

  return (
    <>

        <div className="UserLogin">
          <h2>Search</h2>
        </div>

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
          
          { isAutocompleteActive && (
            <div className="autocom-box" id="autocom-div">
              {["one","two"].map((data, index) => (
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
      </div>
    </>
  );
}
