export const registerNewUser = async (
  userName: string,
  password: string,
  email: string
) => {
  const url = "http://localhost:8080/api/user/register";

  const requestBody = {
    username: userName,
    password: password,
    email: email,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("The response did not return ok.");
    }

    const data = await response.json();
    return data;
  } catch {
    throw new Error("The register new user query failed.");
  }
};
