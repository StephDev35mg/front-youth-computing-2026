import apiClient from "../main.api";
import { CREATE_TASK } from "@/constants/api.constant";
import { AxiosErrorCustom } from "../axios.error.custom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateTaskData {
  nameTask: string
  imageTask: string
  DescriptionTask: string
}

export const createTask = async (taskData: CreateTaskData) => {
  try {
    const response = await apiClient.post(CREATE_TASK, taskData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new AxiosErrorCustom(error);
  }
}

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

