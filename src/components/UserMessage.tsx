import { IconUser, IconWaveSawTool } from "@tabler/icons-react";
import { useEffect, useRef } from "react";

interface UserMessageProps {
  isAssistant: boolean;
  messages: string[];
}

export function UserMessage({
  isAssistant,
  messages
}: UserMessageProps) {

  const icon = isAssistant ? <IconWaveSawTool /> : <IconUser />;
  const name = isAssistant ? 'Assistant' : 'You';

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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