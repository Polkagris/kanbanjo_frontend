export const createTask = async (
  taskName,
  taskDescription,
  taskParticipant,
  boardId
) => {
  const URL = `http://localhost:8080/api/task/create/${boardId}`;

  const requestBody = {
    name: taskName,
    description: taskDescription,
    participant: taskParticipant,
  };

  try {
    const response = await fetch(URL, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(requestBody),
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
