// const api = "http://127.0.0.1:5000";
const crossrefApi = 'https://api.crossref.org';

let token = localStorage.token;

if (!token) {
  token = localStorage.token = 123;
}
const headers = {
  Accept: "application/json",
  Authorization: token
};

export const get = () =>
  fetch(`/bibtex`, { headers })
    .then(res => res.json());

export const update = body =>
  fetch(`/update`, {
  method: "POST",
  headers: {
    ...headers,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
}).then(res => res);

export const create = body =>
  fetch(`/bibtex`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).then(res => res.json());

export const getChangedBibtex = () =>
  fetch(`/changedBibtex`, {headers})
    .then(res => res.json());

export const searchAuthor = (title, author) =>
  fetch(`${crossrefApi}/works?query.bibliographic=${title}&query.author=${author}&rows=1`)
    .then(res => res.json());

export const searchMissingField = title =>
  fetch(`${crossrefApi}/works?query.bibliographic=${title}&rows=1`)
      .then(res => res.json());
