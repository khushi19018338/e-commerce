import { CATEGORIES } from "../../../config/constants";

function CategoryFilter({ onSelect }) {

  return (
    <div className="category-filter">
      <button 
        className="btn btn-secondary category-btn"
        onClick={() => onSelect("")}
      >
        All
      </button>

      {CATEGORIES.map((cat) => (

        <button
          key={cat}
          className="btn btn-secondary category-btn"
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>

      ))}

    </div>
  );
}

export default CategoryFilter;
