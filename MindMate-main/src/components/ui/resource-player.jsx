
import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Slider } from "./slider"

export function ResourcePlayer({ resource, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{resource.title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            âœ•
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {resource.type === "audio" && (
          <div className="space-y-3">
            <audio
              ref={audioRef}
              src={resource.url}
              onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.target.duration)}
              onEnded={() => setIsPlaying(false)}
            />

            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={togglePlay}>
                {isPlaying ? "â¸ï¸" : "â–¶ï¸"}
              </Button>
              <div className="flex-1">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  onValueChange={(value) => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = value[0]
                      setCurrentTime(value[0])
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {resource.type === "video" && (
          <div className="aspect-video bg-black rounded">
            <video controls className="w-full h-full rounded" src={resource.url} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

