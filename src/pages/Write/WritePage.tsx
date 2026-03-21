import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
import { usePostCategories, useCreatePost, useSaveDraft, useUpdateDraft } from '@/query/posts';
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
const WRITE_DRAFT_KEY = 'draft_id_write';

function WritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tempSaveCount, setTempSaveCount] = useState(0);
  const [draftId, setDraftId] = useState<string | null>(
    () => localStorage.getItem(WRITE_DRAFT_KEY),
  );
  const [alertMessage, setAlertMessage] = useState('');
  const videoFilesRef = useRef<Map<string, File>>(new Map());
  const lastSavedRef = useRef<{ content: string; category: string } | null>(null);
  const { data: categoriesData } = usePostCategories();
  const { mutateAsync: doCreatePost } = useCreatePost();
  const { mutateAsync: doSaveDraft } = useSaveDraft();
  const { mutateAsync: doUpdateDraft } = useUpdateDraft();

  useEffect(() => {
    return () => {
      localStorage.removeItem(WRITE_DRAFT_KEY);
    };
  }, []);

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

  const isTempSaveDisabled =
    lastSavedRef.current !== null &&
    lastSavedRef.current.content === content &&
    lastSavedRef.current.category === category;

  const handleTempSave = async () => {
    try {
      const body = { title, content, categorySlug: category, tags };
      if (draftId) {
        await doUpdateDraft({ id: draftId, body });
      } else {
        const { id } = await doSaveDraft(body);
        setDraftId(id);
        localStorage.setItem(WRITE_DRAFT_KEY, id);
      }
      lastSavedRef.current = { content, category };
      setTempSaveCount((prev) => prev + 1);
    } catch {
      setAlertMessage('임시저장에 실패했습니다. 다시 시도해주세요.');
    }
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
      const url = await uploadImage(file);
      img.setAttribute('src', url);
    }

    const blobVideos = Array.from(doc.querySelectorAll('video[src^="blob:"]'));
    for (const video of blobVideos) {
      const blobUrl = video.getAttribute('src')!;
      const file = videoFilesRef.current.get(blobUrl);
      if (!file) continue;
      const url = await uploadVideo(file);
      video.setAttribute('src', url);
      URL.revokeObjectURL(blobUrl);
    }

    const processedContent = doc.body.innerHTML;
    try {
      const { id } = await doCreatePost({
        title, content: processedContent, categorySlug: category, tags,
      });
      localStorage.removeItem(WRITE_DRAFT_KEY);
      navigate(`/posts/${id}`);
    } catch {
      setAlertMessage('게시글 발행에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <WritePageView
      editor={editor}
      title={title}
      category={category}
      tags={tags}
      tempSaveCount={tempSaveCount}
      isTempSaveDisabled={isTempSaveDisabled}
      categories={categoriesData?.categories ?? []}
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
