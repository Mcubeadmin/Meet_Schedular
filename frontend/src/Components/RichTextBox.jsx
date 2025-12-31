import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Box } from "@mui/material";

export default function RichTextBox({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  return <Box
    sx={{
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "8px",
        marginLeft: "20px",
        marginRight: "20px",
        minHeight: "50px",
        textAlign: "left",     
        "& .ProseMirror": {
        outline: "none",
        textAlign: "left",    
        }
    }}
    >
        <EditorContent editor={editor} />
    </Box>

}
