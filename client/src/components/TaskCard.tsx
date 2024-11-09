import { useDrag } from 'react-dnd';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task } from 'db/schema';
import { useTasks } from "@/hooks/use-tasks";
import { format } from 'date-fns';
import { Trash2Icon } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { deleteTask } = useTasks();
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Card
      ref={drag}
      className={`p-3 cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <h4 className="font-medium">{task.title}</h4>
          <p className="text-sm text-muted-foreground">
            Due: {format(new Date(task.deadline), 'MMM d, yyyy')}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteTask(task.id)}
          className="h-8 w-8"
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
