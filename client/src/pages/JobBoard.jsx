import { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useJobs } from '../hooks/useJobs';
import JobCard from '../components/JobCard';
import { Link } from 'react-router-dom';
import { Plus, Loader2, Send, MessageSquare, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const COLUMNS = {
    Applied: {
        title: 'Applied',
        icon: Send,
        color: 'bg-blue-50/50 border-blue-100 text-blue-700',
        headerColor: 'text-blue-700 bg-blue-100/50'
    },
    Interview: {
        title: 'Interview',
        icon: MessageSquare,
        color: 'bg-purple-50/50 border-purple-100 text-purple-700',
        headerColor: 'text-purple-700 bg-purple-100/50'
    },
    Offer: {
        title: 'Offer',
        icon: CheckCircle,
        color: 'bg-teal/10 border-teal/20 text-teal-700',
        headerColor: 'text-teal-700 bg-teal/20'
    },
    Rejected: {
        title: 'Rejected',
        icon: XCircle,
        color: 'bg-red-50/50 border-red-100 text-red-700',
        headerColor: 'text-red-700 bg-red-100/50'
    },
    Ghosted: {
        title: 'Ghosted',
        icon: HelpCircle,
        color: 'bg-gray-100/50 border-gray-200 text-gray-600',
        headerColor: 'text-gray-600 bg-gray-200/50'
    }
};

const JobBoard = () => {
    const { jobs, isLoading, updateJob } = useJobs();
    const [boardData, setBoardData] = useState({});

    useEffect(() => {
        if (jobs) {
            const newBoardData = {
                Applied: [],
                Interview: [],
                Offer: [],
                Rejected: [],
                Ghosted: []
            };

            jobs.forEach(job => {
                if (newBoardData[job.status]) {
                    newBoardData[job.status].push(job);
                }
            });

            setBoardData(newBoardData);
        }
    }, [jobs]);

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const startColumn = source.droppableId;
        const finishColumn = destination.droppableId;

        const newBoardData = { ...boardData };

        if (startColumn === finishColumn) {
            const columnJobs = Array.from(newBoardData[startColumn]);
            const [movedJob] = columnJobs.splice(source.index, 1);
            columnJobs.splice(destination.index, 0, movedJob);
            newBoardData[startColumn] = columnJobs;
            setBoardData(newBoardData);
        } else {
            const startJobs = Array.from(newBoardData[startColumn]);
            const [movedJob] = startJobs.splice(source.index, 1);

            const finishJobs = Array.from(newBoardData[finishColumn]);
            finishJobs.splice(destination.index, 0, movedJob);

            newBoardData[startColumn] = startJobs;
            newBoardData[finishColumn] = finishJobs;
            setBoardData(newBoardData);

            updateJob({ id: draggableId, status: finishColumn });
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div>;
    }

    return (
        <div className="h-full flex flex-col bg-soft-white">
            <div className="flex justify-between items-center mb-8 px-1">
                <div>
                    <h1 className="text-3xl font-bold text-midnight tracking-tight">Job Board</h1>
                    <p className="text-gray-500 mt-1">Manage and track your applications</p>
                </div>
                <Link to="/add-job" className="btn-primary flex items-center shadow-lg shadow-teal/20 hover:shadow-teal/30 transition-shadow">
                    <Plus className="w-5 h-5 mr-2" />
                    New Application
                </Link>
            </div>

            <div className="flex-1 overflow-x-auto pb-6 scrollbar-hide">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 h-full min-w-[1200px] px-1">
                        {Object.entries(COLUMNS).map(([columnId, column]) => (
                            <div key={columnId} className="w-80 flex-shrink-0 flex flex-col">
                                {/* Column Header */}
                                <div className={`p-4 mb-4 rounded-xl border flex items-center justify-between shadow-sm bg-white ${column.color}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${column.headerColor}`}>
                                            <column.icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-bold text-midnight">{column.title}</h3>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-gray-600 border border-gray-100 shadow-sm">
                                        {boardData[columnId]?.length || 0}
                                    </span>
                                </div>

                                {/* Droppable Area */}
                                <div className="flex-1 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 p-2">
                                    <Droppable droppableId={columnId}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`h-full transition-colors rounded-lg overflow-y-auto custom-scrollbar p-1 ${snapshot.isDraggingOver ? 'bg-teal/5 ring-2 ring-teal/20 border-transparent' : ''
                                                    }`}
                                            >
                                                {boardData[columnId]?.map((job, index) => (
                                                    <JobCard key={job._id} job={job} index={index} />
                                                ))}
                                                {provided.placeholder}

                                                {boardData[columnId]?.length === 0 && !snapshot.isDraggingOver && (
                                                    <div className="h-32 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg m-2">
                                                        <Plus className="w-6 h-6 mb-2 opacity-50" />
                                                        <p className="text-xs font-medium">Drop items here</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

export default JobBoard;
