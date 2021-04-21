import axios from "axios";
const API_SERVER = process.env.REACT_APP_API_SERVER;

async function get(endpoint, headers, params) {
  let url = API_SERVER + endpoint;
  return await axios
    .get(url, { headers: headers, params: params })
    .then(function (res) {
      return res;
    })
    .catch(function (err) {
      return err.response;
    });
}

export async function getVideos(data) {
  let url = "/videos/?search=" + data["query"] + "&order=" + data["order"];
  return await get(url, {}, {});
}
