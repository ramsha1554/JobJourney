import { Draggable } from '@hello-pangea/dnd';
import { Building2, MapPin, CalendarClock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const JobCard = ({ job, index }) => {
    return (
        <Draggable draggableId={job._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white p-6 rounded-xl border border-gray-100 mb-4 transition-all duration-300 ease-out
                        ${snapshot.isDragging
                            ? 'shadow-2xl ring-1 ring-teal scale-[1.02] z-50'
                            : 'shadow-sm hover:shadow-lg hover:-translate-y-1'}`}
                    style={provided.draggableProps.style}
                >
                    <Link to={`/jobs/${job._id}`} className="block group">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold text-midnight leading-tight group-hover:text-teal transition-colors">
                                {job.title}
                            </h4>
                            {job.salary && (
                                <span className="text-[10px] font-medium bg-gray-50 text-gray-500 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                                    {job.salary}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col space-y-1.5 mb-4">
                            <div className="flex items-center text-sm font-medium text-gray-600">
                                <Building2 className="w-3.5 h-3.5 mr-2 text-teal" />
                                <span className="truncate">{job.company}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-400">
                                <MapPin className="w-3.5 h-3.5 mr-2" />
                                <span className="truncate">{job.location}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-50 pt-3 flex items-center justify-between text-xs text-gray-400">
                            <div className="flex items-center" title={`Applied ${formatDistanceToNow(new Date(job.dateApplied))} ago`}>
                                <CalendarClock className="w-3.5 h-3.5 mr-1.5" />
                                {formatDistanceToNow(new Date(job.dateApplied), { addSuffix: true }).replace('about ', '')}
                            </div>
                        </div>
                    </Link>
                </div>
            )}
        </Draggable>
    );
};

export default JobCard;
