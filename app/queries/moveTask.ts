export const moveTask = async (taskId: number, swimlaneId: number) => {
  try {
    const URL = `http://localhost:8080/api/task/${taskId}/move/${swimlaneId}`;

    const response = await fetch(URL, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("move task response was not ok.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error with moving task:", error);
    throw new Error("Error caused by moving task");
  }
};
