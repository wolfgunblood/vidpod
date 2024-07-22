// Timeline component
import React, { useEffect, useMemo, useRef, useState } from 'react';
import "../styles/Timeline.css"
import "../styles/Slider.css"
import { DisplayTime, generateTimeLabels } from '~/helpers/timeformat';
import TimelineHead from './TimelineHead';
import Image from 'next/image';
import { useAdStore } from 'store/useStore';
import Draggable from "react-draggable";


// const markers = [
//     { time: 10, url: '/ad2.svg' },
//     { time: 80, url: '/ad3.svg' },
//     { time: 120, url: '/ad1.svg' }
// ];

const markerUrls = {
    'AUTO': '/ad2.svg',
    'STATIC': '/ad3.svg',
    'AB': '/ad1.svg'
};

interface TimelineProps {
    currentTime: number;
    duration: number;
    onSeekChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSeekMouseDown: () => void;
    onSeekMouseUp: (e: React.MouseEvent<HTMLInputElement>) => void;
}

const Timeline: React.FC<TimelineProps> = ({
    currentTime,
    duration,
    onSeekChange,
    onSeekMouseDown,
    onSeekMouseUp
}) => {
    // const sliderValue = (currentTime / duration) * 100 || 0;
    const sliderValue = currentTime;

    const [controlValue, setControlValue] = useState(0);
    const [bottomSliderWidth, setBottomSliderWidth] = useState(100);

    // const markers = useAdStore(state => state.markers);
    // const initializeMarkers = useAdStore(state => state.initializeMarkers);
    const { markers, initializeMarkers, editMarker } = useAdStore();

    //Timeline Ref
    const timelineRef = useRef(null); // Setup ref here

    useEffect(() => {
        // Initialize markers
        initializeMarkers([
            { time: 300, type: 'AUTO' },
            { time: 1500, type: 'STATIC' },
            { time: 3600, type: 'AB' }
        ]);
    }, [initializeMarkers]);


    const computedMarkers = markers.map(marker => {
        // console.log(marker.time)
        // console.log(duration)
        const leftPercentage = (marker.time / duration) * 100;
        // console.log(`Marker at ${marker.time}s, Type: ${marker.type}, Calculated Left: ${leftPercentage}%`);
        return {
            ...marker,
            url: markerUrls[marker.type],
            left: `${leftPercentage}%`
        };
    });


    const ticks = Array.from({ length: Math.floor(duration) + 1 }, (_, i) => ({
        left: (i / duration) * 100
    }));
    const timeLabels = generateTimeLabels(duration);

    const timestamps = useMemo(() => {
        const numMarks = Math.floor(duration / 60);
        return Array.from({ length: numMarks + 1 }, (_, index) => {
            const time = 60 * index;
            return { time: DisplayTime(time), left: `${(time / duration) * 100}%` };
        });
    }, [duration]);

    const handleControlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newControlValue = Number(e.target.value);
        setControlValue(newControlValue);
        console.log(controlValue)
        if (newControlValue === 0) {
            setBottomSliderWidth(100);
        } else {
            setBottomSliderWidth(100 + newControlValue * 10);
        }

    };

    //   const [initialPos, setInitialPos] = useState(null);

    //   const handleStart = (e, data) => {
    //       console.log("Drag started");
    //       setInitialPos(data.x);
    //   };
  
    //   const handleDrag = (e, data, index : number) => {
    //       console.log("Dragging");
        
    //   };
  
    //   const handleStop = (e, data, index :number) => {
    //       console.log("Dragging stopped");
          
    //       const timelineWidth = timelineRef.current ? timelineRef.current.offsetWidth : 0;
    //       const newLeft = Math.min(Math.max(data.x, 0), timelineWidth);
    //       const newLeftPercentage = (newLeft / timelineWidth) * 100;
    //       const newTime = Math.round((newLeftPercentage / 100) * duration);
          
    //       console.log(`Final new time (rounded): ${newTime}`);
          
    //       editMarker(index, newTime);
    //       console.log(`Updated markers:`, markers);
    //   };

    return (
        <div className='p-8 pb-12 bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between gap-8'>
            <TimelineHead
                currentTime={currentTime}
                controlValue={controlValue}
                handleControlChange={handleControlChange}
                setControlValue={setControlValue}
                setBottomSliderWidth={setBottomSliderWidth}
            />

            <div ref={timelineRef} className="relative custom-scrollbar w-full h-128px overflow-x-auto overflow-y-visible pt-12 pb-16">
                <div 
                    className="timeline-slider w-full h-full relative z-10" style={{
                        width: `${bottomSliderWidth}%`,
                        padding: '0 16px'
                    }}>
                    <input
                        type="range"
                        min={0}
                        max={duration}
                        value={sliderValue}
                        onChange={onSeekChange}
                        onMouseDown={onSeekMouseDown}
                        onMouseUp={onSeekMouseUp}
                        className="w-full h-2 appearance-none cursor-pointer"
                    // style={{ transition: `left ${transitionDuration} ease-in-out` }}
                    // style={{ marginBottom: '16px' }}
                    />
                    {computedMarkers.map((marker, index) => (
                        // <Draggable
                        //     key={index}
                        //     axis='x'
                        //     scale={1}
                        //     position={{x: parseInt(marker.left, 10), y: 0}}
                        //     onStart={(e, data) => handleStart(e, data)}
                        //     onDrag={(e, data) => handleDrag(e, data, index)}
                        //     onStop={(e, data) => handleStop(e, data, index)}
                        // >

                            <img
                                key={index}
                                className="absolute"
                                src={marker.url}
                                alt="Timeline marker"
                                style={{ left: marker.left, bottom: '0', height: '100%' }}
                            />
                        // </Draggable>
                    ))}
                    {ticks.map((tick, index) => (
                        <div key={index} className="tick" style={{ left: `${tick.left}%` }}></div>
                    ))}


                    {/* <div className="w-full flex justify-between text-xs text-zinc-500" style={{ position: 'relative', bottom: '-50px' }}>
                        {timestamps.map((timestamp, index) => (
                            <span
                                key={index}
                                style={{
                                    left: timestamp.left,
                                }}
                                className={`w-full border-l-2 border-zinc-300 text-center ${index === timestamps.length - 1 ? "border-r-2" : ""}`}
                            >
                                <span className='text-sm text-muted-foreground font-semibold font-manrope'>
                                    {timestamp.time}
                                </span>
                            </span>
                        ))}
                    </div> */}
                </div>
            </div>

        </div>
    );
};

export default Timeline;
