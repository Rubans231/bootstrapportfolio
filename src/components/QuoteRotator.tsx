import { useEffect, useState } from "react";

const QUOTES = [
  "Life keeps forcing cruel choices.",
  "Work life is... complicated.",
  "Life as an engineer can be hectic, but the thought of an end product pushes me to keep going.",
  "When life gets hard and I question my value, I just stare at things I made and think to myself 'damn, I really made that'",
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
