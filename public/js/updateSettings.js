import { showAlert } from "./alerts";

// type will be data or password
export const updateData = async (data, type) => {
  let body;
  // local
  // const url = `http://localhost:3000/api/v1/users/${type === "data" ? "update-me" : "update-my-password"}`;
  const url = `/api/v1/users/${type === "data" ? "update-me" : "update-my-password"}`;
  const options = {
    method: "PATCH",
  };
  if (type === "data") {
    body = new FormData();
    Object.keys(data).forEach((key) => body.append(key, data[key]));
  } else {
    body = JSON.stringify(data);
    options.headers = { "Content-Type": "application/json" };
  }
  options.body = body;
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (data.status === "success") {
      showAlert("success", "update data successfully");
    } else {
      showAlert("error", data.message);
    }
  } catch (error) {
    showAlert("error", error.message);
  }
};
