import NotesGraph from "../components/NotesGraph";

export default function Notes() {
  return (
    <section className="notes-page">
      <div className="section-heading">
        <h2>04 — second brain</h2>
      </div>
      <p className="notes-intro">
        The actual link graph from my ZenNotes vault — real notes, wired together by the
        wikilinks I write between them as I go. No mock data. LeetCode grinding, ML/RAG
        research, GenAI tooling, and a cluster of Japanese-study notes, all tangled
        together the way my head actually is. Click a node.
      </p>
      <NotesGraph />
    </section>
  );
}
