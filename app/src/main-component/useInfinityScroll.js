import { useEffect, useRef, useState } from "react";

export default function useInfinityScroll(path, elementToSpy) {
  const [value, setValue] = useState([]);
  const removeSecondLoading = useRef();
  const [allMessLoaded, setAllMessLoaded] = useState(false);
  const [isElementSet, setIsElementSet] = useState(false);
  const [nextCall, setNextCall] = useState(false);

  async function loadData() {
    try {
      const transferData = {
        headers: {
          token: localStorage.getItem("session"),
        },
        credentials: "include",
      };
      const res = await fetch(
        `${import.meta.env.VITE_URL}/${path}`,
        transferData
      );
      if (!res.ok) {
        if (res.status === 404) return setAllMessLoaded(true);
        throw res.status;
      }
      const obj = res.json();
      setValue((prev) => [...prev, ...obj]);
      console.log("Loading no. 1");
      setAllMessLoaded(true);
    } catch (err) {
      console.error(`Error with loading datas #infinity-scroll-error: ${err}`);
    }
  }

  function callLoading() {
    removeSecondLoading.current = false;
    setNextCall((prev) => !prev);
  }

  function spyElement(e) {
    if (e[0].isIntersecting <= 0) return;
    console.log("I catch you!");
    loadData();
  }

  useEffect(() => {
    const detecor = new IntersectionObserver(spyElement);
    if (detecor && elementToSpy) {
      console.log(1);
      detecor.observe(elementToSpy);
    }
    return () => {
      if (detecor && elementToSpy) {
        detecor.disconnect();
      }
      if (removeSecondLoading.current === undefined)
        removeSecondLoading.current = true;
    };
  }, [nextCall, isElementSet]);

  return { value, allMessLoaded, setIsElementSet };
}
