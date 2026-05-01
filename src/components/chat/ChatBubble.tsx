import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ChatPanel from "./ChatPanel";

const ChatBubble = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          aria-label="Open assistant"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-[hsl(var(--info))] hover:bg-[hsl(var(--info))]/90 text-[hsl(var(--info-foreground))]"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col"
      >
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle>Assistant</SheetTitle>
        </SheetHeader>
        <ChatPanel />
      </SheetContent>
    </Sheet>
  );
};

export default ChatBubble;
