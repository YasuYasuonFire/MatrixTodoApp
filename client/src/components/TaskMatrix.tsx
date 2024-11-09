import { useDrop } from 'react-dnd';
import { Card } from "@/components/ui/card";
import TaskCard from "./TaskCard";
import { useTasks } from "@/hooks/use-tasks";

const QUADRANTS = [
  { id: 'important-urgent', title: 'Do', color: 'bg-red-500/10 dark:bg-red-500/20' },
  { id: 'important-not-urgent', title: 'Schedule', color: 'bg-blue-500/10 dark:bg-blue-500/20' },
  { id: 'not-important-urgent', title: 'Delegate', color: 'bg-yellow-500/10 dark:bg-yellow-500/20' },
  { id: 'not-important-not-urgent', title: 'Eliminate', color: 'bg-gray-500/10 dark:bg-gray-500/20' }
];

export default function TaskMatrix() {
  const { tasks, updateTask } = useTasks();

  const getQuadrantTasks = (important: boolean, urgent: boolean) => {
    return tasks?.filter(task => task.important === important && task.urgent === urgent) || [];
  };

  const renderQuadrant = (important: boolean, urgent: boolean, title: string, color: string) => {
    const quadrantTasks = getQuadrantTasks(important, urgent);
    
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'task',
      drop: (item: { id: number }) => {
        updateTask(item.id, { important, urgent });
      },
      collect: monitor => ({
        isOver: !!monitor.isOver(),
      }),
    }));

    return (
      <Card
        ref={drop}
        className={`p-4 h-full ${color} ${isOver ? 'ring-2 ring-primary' : ''}`}
      >
        <h3 className="font-semibold mb-4">{title}</h3>
        <div className="space-y-2">
          {quadrantTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-200px)]">
      {QUADRANTS.map((quadrant, index) => {
        const important = index < 2;
        const urgent = index % 2 === 0;
        return (
          <div key={quadrant.id}>
            {renderQuadrant(important, urgent, quadrant.title, quadrant.color)}
          </div>
        );
      })}
    </div>
  );
}
