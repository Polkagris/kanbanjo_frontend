import { TableCell } from "@/components/ui/table";
import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface BoardColumnProps {
  id: string;
  className: string;
  children?: ReactNode;
  columnId: number;
}

export const BoardColumn = ({ id, className, children }: BoardColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const style = {
    background: isOver ? "#e0ffe0" : "#f3f3f3",
    padding: 16,
    borderRadius: 8,
    minHeight: 200,
  };

  return (
    <TableCell className={className} ref={setNodeRef} style={style}>
      {children}
    </TableCell>
  );
};
