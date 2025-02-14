"use client";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Play, Pause, Rewind, FastForward } from "lucide-react";
import Image from "next/image";
import Admaker from "./Admaker";
import { Button } from "./ui/button";
import Timeline from "./Timeline";
import TimelineTest from "./my-references/TimelineTest";
import { useVideoStore } from "~/store/useStore";
import useVideoControls from "~/app/hooks/video-controls";

const darkIconStyle = { fill: "#27272A" };

const VideoEditor = () => {
  const {
    playing,
    duration,
    setPlaying,
    currentTime,
    setDuration,
    setCurrentTime,
    seeking,
    setSeeking,
  } = useVideoStore();

  const {
    playerRef,
    markerZIndex,
    setMarkerZIndex,
    playbackRate,
    handleJumpStart,
    handleJumpEnd,
    increasePlaybackRate,
    decreasePlaybackRate,
    handleForwardTenSeconds,
    handleBackwardTenSeconds,
    handleSeekChange,
    handleSeekMouseDown,
  } = useVideoControls();

  const [isClient, setIsClient] = useState(false);

  // Hydration

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "Space":
          event.preventDefault();
          handlePlayPause();
          break;
        case "ArrowLeft":
          handleBackwardTenSeconds();
          break;
        case "ArrowRight":
          handleForwardTenSeconds();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playing]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      const currentDuration = player.getDuration();
      if (currentDuration) {
        setDuration(currentDuration);
      }
    }
  }, [playerRef.current]);

  const onProgress = (data: { playedSeconds: number }) => {
    if (!seeking) {
      setCurrentTime(data.playedSeconds);
    }
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.currentTarget.value);
    setSeeking(false);
    playerRef.current?.seekTo(newTime, "seconds");

    // setPlaying(true);

    setPlaying(false);
    setTimeout(() => {
      setPlaying(true);
    }, 100);
    setMarkerZIndex(5);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-8">
        <Admaker />
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="overflow-hidden rounded-lg">
            {isClient && (
              <ReactPlayer
                ref={playerRef}
                // url='https://utfs.io/f/37835069-4b3e-48e8-97b5-da654c1de85b-m0d2yz.mp4'
                url="https://www.youtube.com/watch?v=V0ej29G7ZGg&t=1694s"
                controls={true}
                playing={playing}
                onProgress={onProgress}
                playbackRate={playbackRate}
                // progressInterval={500}
                width="100%"
                heigth="100%"
              />
            )}
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <Button
              className="inline-flex gap-2"
              variant="ghost"
              onClick={handleJumpStart}
              aria-label="Jump to Start"
            >
              <div className="flex h-8 w-8 items-center justify-center gap-0 rounded-full border border-zinc-300">
                <Image
                  src="/ArrowLineLeft.svg"
                  alt="Jump to Start"
                  width={16}
                  height={16}
                />
              </div>
              <span className="font-manrope text-sm font-semibold text-muted-foreground">
                Jump to start
              </span>
            </Button>
            <div className="flex items-center justify-between">
              <Button
                className="inline-flex gap-2"
                variant="ghost"
                onClick={handleBackwardTenSeconds}
                aria-label="10s back"
              >
                <Image
                  src="/ClockAntiClockwise.svg"
                  alt="rewind"
                  width={20}
                  height={20}
                  quality={100}
                />
                <span className="font-manrope text-sm font-semibold text-muted-foreground">
                  10s
                </span>
              </Button>
              <Button
                variant="ghost"
                onClick={decreasePlaybackRate}
                aria-label="Rewind"
              >
                <Rewind size={20} style={darkIconStyle} />
              </Button>
              <Button
                variant="ghost"
                onClick={handlePlayPause}
                aria-label="Play/Pause"
              >
                {playing ? (
                  <Pause size={32} style={darkIconStyle} />
                ) : (
                  <Play size={32} style={darkIconStyle} />
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={increasePlaybackRate}
                aria-label="Fast Forward"
              >
                <FastForward size={20} style={darkIconStyle} />
              </Button>
              <Button
                className="inline-flex gap-2"
                variant="ghost"
                onClick={handleForwardTenSeconds}
                aria-label="10s forward"
              >
                <span className="font-manrope text-sm font-semibold text-muted-foreground">
                  10s
                </span>
                <Image
                  src="/ClockClockwise.svg"
                  alt="fast forward"
                  width={20}
                  height={20}
                  quality={100}
                />
              </Button>
            </div>

            <Button
              className="inline-flex gap-2"
              variant="ghost"
              onClick={handleJumpEnd}
              aria-label="Jump to End"
            >
              <span className="font-manrope text-sm font-semibold text-muted-foreground">
                Jump to end
              </span>
              <div className="flex h-8 w-8 items-center justify-center gap-0 rounded-full border border-zinc-300">
                <Image
                  src="/ArrowLineLeft.svg"
                  alt="Jump to End"
                  width={16}
                  height={16}
                  className="rotate-180 transform"
                />
              </div>
            </Button>
          </div>
        </div>
      </div>
      <Timeline
        currentTime={currentTime}
        duration={duration}
        markerZIndex={markerZIndex}
        onSeekChange={handleSeekChange}
        onSeekMouseDown={handleSeekMouseDown}
        onSeekMouseUp={handleSeekMouseUp}
      />
      {/* <TimelineTest
                currentTime={currentTime}
                duration={duration}
                onSeekChange={handleSeekChange}
                onSeekMouseDown={handleSeekMouseDown}
                onSeekMouseUp={handleSeekMouseUp}
            /> */}
    </div>
  );
};

export default VideoEditor;
