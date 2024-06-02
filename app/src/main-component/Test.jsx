import { useMemo, useState } from "react";

export default function Test() {
  const [value, setValue] = useState(false);
  const fn = useMemo(() => {
    console.log("Zmiana statu");
  }, [value]);
  return (
    <div className="test">
      <h2>Test</h2> 
      <button onClick={() => setValue((prev) => !prev)}>Send</button>
    </div>
  );
}
