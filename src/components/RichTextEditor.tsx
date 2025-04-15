import React from 'react';
import { RichTextEditor as MantineRichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { MantineColor } from '@mantine/core';
import { Button, Group } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';

interface RichTextEditorProps {
  editor: Editor | null;
  minHeight?: string | number;
  maxHeight?: string | number;
  showTextFormatting?: boolean;
  showHeadingFormatting?: boolean;
  showListFormatting?: boolean;
  showBlockquoteFormatting?: boolean;
  showHorizontalRuleFormatting?: boolean;
  showImageUpload?: boolean;
  showTextAlignment?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  editor,
  minHeight = '200px',
  maxHeight,
  showTextFormatting = true,
  showHeadingFormatting = false,
  showListFormatting = false,
  showBlockquoteFormatting = false,
  showHorizontalRuleFormatting = false,
  showImageUpload = true,
  showTextAlignment = true,
}) => {

  // Toolbar styles
  const toolbarStyle: React.CSSProperties = {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
    borderRadius: 6,
    padding: 8,
    minHeight: '12px',
    display: 'flex',
    alignItems: 'center',
  };

  // Content styles
  const contentStyle: React.CSSProperties = {
    minHeight,
    maxHeight,
    padding: '12px',
    backgroundColor: '#ffffff',
    borderColor: '#e9ecef',
    borderRadius: '4px',
  };

  const addImage = () => {
    if (!editor) return;

    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().insertContent({
        type: 'image',
        attrs: { src: url }
      }).run();
    }
  };

  return (
    <MantineRichTextEditor
      editor={editor}
      variant='default'
      styles={{
        toolbar: toolbarStyle,
        content: contentStyle,
      }}
    >
      <MantineRichTextEditor.Toolbar>
        {showTextFormatting && <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Bold />
          <MantineRichTextEditor.Italic />
          <MantineRichTextEditor.Underline />
          <MantineRichTextEditor.Strikethrough />
          <MantineRichTextEditor.ClearFormatting />
          <MantineRichTextEditor.Highlight color='yellow' />
        </MantineRichTextEditor.ControlsGroup>}
        {showTextAlignment && <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.AlignLeft />
          <MantineRichTextEditor.AlignCenter />
          <MantineRichTextEditor.AlignRight />
          <MantineRichTextEditor.AlignJustify />
        </MantineRichTextEditor.ControlsGroup>}
        {showHeadingFormatting && <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.H1 />
          <MantineRichTextEditor.H2 />
          <MantineRichTextEditor.H3 />
          <MantineRichTextEditor.H4 />
        </MantineRichTextEditor.ControlsGroup>}
        {showListFormatting && <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.BulletList />
          <MantineRichTextEditor.OrderedList />
        </MantineRichTextEditor.ControlsGroup>}
        {showBlockquoteFormatting && <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Blockquote />
        </MantineRichTextEditor.ControlsGroup>}
        {showHorizontalRuleFormatting && <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Hr />
        </MantineRichTextEditor.ControlsGroup>}
        {showImageUpload && (
          <MantineRichTextEditor.ControlsGroup>
            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconPhoto size={16} />}
              onClick={addImage}
              title="Add image"
            >
              Image
            </Button>
          </MantineRichTextEditor.ControlsGroup>
        )}
      </MantineRichTextEditor.Toolbar>
      <MantineRichTextEditor.Content />
    </MantineRichTextEditor>
  );
}; 