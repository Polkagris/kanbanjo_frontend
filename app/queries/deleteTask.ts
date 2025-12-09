export const deleteTask = async (taskId: number) => {
  const URL = `http://localhost:8080/api/task/delete/${taskId}`;

  try {
    const response = await fetch(URL, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    console.log("Response from task:", response);
    console.log("Delete task id:", taskId);

    if (!response.ok) {
      throw new Error("delete task response was not ok.");
    }

    return { success: true };
  } catch (error) {
    throw new Error("delete task query failed.");
  }
};
