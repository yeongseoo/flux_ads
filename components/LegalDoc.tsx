export type LegalSection = { id: string; title: string; body: React.ReactNode };

export function LegalDoc({ sections }: { sections: LegalSection[] }) {
  return (
    <section className="legal">
      <div className="container legal-grid">
        <nav className="toc" aria-label="목차">
          <b>목차</b>
          <ol>
            {sections.map((s) => (
              <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>
            ))}
          </ol>
        </nav>
        <article className="prose">
          {sections.map((s) => (
            <section key={s.id} aria-labelledby={s.id}>
              <h2 id={s.id}>{s.title}</h2>
              {s.body}
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}
