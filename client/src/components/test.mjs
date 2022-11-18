import fetch from "node-fetch";
const getData = async () => {
  try {
    const response = await fetch("http://localhost:4020/initialize");
    const data = await response.json();
    console.log(data);
  } catch (e) {
    console.log(e);
  }
};

getData();
