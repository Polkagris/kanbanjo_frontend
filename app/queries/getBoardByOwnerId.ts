export const getBoardByOwnerId = async () => {
  const URL = `http://localhost:8080/api/board/mine`;

  try {
    const response = await fetch(URL, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    console.log("Response from owner boards:", response);

    if (!response.ok) {
      throw new Error("Failed to get boards by owner Id - bad response");
    }

    const data = await response.json();
    console.log("data from getBoardByOwnerId query:", data);
    return data;
  } catch {
    console.error("Failed to get boards by owner Id");
  }
};
