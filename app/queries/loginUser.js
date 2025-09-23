export const loginUser = async (userName, password) => {
  const url = "http://localhost:8080/api/user/login";

  const requestBody = {
    username: userName,
    password: password,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("The response did not return ok.");
    }

    const data = await response.json();
    return data;
  } catch {
    throw new Error("The login user query failed.");
  }
};
