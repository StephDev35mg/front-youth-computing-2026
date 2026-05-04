import { useGetTasks } from '@/api/task/getAll.task.api'
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createFileRoute } from '@tanstack/react-router'
import {
  SearchIcon,
  EllipsisVertical,
  Edit2Icon,
  Trash2Icon,
  PlusIcon,
} from 'lucide-react'
import type { TaskData } from '@/interface/task.imterface'
export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { useCreateTask } from '#/api/task/create.task.api'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useDeleteTask } from '#/api/task/delete.task.api'

function RouteComponent() {
  const { data: Tasks, isPending, isError, refetch } = useGetTasks()
  const { mutate: createTask, isPending: isCreatingTask, isError: isCreateTaskError,isSuccess: isCreateTaskSuccess } = useCreateTask()
  const { mutate: deleteTask ,isSuccess: isDeleteTaskSuccess} = useDeleteTask()
  const totalTask = Tasks?.length || 0

  const [nameTask, setNameTask] = useState<string>('')
  const [imageTask, setImageTask] = useState<string>('')
  const [DescriptionTask, setDescriptionTask] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleCreateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    createTask({ nameTask, imageTask, DescriptionTask })
    setIsOpen(false)
  }
  const handleDeleteTask = (id: number) => {
    deleteTask(id)
    isDeleteTaskSuccess && toast.success('Task deleted successfully!')
  }
  useEffect(() => {
    isCreateTaskError && toast.error('Failed to create task. Please try again.')
    isCreateTaskSuccess && toast.success('Task created successfully!')
    refetch()
  }, [Tasks, isCreateTaskError, isCreateTaskSuccess, refetch])

  const resetAddForm = () => {
    setNameTask('')
    setImageTask('')
    setDescriptionTask('')
  }

  return (
    <section className='min-h-screen w-full bg-gray-50 p-8 flex flex-col items-center gap-8'>
      {/* HEADER */}
      <div className='w-full max-w-5xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <h1 className='text-3xl font-bold text-gray-800'>
          Total Tasks: <span className='text-primary'>{totalTask}</span>
        </h1>

        <div className='relative w-full md:w-1/2'>
          <SearchIcon className='w-5 h-5 absolute right-3 top-4 text-gray-400' />
          <Input
            className='w-full pl-4 pr-10 py-2 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-400'
            placeholder='Search task...'
          />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <Button>
              <PlusIcon className='w-5 h-5' />
              <span>add Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-sm'>
            <DialogHeader>
              <DialogTitle>
                {isCreatingTask ? 'Creating Task...' : 'Add Task'}
              </DialogTitle>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor='task-name'>Task Name</Label>
                <Input
                  id='task-name'
                  name='taskName'
                  value={nameTask}
                  onChange={(e) => setNameTask(e.target.value)}
                  placeholder='Enter task name'
                />
              </Field>
              <Field>
                <Label htmlFor='task-image'>Image URL</Label>
                <Input
                  id='task-image'
                  name='taskImage'
                  value={imageTask}
                  onChange={(e) => setImageTask(e.target.value)}
                  placeholder='Enter image URL'
                />
              </Field>
              <Field>
                <Label htmlFor='task-description'>Description</Label>
                <Input
                  id='task-description'
                  name='taskDescription'
                  value={DescriptionTask}
                  onChange={(e) => setDescriptionTask(e.target.value)}
                  placeholder='Enter task description'
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose>
                <Button variant='outline' onClick={resetAddForm}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleCreateTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* GRID */}
      <div className='w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {isPending && <p>Loading tasks...</p>}
        {isError && <p>Error occurred while fetching tasks.</p>}
        {Tasks?.map((item: TaskData) => (
          <Card
            key={item.id}
            className='group relative overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
          >
            {/* ICON BADGE */}

            <DropdownMenu>
              <DropdownMenuTrigger className='absolute top-3 right-3 bg-primary backdrop-blur-md rounded-full w-9 cursor-pointer p-2 shadow-md flex items-center justify-center'>
                <EllipsisVertical className='w-5 h-5 text-white' />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Edit2Icon className='w-7 h-7 text-green-500' />
                    <span className='text-green-500'>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteTask(item.id)}>
                    <Trash2Icon className='w-7 h-7 text-destructive' />
                    <span className='text-destructive'>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* IMAGE */}
            <div className='h-40 w-full overflow-hidden'>
              <img
                src={item.imageTask}
                alt={item.nameTask}
                className='h-full w-full object-cover'
              />
            </div>

            {/* CONTENT */}
            <div className='p-4 flex flex-col gap-2'>
              <CardTitle className='text-lg font-semibold text-gray-800'>
                {item.nameTask}
              </CardTitle>

              <CardDescription className='text-sm text-gray-500'>
                {item.DescriptionTask}
              </CardDescription>
            </div>

            {/* FOOTER */}
            <CardFooter className='px-4 pb-4 text-xs text-gray-400'>
              Task ID: #{item.id}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
