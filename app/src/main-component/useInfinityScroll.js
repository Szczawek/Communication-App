import { useEffect, useRef, useState } from "react";

export default function useInfinityScroll(path, elementToSpy) {
  const [value, setValue] = useState([]);
  const removeSecondLoading = useRef();
  const [allValueLoaded, setAllValueLoaded] = useState(false);
  const [isElementSet, setIsElementSet] = useState(false);
  const [nextCall, setNextCall] = useState(false);

  async function loadData() {
    try {
      const transferData = {
        headers: {
          token: sessionStorage.getItem("session"),
        },
        credentials: "include",
      };
      const res = await fetch(
        `${import.meta.env.VITE_URL}/${path}`,
        transferData
      );
      if (!res.ok) {
        if (res.status === 404) return setAllValueLoaded(true);
        throw res.status;
      }
      const obj = await res.json();
      const { value, limit } = obj;
      setValue((prev) => [...prev, ...value]);
      setAllValueLoaded(true);
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
    console.log(223);
    const detecor = new IntersectionObserver(spyElement);
    if (detecor && elementToSpy) {
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

  return { value, allValueLoaded, setIsElementSet, setValue };
}
