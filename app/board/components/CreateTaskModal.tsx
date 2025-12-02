import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DialogProps {
  openModal: boolean;
  setOpenModal: (arg: boolean) => void;
  taskName: string;
  setTaskName: (arg: string) => void;
  taskDescription: string;
  setTaskDescription: (arg: string) => void;
  handleCreateTask: () => void;
}

export const DialogModal = ({
  openModal,
  setOpenModal,
  taskName,
  setTaskName,
  taskDescription,
  setTaskDescription,
  handleCreateTask,
}: DialogProps) => {
  console.log("🚀 ~ DialogModal ~ openModal:", openModal);

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new task</DialogTitle>
          <DialogDescription>
            Add information for this specific task
          </DialogDescription>
          <div className="flex flex-col items-center gap-2">
            <div className="flex w-full">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>
            <div className="flex w-full">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="default"
            onClick={() => handleCreateTask()}
          >
            Create
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpenModal(false)}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
