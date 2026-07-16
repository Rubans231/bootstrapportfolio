import { useEffect, useState } from "react";

const QUOTES = [
  "Life keeps forcing choices.",
  "Work life is... complicated.",
  "Life as an engineer isn't always so nice, but my themes and projects sure are — so I can cope with that satisfaction.",
];

export default function QuoteRotator() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % QUOTES.length), 5200);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="quote-rotator" key={i}>
      "{QUOTES[i]}"
    </p>
  );
}
