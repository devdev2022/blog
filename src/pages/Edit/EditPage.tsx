import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
import { usePostDetail, usePostCategories, useUpdatePost, useSaveDraft, useUpdateDraft } from "@/query/posts";
import { uploadImage } from "@/api/upload/upload";
import { uploadVideo } from "@/api/upload/video";
import type { PostListItem } from "@/types/post";


function toCategorySlug(post: PostListItem): string {
  if (post.subCategory) {
    return `${post.subCategory.mainCategory.name}/${post.subCategory.name}`;
  }
  return post.mainCategory?.name ?? "";
}

const TITLE_MAX_LENGTH = 200;
const CONTENT_MAX_LENGTH = 100_000;

// ── 데이터가 준비된 후에만 마운트되는 에디터 컴포넌트 ──────────────────────
interface EditPageEditorProps {
  id: string;
  initialPost: PostListItem;
}

function EditPageEditor({ id, initialPost }: EditPageEditorProps) {
  const navigate = useNavigate();
  const { data: categoryData } = usePostCategories();
  const { mutateAsync: doUpdatePost } = useUpdatePost(id);

  // 초기값을 props에서 동기적으로 세팅
  const [title, setTitle] = useState(initialPost.title);
  const [category, setCategory] = useState(toCategorySlug(initialPost));
  const [tags, setTags] = useState<string[]>(
    initialPost.tags.map((t) => t.name),
  );
  const [content, setContent] = useState(initialPost.content);
  const draftKey = `draft_id_edit_${id}`;
  const [tempSaveCount, setTempSaveCount] = useState(0);
  const [draftId, setDraftId] = useState<string | null>(
    () => sessionStorage.getItem(`draft_id_edit_${id}`),
  );
  const [alertMessage, setAlertMessage] = useState("");
  const videoFilesRef = useRef<Map<string, File>>(new Map());
  const lastSavedRef = useRef<{ content: string; category: string } | null>(null);
  const { mutateAsync: doSaveDraft } = useSaveDraft();
  const { mutateAsync: doUpdateDraft } = useUpdateDraft();

  useEffect(() => {
    return () => {
      sessionStorage.removeItem(draftKey);
    };
  }, [draftKey]);

  // 에디터가 마운트될 때 initialPost.content로 초기화
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockExtension,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ allowBase64: false }),
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
    editorProps: {
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (!file) continue;
            event.preventDefault();
            uploadImage(file).then((url) => {
              view.dispatch(
                view.state.tr.replaceSelectionWith(
                  view.state.schema.nodes.image.create({ src: url })
                )
              );
            });
            return true;
          }
        }
        return false;
      },
      handleDrop(view, event) {
        const files = event.dataTransfer?.files;
        if (!files?.length) return false;
        const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
        if (!imageFiles.length) return false;
        event.preventDefault();
        const { pos } = view.posAtCoords({ left: event.clientX, top: event.clientY }) ?? { pos: view.state.selection.from };
        imageFiles.forEach((file) => {
          uploadImage(file).then((url) => {
            view.dispatch(
              view.state.tr.insert(pos, view.state.schema.nodes.image.create({ src: url }))
            );
          });
        });
        return true;
      },
    },
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

  const handleImageAdd = async (file: File) => {
    const url = await uploadImage(file);
    editor?.chain().focus().setImage({ src: url }).run();
  };

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
        sessionStorage.setItem(draftKey, id);
      }
      lastSavedRef.current = { content, category };
      setTempSaveCount((prev) => prev + 1);
    } catch {
      setAlertMessage("임시저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handlePublish = async () => {
    const doc = new DOMParser().parseFromString(content, "text/html");

    const blobVideos = Array.from(doc.querySelectorAll('video[src^="blob:"]'));
    for (const video of blobVideos) {
      const blobUrl = video.getAttribute("src")!;
      const file = videoFilesRef.current.get(blobUrl);
      if (!file) continue;
      const url = await uploadVideo(file);
      video.setAttribute("src", url);
      URL.revokeObjectURL(blobUrl);
    }

    const processedContent = doc.body.innerHTML;

    await doUpdatePost({ title, content: processedContent, categorySlug: category, tags });

    navigate(`/posts/${id}`);
  };
  return (
    <WritePageView
      editor={editor}
      title={title}
      category={category}
      tags={tags}
      tempSaveCount={tempSaveCount}
      isTempSaveDisabled={isTempSaveDisabled}
      categories={categoryData?.categories ?? []}
      onTitleChange={handleTitleChange}
      onCategoryChange={setCategory}
      onTagsChange={setTags}
      onTempSave={handleTempSave}
      onPublish={handlePublish}
      onCancel={handleCancel}
      onImageAdd={handleImageAdd}
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
