import { useEffect, useRef } from "react";
import { PiWaveformBold } from "react-icons/pi";
import { TbUserCircle } from "react-icons/tb";

interface UserMessageProps {
  isAssistant: boolean;
  messages: string[];
}

export function UserMessage({
  isAssistant,
  messages
}: UserMessageProps) {

  const icon = isAssistant ? <PiWaveformBold /> : <TbUserCircle />;
  const name = isAssistant ? 'Assistant' : 'You';

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="flex flex-col" ref={divRef}>
      <div className="flex gap-2 items-center">
        <div>{icon}</div>
        <p className="font-bold text-lg">{name}</p>
      </div>
      <div>
        {messages.map((message, index) => <p key={index}>{message}</p>)}
      </div>
    </div>
  )
}