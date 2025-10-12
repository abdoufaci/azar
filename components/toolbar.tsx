"use client";

import { type Editor } from "@tiptap/react";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import { Toggle } from "./ui/toggle";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

interface Props {
  editor: Editor | null;
}

function Toolbar({ editor }: Props) {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-1 cursor-pointer">
      <Toggle
        size={"sm"}
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}>
        <Bold
          className={cn(
            "h-4 w-4 ",
            editor.isActive("bold") ? "text-black" : "text-[#95A1B1B5]"
          )}
        />
      </Toggle>
      <Toggle
        size={"sm"}
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
        <Italic
          className={cn(
            "h-4 w-4 ",
            editor.isActive("italic") ? "text-black" : "text-[#95A1B1B5]"
          )}
        />
      </Toggle>
      <Separator orientation="vertical" className="h-5 rounded-full" />
      <Toggle
        size={"sm"}
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
        <List
          className={cn(
            "h-4 w-4 ",
            editor.isActive("bulletList") ? "text-black" : "text-[#95A1B1B5]"
          )}
        />
      </Toggle>
      <Toggle
        size={"sm"}
        pressed={editor.isActive("orderedList")}
        onPressedChange={() =>
          editor.chain().focus().toggleOrderedList().run()
        }>
        <ListOrdered
          className={cn(
            "h-4 w-4 ",
            editor.isActive("orderedList") ? "text-black" : "text-[#95A1B1B5]"
          )}
        />
      </Toggle>
    </div>
  );
}

export default Toolbar;
