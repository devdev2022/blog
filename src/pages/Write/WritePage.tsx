import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//tiptap
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

import WritePageView from "./WritePageView";
import {
  usePostCategories,
  useCreatePost,
  useSaveDraft,
  useUpdateDraft,
  useDeleteDraft,
  useDraftList,
} from "@/query/posts";
import { uploadImage } from "@/api/upload/upload";
import { uploadVideo } from "@/api/upload/video";
import { fetchDraftById } from "@/api/posts/posts";

const TITLE_MAX_LENGTH = 200;
const CONTENT_MAX_LENGTH = 100_000;
const WRITE_DRAFT_KEY = "draft_id_write";

function WritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [draftId, setDraftId] = useState<string | null>(() =>
    sessionStorage.getItem(WRITE_DRAFT_KEY),
  );
  const [alertMessage, setAlertMessage] = useState("");
  const [showDraftList, setShowDraftList] = useState(false);
  const videoFilesRef = useRef<Map<string, File>>(new Map());
  const imageFilesRef = useRef<Map<string, File>>(new Map());
  const lastSavedRef = useRef<{ content: string; category: string } | null>(
    null,
  );
  const initialLoadDoneRef = useRef(false);
  const { data: categoriesData } = usePostCategories();
  const { data: draftListData, refetch: refetchDrafts } = useDraftList();
  const { mutateAsync: doCreatePost } = useCreatePost();
  const { mutateAsync: doSaveDraft } = useSaveDraft();
  const { mutateAsync: doUpdateDraft } = useUpdateDraft();
  const { mutateAsync: doDeleteDraft } = useDeleteDraft();

  useEffect(() => {
    return () => {
      sessionStorage.removeItem(WRITE_DRAFT_KEY);
    };
  }, []);

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
    editorProps: {
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (!file) continue;
            event.preventDefault();
            const blobUrl = URL.createObjectURL(file);
            imageFilesRef.current.set(blobUrl, file);
            view.dispatch(
              view.state.tr.replaceSelectionWith(
                view.state.schema.nodes.image.create({ src: blobUrl }),
              ),
            );
            return true;
          }
        }
        return false;
      },
      handleDrop(view, event) {
        const files = event.dataTransfer?.files;
        if (!files?.length) return false;
        const imageFiles = Array.from(files).filter((f) =>
          f.type.startsWith("image/"),
        );
        if (!imageFiles.length) return false;
        event.preventDefault();
        const { pos } = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        }) ?? { pos: view.state.selection.from };
        imageFiles.forEach((file) => {
          const blobUrl = URL.createObjectURL(file);
          imageFilesRef.current.set(blobUrl, file);
          view.dispatch(
            view.state.tr.insert(
              pos,
              view.state.schema.nodes.image.create({ src: blobUrl }),
            ),
          );
        });
        return true;
      },
    },
    onUpdate({ editor }) {
      const textLength = editor.getText().length;
      if (textLength > CONTENT_MAX_LENGTH) {
        editor.commands.undo();
        setAlertMessage(
          `본문은 최대 ${CONTENT_MAX_LENGTH.toLocaleString()}자까지 입력할 수 있습니다.`,
        );
        return;
      }
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!draftId || initialLoadDoneRef.current || !editor) return;
    initialLoadDoneRef.current = true;

    fetchDraftById(draftId)
      .then((draft) => {
        setTitle(draft.title);
        setCategory(draft.categorySlug);
        setTags(draft.tags);
        editor.commands.setContent(draft.content);
        lastSavedRef.current = {
          content: draft.content,
          category: draft.categorySlug,
        };
      })
      .catch(() => {
        setDraftId(null);
        sessionStorage.removeItem(WRITE_DRAFT_KEY);
      });
  }, [draftId, editor]);

  const handleTitleChange = (value: string) => {
    if (value.length > TITLE_MAX_LENGTH) {
      setTitle(value.slice(0, TITLE_MAX_LENGTH));
      setAlertMessage(
        `제목은 최대 ${TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`,
      );
      return;
    }
    setTitle(value);
  };

  const handleAlertClose = () => setAlertMessage("");

  const handleImageAdd = (file: File) => {
    const blobUrl = URL.createObjectURL(file);
    imageFilesRef.current.set(blobUrl, file);
    editor?.chain().focus().setImage({ src: blobUrl }).run();
  };

  const handleVideoAdd = (blobUrl: string, file: File) => {
    videoFilesRef.current.set(blobUrl, file);
  };

  const isTempSaveDisabled =
    lastSavedRef.current !== null &&
    lastSavedRef.current.content === content &&
    lastSavedRef.current.category === category;

  const processBlobImages = async (htmlContent: string): Promise<string> => {
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    const blobImages = Array.from(doc.querySelectorAll('img[src^="blob:"]'));
    for (const img of blobImages) {
      const blobUrl = img.getAttribute("src")!;
      const file = imageFilesRef.current.get(blobUrl);
      if (!file) continue;
      const url = await uploadImage(file);
      img.setAttribute("src", url);
      URL.revokeObjectURL(blobUrl);
      imageFilesRef.current.delete(blobUrl);
    }
    return doc.body.innerHTML;
  };

  const handleTempSave = async () => {
    try {
      const processedContent = await processBlobImages(content);
      if (processedContent !== content) {
        editor?.commands.setContent(processedContent);
        setContent(processedContent);
      }
      const body = { title, content: processedContent, categorySlug: category, tags };
      if (draftId) {
        await doUpdateDraft({ id: draftId, body });
      } else {
        const { id } = await doSaveDraft(body);
        setDraftId(id);
        sessionStorage.setItem(WRITE_DRAFT_KEY, id);
      }
      lastSavedRef.current = { content: processedContent, category };
    } catch {
      setAlertMessage("임시저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDeleteDrafts = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => doDeleteDraft(id)));
      if (ids.includes(draftId ?? "")) {
        setDraftId(null);
        sessionStorage.removeItem(WRITE_DRAFT_KEY);
      }
    } catch {
      setAlertMessage("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleOpenDraftList = async () => {
    await refetchDrafts();
    setShowDraftList(true);
  };
  const handleCloseDraftList = () => setShowDraftList(false);

  const handleLoadDraft = async (id: string) => {
    try {
      if (title || content) {
        const body = { title, content, categorySlug: category, tags };
        if (draftId) {
          await doUpdateDraft({ id: draftId, body });
        } else {
          const { id: newId } = await doSaveDraft(body);
          sessionStorage.setItem(WRITE_DRAFT_KEY, newId);
        }
      }
      const draft = await fetchDraftById(id);
      setTitle(draft.title);
      setCategory(draft.categorySlug);
      setTags(draft.tags);
      setDraftId(id);
      sessionStorage.setItem(WRITE_DRAFT_KEY, id);
      editor?.commands.setContent(draft.content);
      lastSavedRef.current = {
        content: draft.content,
        category: draft.categorySlug,
      };
      setShowDraftList(false);
    } catch {
      setAlertMessage("임시저장을 불러오는 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handlePublish = async () => {
    const imageProcessedContent = await processBlobImages(content);
    const doc = new DOMParser().parseFromString(imageProcessedContent, "text/html");

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
    try {
      const { id } = await doCreatePost({
        title,
        content: processedContent,
        categorySlug: category,
        tags,
      });
      sessionStorage.removeItem(WRITE_DRAFT_KEY);
      navigate(`/posts/${id}`);
    } catch {
      setAlertMessage("게시글 발행에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <WritePageView
      editor={editor}
      title={title}
      category={category}
      tags={tags}
      tempSaveCount={draftListData?.total ?? 0}
      draftListItems={draftListData?.drafts ?? []}
      draftListTotal={draftListData?.total ?? 0}
      isTempSaveDisabled={isTempSaveDisabled}
      categories={categoriesData?.categories ?? []}
      alertMessage={alertMessage}
      showDraftList={showDraftList}
      currentDraftId={draftId}
      onTitleChange={handleTitleChange}
      onCategoryChange={setCategory}
      onTagsChange={setTags}
      onTempSave={handleTempSave}
      onPublish={handlePublish}
      onCancel={handleCancel}
      onImageAdd={handleImageAdd}
      onVideoAdd={handleVideoAdd}
      onAlertClose={handleAlertClose}
      onOpenDraftList={handleOpenDraftList}
      onCloseDraftList={handleCloseDraftList}
      onLoadDraft={handleLoadDraft}
      onDeleteDrafts={handleDeleteDrafts}
    />
  );
}

export default WritePage;
