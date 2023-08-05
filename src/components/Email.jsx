import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

let getDomain = (authId) => {
  ////please note getDomain is called from playbook route on main server and not NLP server1
  ////coz user records are on main server and not NLP server.
  let playbookMaps_url = "https://api.spoolapp.co/playbookMaps";
  return fetch(`${playbookMaps_url}/getDomain/${authId}`);
};

let validateUser = (email) => {
  let beURL = "https://api.spoolapp.co/adminPanel";
  return fetch(`${beURL}/getIDfromEmail/${email}`);
};

function validateEmail(email) {
  var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}

// Function to extract domain from email
function extractDomain(email) {
  var atIndex = email.indexOf("@");
  if (atIndex !== -1) {
    return email.substring(atIndex + 1);
  }
  return "";
}

const Email = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [domain, setDomain] = useState("");
  const [showDomainError, setShowDomainError] = useState(false);
  const [firstTime, setFirstTime] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  //Checks if it is the index path and if user has already logged in if so then navigates to search
  useEffect(() => {
    console.log(location.pathname);
    if (localStorage.getItem("userEmail") && location.pathname == "/") {
      if (
        localStorage.getItem("userEmail") != "" &&
        localStorage.getItem("domain") != ""
      ) {
        console.log(localStorage.getItem("userEmail"));
        navigate("/search");
      }
    }
  }, []);

  useEffect(() => {
    // Check if "firsttime" key exists in localStorage
    const storedFirstTime = localStorage.getItem("firsttime");
    if (storedFirstTime !== null) {
      setFirstTime(storedFirstTime === "true");
    } else {
      localStorage.setItem("firsttime", "true");
      setFirstTime(true);
    }
    resizeWindow(300, 350);
  }, [firstTime, location.pathname]);

  const handleEmailChange = (e) => {
    const newEmail = e.target.value.trim();
    setEmail(newEmail);
    console.log(email);
    // Validate the email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // Extract the domain from the email
    if (emailRegex.test(newEmail)) {
      const atIndex = newEmail.indexOf("@");
      setDomain(newEmail.substring(atIndex + 1));
      console.log(domain);
      setShowDomainError(false);
    } else {
      setDomain("");
    }
  };

  function navigateToPage() {
    setIsValidEmail(validateEmail(email));

    // Validate the email
    if (validateEmail(email)) {
      // Extract the domain from the email
      var domain = extractDomain(email);

      // Check if the domain is present in the array
      var domainsArray = [
        "gmail.com",
        "outlook.com",
        "reddit.com",
        "reddifmail.com",
        "redifmail.com",
        "rediffmail.com",
        "zoho.com",
        "yandex.com",
        "icloud.com",
        "proton.com",
        "aol.com",
        "yahooo.com",
        "youtube.com",
        "instagram.com",
        "facebook.com",
        "amazon.com",
      ]; // Replace with your array of domains
      var isInArray = domainsArray.includes(domain);
      if (isInArray) {
        setShowDomainError(true);
      }
      var userID = "-1";
       //dummy navigation --do not use in production
      // localStorage.setItem("firsttime", "false");//DEVONLY
      // localStorage.setItem("userEmail", email);//DEVONLY
      // localStorage.setItem("domain", domain); //DEVONLY
      // localStorage.setItem("userID", "userID-DUMMY"+email);//DEVONLY
      // console.log(email, domain, userID);
      // navigate("/search");//DEVONLY

      validateUser(email).then((response) => {
        response.json().then((resObj) => {
          if (resObj == "-1") {
            setIsValidEmail(false);
          } else {
            userID = resObj._id;
            getDomain(userID).then((response) => {
              response.text().then((resObj) => {
                if (resObj == "") {
                  setIsValidEmail(false);
                } else {
                  domain = resObj;
                  localStorage.setItem("userEmail", email); // Add email value to localStorage
                  localStorage.setItem("domain", domain); // Add domain value to localStorage
                  localStorage.setItem("userID", userID);
                  localStorage.setItem("firsttime", "false");
                  navigate("/search");
                }
              });
            });
          }
        });
      });
      ////changes by deval - 11/07, to check if user is valid n get its ID END
    }
  }
  return (
    <>
      <div className="UserLogin">
        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            navigateToPage();
          }}
        >
          <div className="UserLogin">
            <label htmlFor="email">
              {firstTime ? <h2>Sign Up</h2> : <h2>Details Page</h2>}
            </label>
          </div>
          {!firstTime && <p>Enter Email to be updated:</p>}
          <input
            type="email"
            id="Emailvalue"
            name="email"
            onChange={handleEmailChange}
            value={email}
            placeholder="Enter your business email-id"
          />
          <button type="submit" id="signup">
            {firstTime ? "Sign Up" : "Change"}
          </button>
        </form>
        {!isValidEmail && (
          <span className="Error" id="emailError">
            Enter a valid email address
          </span>
        )}
        {showDomainError && (
          <span className="Error" id="domainError">
            Domain Name is invalid, Please enter a valid company email address
          </span>
        )}
        {domain && (
          <span className="Domainname">
            Selected Domain: <span id="selectedDomain">{domain}</span>
          </span>
        )}

        {!firstTime && (
          <Link to="/search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="white"
              className="bi bi-arrow-left"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
              />
            </svg>
          </Link>
        )}
      </div>
    </>
  );
};

export default Email;
