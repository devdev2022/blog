// 수정 페이지 청크 로딩 중 표시되는 스켈레톤 (write-page 레이아웃 기준)
function EditSkeleton() {
  return (
    <div className="write-page">
      <div className="write-skeleton-toolbar">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton write-skeleton-toolbar-btn" />
        ))}
      </div>

      <div className="write-content">
        <div className="write-inner">
          <div className="skeleton write-skeleton-category" />
          <div className="skeleton write-skeleton-title" />
          <hr className="write-divider" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="skeleton write-skeleton-editor-line"
              style={i === 5 ? { width: "60%" } : undefined}
            />
          ))}
          <hr className="write-divider write-tag-divider" />
          <div style={{ display: "flex", gap: 8 }}>
            <div className="skeleton write-skeleton-tag" />
            <div className="skeleton write-skeleton-tag" />
          </div>
        </div>
      </div>

      <div className="write-bottom-bar">
        <div className="skeleton write-skeleton-bottom-btn" style={{ width: 60 }} />
        <div style={{ display: "flex", gap: 12 }}>
          <div className="skeleton write-skeleton-bottom-btn" style={{ width: 90 }} />
          <div className="skeleton write-skeleton-bottom-btn" style={{ width: 70 }} />
        </div>
      </div>
    </div>
  );
}

export default EditSkeleton;
