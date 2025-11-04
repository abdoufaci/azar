import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Toolbar from "./toolbar";
import { cn } from "@/lib/utils";

interface Props {
  description: string;
  onChange: (e: string) => void;
  isArabic?: boolean;
}

function Tiptap({ description, onChange, isArabic = false }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "pl-4 list-disc",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "pl-4 list-decimal",
          },
        },
      }),
      Placeholder.configure({
        placeholder: "À quoi pensez-vous ?",
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class: cn(
          "rounded-md border p-4 w-full ring-0 focus:ring-0 focus-within:ring-0 outline-none text-xs h-40 overflow-y-auto"
        ),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="w-full">
      <EditorContent editor={editor} />
      <Toolbar editor={editor} />
    </div>
  );
}

export default Tiptap;
