export const logoutUser = async () => {
  const url = "http://localhost:8080/api/user/logout";

  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
    });

    if (response.status === 204 || response.ok) {
      return true;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error with logout of user", error);
    throw new Error("Error with logout of user");
  }
};
