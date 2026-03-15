import type { PostCategory } from "@/types/post";

interface CategoryTreeProps {
  categories: PostCategory[];
  selectedCategory: string;
  totalPosts: number;
  onCategoryChange: (slug: string) => void;
}

function CategoryTree({
  categories,
  selectedCategory,
  totalPosts,
  onCategoryChange,
}: CategoryTreeProps) {
  if (categories.length === 0) {
    return (
      <ul className="category-tree">
        <li className="category-tree-item">
          <button
            className="category-tree-btn active"
            onClick={() => onCategoryChange("all")}
          >
            전체 보기
            <span className="category-tree-count">{totalPosts}</span>
          </button>
        </li>
      </ul>
    );
  }

  return (
    <ul className="category-tree">
      {categories.map((cat) => (
        <li key={cat.slug} className="category-tree-item">
          <button
            className={`category-tree-btn${selectedCategory === cat.slug ? " active" : ""}`}
            onClick={() => onCategoryChange(cat.slug)}
          >
            {cat.name}
            {cat.count !== undefined && (
              <span className="category-tree-count">{cat.count}</span>
            )}
          </button>
          {cat.children && cat.children.length > 0 && (
            <ul className="category-tree-children">
              {cat.children.map((child) => (
                <li key={child.slug} className="category-tree-item">
                  <button
                    className={`category-tree-btn child${selectedCategory === child.slug ? " active" : ""}`}
                    onClick={() => onCategoryChange(child.slug)}
                  >
                    {child.name}
                    {child.count !== undefined && (
                      <span className="category-tree-count">{child.count}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export default CategoryTree;
