const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest



const api = (username) => {
  let url = `https://api.github.com/users/${username}/events/public`


  return new Promise((resolve, reject) => {
    console.log("Fetching data.....")
    let req = new XMLHttpRequest()

    req.open('GET', url, false);

    req.onload = () => {
      // check the status

      if (req.status == 200) {
        // Resolve the promise with the response text
        
        console.log(`REQUEST SUCCESS`)
        resolve(req.responseText);
      }
      else {
        // Otherwise reject with the status text
        
        console.log(`REQUEST FAILURE`)
        reject(Error("Invalid username"));
      }
    };
    
    // Handle network errors
    req.onerror = () => {
      console.log(`NETWORK ERROR CATCH`)
      reject(Error("Network Error"));
    };

    console.log(`MAKING REQUEST`)
    // Make the request
    req.send();
  })
}

module.exports = api;
