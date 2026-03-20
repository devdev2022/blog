import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

//tiptap
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Placeholder from '@tiptap/extension-placeholder';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { VideoExtension } from '@/extensions/VideoExtension';
import { CodeBlockExtension } from '@/extensions/CodeBlockExtension';
import { FontSizeExtension } from '@/extensions/FontSizeExtension';

import WritePageView from './WritePageView';
import { usePostCategories } from '@/query/posts';
import { uploadImage } from '@/api/upload/upload';
import { uploadVideo } from '@/api/upload/video';

function base64ToFile(base64: string, index: number): File {
  const [header, data] = base64.split(',');
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/png';
  const ext = mime.split('/')[1] ?? 'png';
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], `image-${index}.${ext}`, { type: mime });
}

const TITLE_MAX_LENGTH = 200;
const CONTENT_MAX_LENGTH = 100_000;

function WritePage() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tempSaveCount, setTempSaveCount] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const videoFilesRef = useRef<Map<string, File>>(new Map());
  const { data: categoriesData } = usePostCategories();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockExtension,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ allowBase64: true }),
      VideoExtension,
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: '내용을 입력하세요...' }),
      TextStyle,
      Color,
      FontFamily,
      FontSizeExtension,
    ],
    onUpdate({ editor }) {
      const textLength = editor.getText().length;
      if (textLength > CONTENT_MAX_LENGTH) {
        editor.commands.undo();
        setAlertMessage(`본문은 최대 ${CONTENT_MAX_LENGTH.toLocaleString()}자까지 입력할 수 있습니다.`);
        return;
      }
      setContent(editor.getHTML());
    },
  });

  const handleTitleChange = (value: string) => {
    if (value.length > TITLE_MAX_LENGTH) {
      setTitle(value.slice(0, TITLE_MAX_LENGTH));
      setAlertMessage(`제목은 최대 ${TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`);
      return;
    }
    setTitle(value);
  };

  const handleAlertClose = () => setAlertMessage('');

  const handleVideoAdd = (blobUrl: string, file: File) => {
    videoFilesRef.current.set(blobUrl, file);
  };

  const handleTempSave = () => {
    setTempSaveCount((prev) => prev + 1);
    // TODO: API 연동
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handlePublish = async () => {
    const doc = new DOMParser().parseFromString(content, 'text/html');

    const base64Images = Array.from(doc.querySelectorAll('img[src^="data:"]'));
    for (let i = 0; i < base64Images.length; i++) {
      const img = base64Images[i];
      const file = base64ToFile(img.getAttribute('src')!, i);
      const url = await uploadImage(file, accessToken!);
      img.setAttribute('src', url);
    }

    const blobVideos = Array.from(doc.querySelectorAll('video[src^="blob:"]'));
    for (const video of blobVideos) {
      const blobUrl = video.getAttribute('src')!;
      const file = videoFilesRef.current.get(blobUrl);
      if (!file) continue;
      const url = await uploadVideo(file, accessToken!);
      video.setAttribute('src', url);
      URL.revokeObjectURL(blobUrl);
    }

    const processedContent = doc.body.innerHTML;
    console.log({ title, category, tags, content: processedContent }); // TODO: API 연동 후 이동
    navigate('/posts');
  };

  return (
    <WritePageView
      editor={editor}
      title={title}
      category={category}
      tags={tags}
      tempSaveCount={tempSaveCount}
      categories={categoriesData ?? []}
      alertMessage={alertMessage}
      onTitleChange={handleTitleChange}
      onCategoryChange={setCategory}
      onTagsChange={setTags}
      onTempSave={handleTempSave}
      onPublish={handlePublish}
      onCancel={handleCancel}
      onVideoAdd={handleVideoAdd}
      onAlertClose={handleAlertClose}
    />
  );
}

export default WritePage;
