import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// tiptap
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Placeholder from "@tiptap/extension-placeholder";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { VideoExtension } from "@/extensions/VideoExtension";
import { CodeBlockExtension } from "@/extensions/CodeBlockExtension";
import { FontSizeExtension } from "@/extensions/FontSizeExtension";

import WritePageView from "@/pages/Write/WritePageView";
import { usePostDetail, usePostCategories, useUpdatePost } from "@/query/posts";
import { uploadImage } from "@/api/upload/upload";
import { uploadVideo } from "@/api/upload/video";
import type { PostListItem } from "@/api/posts/posts";

function base64ToFile(base64: string, index: number): File {
  const [header, data] = base64.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const ext = mime.split("/")[1] ?? "png";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], `image-${index}.${ext}`, { type: mime });
}

function toCategorySlug(post: PostListItem): string {
  if (post.subCategory) {
    return `${post.subCategory.mainCategory.name}/${post.subCategory.name}`;
  }
  return post.mainCategory?.name ?? "";
}

// ── 데이터가 준비된 후에만 마운트되는 에디터 컴포넌트 ──────────────────────
interface EditPageEditorProps {
  id: string;
  initialPost: PostListItem;
}

function EditPageEditor({ id, initialPost }: EditPageEditorProps) {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { data: categoryData } = usePostCategories();
  const { mutateAsync: doUpdatePost } = useUpdatePost(id);

  // 초기값을 props에서 동기적으로 세팅
  const [title, setTitle] = useState(initialPost.title);
  const [category, setCategory] = useState(toCategorySlug(initialPost));
  const [tags, setTags] = useState<string[]>(
    initialPost.tags.map((t) => t.name),
  );
  const [content, setContent] = useState(initialPost.content);
  const [tempSaveCount, setTempSaveCount] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const videoFilesRef = useRef<Map<string, File>>(new Map());

  // 에디터가 마운트될 때 initialPost.content로 초기화
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockExtension,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ allowBase64: true }),
      VideoExtension,
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: "내용을 입력하세요..." }),
      TextStyle,
      Color,
      FontFamily,
      FontSizeExtension,
    ],
    content: initialPost.content,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  const handleVideoAdd = (blobUrl: string, file: File) => {
    videoFilesRef.current.set(blobUrl, file);
  };

  const handleTempSave = () => {
    setTempSaveCount((prev) => prev + 1);
    // TODO: 임시저장 API 연동
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handlePublish = async () => {
    const doc = new DOMParser().parseFromString(content, "text/html");

    const base64Images = Array.from(doc.querySelectorAll('img[src^="data:"]'));
    for (let i = 0; i < base64Images.length; i++) {
      const img = base64Images[i];
      const file = base64ToFile(img.getAttribute("src")!, i);
      const url = await uploadImage(file, accessToken!);
      img.setAttribute("src", url);
    }

    const blobVideos = Array.from(doc.querySelectorAll('video[src^="blob:"]'));
    for (const video of blobVideos) {
      const blobUrl = video.getAttribute("src")!;
      const file = videoFilesRef.current.get(blobUrl);
      if (!file) continue;
      const url = await uploadVideo(file, accessToken!);
      video.setAttribute("src", url);
      URL.revokeObjectURL(blobUrl);
    }

    const processedContent = doc.body.innerHTML;

    await doUpdatePost({
      body: { title, content: processedContent, categorySlug: category, tags },
      token: accessToken!,
    });

    navigate(`/posts/${id}`);
  };
  return (
    <WritePageView
      editor={editor}
      title={title}
      category={category}
      tags={tags}
      tempSaveCount={tempSaveCount}
      categories={categoryData ?? []}
      onTitleChange={setTitle}
      onCategoryChange={setCategory}
      onTagsChange={setTags}
      onTempSave={handleTempSave}
      onPublish={handlePublish}
      onCancel={handleCancel}
      onVideoAdd={handleVideoAdd}
      alertMessage={alertMessage}
      onAlertClose={() => setAlertMessage("")}
    />
  );
}

// ── 데이터 로딩을 담당하는 컨테이너 ────────────────────────────────────────
function EditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = usePostDetail(id ?? "");

  useEffect(() => {
    if (!isLoading && !data) {
      navigate("/posts");
    }
  }, [data, isLoading, navigate]);

  if (!data) return null;

  return <EditPageEditor id={id!} initialPost={data.post} />;
}

export default EditPage;
