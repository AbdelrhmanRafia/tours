import { showAlert } from "./alerts";
export const login = async (email, password) => {
  const body = JSON.stringify({ email, password });
  // local
  // const url = "http://localhost:3000/api/v1/users/login";
  const url = "api/v1/users/login";
  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (data.status === "success") {
      showAlert("success", "logged in successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    } else {
      showAlert("error", data.message);
    }
  } catch (error) {
    console.log(error);
  }
};
export const logout = async () => {
  // local
  // const url = "http://localhost:3000/api/v1/users/logout";
  const url = "/api/v1/users/logout";
  const options = {
    method: "GET",
    headers: { "content-type": "application/json" },
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (data.status === "success") {
      location.reload(true);
    } else {
      showAlert("error", data.message);
    }
  } catch (error) {
    console.log(error);
  }
};

export const signup = async (data) => {
  console.log(data);
  console.log(JSON.stringify(data));

  // local
  // const url = "http://localhost:3000/api/v1/users/signup";
  const url = "/api/v1/users/signup";
  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    if (data.status === "success") {
      showAlert("success", "user signup successfully");
      setTimeout(() => {
        location.assign("/");
      }, 1500);
    } else {
      showAlert("error", data?.message);
    }
  } catch (error) {
    showAlert("error", error?.message);
  }
};
