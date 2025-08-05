import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import EmojiPicker from 'emoji-picker-react';

function MyTextEditor({ value, onChange }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const quillRef = useRef(null);

  // Insert emoji at cursor position
  const onEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection(true);
      if (range) {
        editor.insertText(range.index, emoji);
        editor.setSelection(range.index + emoji.length);
      } else {
        editor.insertText(editor.getLength(), emoji);
      }
    }
    setShowEmojiPicker(false);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setShowEmojiPicker(val => !val)}
        style={{ marginBottom: 8 }}
      >
        😊 Emoji
      </button>
      {showEmojiPicker && (
        <div style={{ position: 'absolute', zIndex: 10, top: 36 }}>
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder="Start typing here..."
        className="my-quill-editor"
         style={{ height: 100 }}
      />
    </div>
  );
}

export default MyTextEditor;
