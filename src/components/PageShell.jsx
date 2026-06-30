function PageShell({ pageName, owner, children }) {
  return (
    <section className="page-card">
      <div className="page-card-header">
        <div>
          <p className="eyebrow">Assigned to {owner}</p>
          <h2>{pageName}</h2>
        </div>
      </div>
      <div className="developer-zone">
        {children}
      </div>
    </section>
  );
}

export default PageShell;
