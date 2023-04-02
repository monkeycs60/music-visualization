type ProgressBarProps = {
  currentTime: number;
  duration: number;
  width: number;
};

const ProgressBar = ({ currentTime, duration, width }: ProgressBarProps) => {
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