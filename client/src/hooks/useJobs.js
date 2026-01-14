import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

export const useJobs = () => {
    const { api } = useAuth();
    const queryClient = useQueryClient();

    const { data: jobs, isLoading, error } = useQuery({
        queryKey: ['jobs'],
        queryFn: async () => {
            const { data } = await api.get('/jobs');
            return data.data;
        }
    });

    const createJobMutation = useMutation({
        mutationFn: async (newJob) => {
            const { data } = await api.post('/jobs', newJob);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['jobs']);
            queryClient.invalidateQueries(['dashboardStats']);
        }
    });

    const updateJobMutation = useMutation({
        mutationFn: async ({ id, ...updates }) => {
            const { data } = await api.put(`/jobs/${id}`, updates);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['jobs']);
            queryClient.invalidateQueries(['dashboardStats']);
        }
    });

    const deleteJobMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/jobs/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['jobs']);
            queryClient.invalidateQueries(['dashboardStats']);
        }
    });

    return {
        jobs,
        isLoading,
        error,
        createJob: createJobMutation.mutate,
        updateJob: updateJobMutation.mutate,
        deleteJob: deleteJobMutation.mutate,
        isCreating: createJobMutation.isPending,
        isUpdating: updateJobMutation.isPending,
        isDeleting: deleteJobMutation.isPending
    };
};
