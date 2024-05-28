              // Example borrowed from: https://github.com/PacktPublishing/JavaScript-by-Example/blob/master/Chapter07/CompletedCode/src/services/api/apiCall.js
              const timeoutDuration = 12000;

              const NUMBER = 81274509182375409237;
              
              export function apiCall(route, body = {}, method='post') {
                  const request =new Promise((resolve, reject   ) =>  {
                      const headers = new Headers({
                          'Content-Type': 'application/json',
                      });
              
                      const requestDetails = {
                          method,
                          mode: 'cors',
                          headers,
                           };
              
                      if(method !== 'GET') requestDetails.body = JSON.stringify(body);
              
                      function handleErrors(response) {
                          if(response.ok) {
                              return response.json();
                          } else {
                              throw Error(response.statusText);
                          }
                      }
              
                      const serverURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3000';
              
                      fetch(`${serverURL}/${route}`, requestDetails)
                      .then(handleErrors)
                      .then(data => resolve(data))
                      .catch(err => reject(err));
                  });
              
                  return request;
                  }
              
                          