  import { useCallback, useRef } from "react";
  import ProfileLink from "./ProfileLink";
  import useInfinityScroll from "./useInfinityScroll";
  import "./home.css";


  export default function Home({ id }) {
    const elementToSpy = useRef();
    const { value, allValueLoaded, setIsElementSet, setValue } =
      useInfinityScroll(`users/${id}`, elementToSpy.current);

    const setRef = useCallback((element) => {
      if (!element) return;
      elementToSpy.current = element;
      setIsElementSet(true);
    }, []);
    return (
      <div className="home">
        <ul className="friends-list">
          {value.map((e, i) => {
            return (
              <ProfileLink
                key={e["date"]}
                data={e}
                setArray={setValue}
                index={i}
              />
            );
          })}
        </ul>
        {!allValueLoaded && <p className="loading-home" ref={setRef}>Loading ...</p>}
        {!value[0] && allValueLoaded ? (
          <p className="empty-list">Empty</p>
        ) : null}
      </div>
    );
  }
