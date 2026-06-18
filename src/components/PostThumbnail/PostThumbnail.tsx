import { useState } from "react";

interface PostThumbnailProps {
  thumbnail?: string;
  title: string;
  className: string;
  placeholderClassName: string;
}

function PostThumbnail({
  thumbnail,
  title,
  className,
  placeholderClassName,
}: PostThumbnailProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div className={className}>
      {thumbnail && !errored ? (
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          decoding="async"
          className={
            loaded ? "post-thumbnail-img is-loaded" : "post-thumbnail-img"
          }
          ref={(img) => {
            if (!img) return;
            img
              .decode()
              .then(() => setLoaded(true))
              .catch(() => setErrored(true));
          }}
        />
      ) : (
        <div className={placeholderClassName} />
      )}
    </div>
  );
}

export default PostThumbnail;
