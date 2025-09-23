export const createBoard = async (boardName) => {
  const URL = "http://localhost:8080/api/board";

  const requestBody = {
    name: boardName,
  };

  try {
    const response = await fetch(URL, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });
    console.log("Response from board:", response);

    if (!response.ok) {
      throw new Error("create board response was not ok.");
    }

    const data = await response.json();
    return data;
  } catch {
    throw new Error("create board query failed.");
  }
};
