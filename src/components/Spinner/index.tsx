import { Loader2 } from 'lucide-react'; // Or another icon

const IconSpinner = ({ size = 24, color = 'text-blue-500', speed = 'animate-spin' }) => {
  return (
    <Loader2 size={size} className={`${color} ${speed}`} />
  );
};

export default IconSpinner;

