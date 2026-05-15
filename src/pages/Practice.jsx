import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import knowledgeCards from '../knowledgeCards';

const allCategoriesLabel = 'Tất cả';

function Practice() {
  const [activeCategory, setActiveCategory] = useState(allCategoriesLabel);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const categories = useMemo(() => [
    allCategoriesLabel,
    ...Array.from(new Set(knowledgeCards.map((card) => card.category))),
  ], []);

  const visibleCards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return knowledgeCards.filter((card) => {
      const matchesCategory = activeCategory === allCategoriesLabel
        || card.category === activeCategory;
      const matchesQuery = !normalizedQuery
        || [card.title, card.category, card.content].join(' ').toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <main className="practice-page">
      <section className="practice-panel">
        <div className="practice-header">
          <div>
            <p className="eyebrow">Lá bài kiến thức</p>
            <h1>Ôn tập</h1>
            <p className="practice-count">{visibleCards.length} / {knowledgeCards.length} lá bài</p>
          </div>
          <button className="secondary-button compact" type="button" onClick={() => navigate('/')}>
            Trang chủ
          </button>
        </div>

        <div className="practice-tools">
          <label htmlFor="knowledge-search">
            Tìm kiếm
            <input
              id="knowledge-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nhập từ khóa, số điện thoại, tổ chức..."
            />
          </label>

          <label htmlFor="knowledge-category">
            Chủ đề
            <select
              id="knowledge-category"
              value={activeCategory}
              onChange={(event) => setActiveCategory(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="knowledge-card-grid">
          {visibleCards.map((card) => (
            <article className="knowledge-card" key={card.id}>
              <span className="knowledge-card-number">#{card.id}</span>
              <p className="knowledge-card-category">{card.category}</p>
              <h2>{card.title}</h2>
              <p>{card.content}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Practice;
