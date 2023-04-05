import { useDispatch, useSelector } from 'react-redux';

type ProgressBarProps = {
  width: number;
};

const ProgressBar = ({  width }: ProgressBarProps) => {
   const dispatch = useDispatch();
   const currentTime = useSelector((state: any) => state.audio.currentTime);
   const duration = useSelector((state: any) => state.audio.duration);

   if (duration === 0) {
      return null;
   }
  
   const progressWidth = Math.min((currentTime / duration) * width, width);

   return (
      <div style={{ width }}>
         <div
            style={{
               backgroundColor: 'blue',
               width: progressWidth,
               maxWidth: width,
               height: 10,
            }}
         />
      </div>
   );
};

export default ProgressBar;