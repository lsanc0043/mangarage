import fetch from "node-fetch";
const getData = async () => {
  const response = await fetch("http://localhost:4020/initialize");
  const data = await response.json();
  console.log(data);
};

getData();
