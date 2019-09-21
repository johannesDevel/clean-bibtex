const api = "http://127.0.0.1:5001";

let token = localStorage.token;

if (!token) {
  token = localStorage.token = 123;
}
const headers = {
  Accept: "application/json",
  Authorization: token
};

export const get = () =>
  fetch(`${api}/bibtex`, { headers })
    .then(res => res.json())
    .then(data => data.foundErrors);

export const create = body =>
  fetch(`${api}/bibtex`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).then(res => res.json());
