export const getBoard = async (
  taskName,
  taskDescription,
  taskParticipant,
  boardId
) => {
  const URL = `http://localhost:8080/api/board/${boardId}`;

  try {
    const response = await fetch(URL, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    console.log("Response from task:", response);

    if (!response.ok) {
      throw new Error("create task response was not ok.");
    }

    const data = await response.json();
    return data;
  } catch {
    throw new Error("create task query failed.");
  }
};
