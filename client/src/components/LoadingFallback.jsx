import { Loader2 } from 'lucide-react';

const LoadingFallback = () => {
    return (
        <div className="flex justify-center items-center h-screen w-full bg-soft-white">
            <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
        </div>
    );
};

export default LoadingFallback;
