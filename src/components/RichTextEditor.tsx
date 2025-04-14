import React from 'react';
import { RichTextEditor as MantineRichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { MantineColor } from '@mantine/core';

interface RichTextEditorProps {
  editor: Editor | null;
  minHeight?: string | number;
  maxHeight?: string | number;
  showTextFormatting?: boolean;
  showHeadingFormatting?: boolean;
  showListFormatting?: boolean;
  showBlockquoteFormatting?: boolean;
  showHorizontalRuleFormatting?: boolean;
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

  return (
    <MantineRichTextEditor
      editor={editor}
      variant='default'
      styles={{
        toolbar: toolbarStyle,
        content: contentStyle,
      }}
    >
      <MantineRichTextEditor.Toolbar sticky stickyOffset={0}>
        {showTextFormatting && <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Bold />
          <MantineRichTextEditor.Italic />
          <MantineRichTextEditor.Underline />
          <MantineRichTextEditor.Strikethrough />
          <MantineRichTextEditor.ClearFormatting />
          <MantineRichTextEditor.Highlight color='yellow' />
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
      </MantineRichTextEditor.Toolbar>
      <MantineRichTextEditor.Content />
    </MantineRichTextEditor>
  );
}; 