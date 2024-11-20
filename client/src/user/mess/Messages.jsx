import { useCallback, useContext, useEffect, useRef } from "react";
import MessageTools from "./MessageTools";
import { loadLastMessage } from "./loadLastMessage";
import useInfinityScroll from "../../main-component/useInfinityScroll";
import { UserFunctions } from "../../App";
import RemoveMsg from "./RemoveMsg";
export default function Messages({ ownerID, recipientID }) {
  const { notification } = useContext(UserFunctions);
  const messContainer = useRef(null);
  const elementToSpy = useRef();
  const { value, setIsElementSet, allValueLoaded, setValue } =
    useInfinityScroll(
      `download-messages/${ownerID}/${recipientID}/0`,
      elementToSpy.current
    );

  const setRef = useCallback((element) => {
    if (!element) return;
    elementToSpy.current = element;
    setIsElementSet(true);
  });

  useEffect(() => {
    messContainer.current.scrollTop = messContainer.current.scrollHeight;
  }, [value]);

  function addMessageAndIndex(data) {
    setValue((prev) => [...prev, data]);
    // setIndex((prev) => prev + 1);
  }
  useEffect(() => {
    if (notification != 0 && ownerID != recipientID) {
      const call = async () => {
        const valueToAdd = await loadLastMessage(ownerID, recipientID);
        setValue((prev) => [...prev, ...valueToAdd]);
        console.log("New mess");
      };
      call();
    }
  }, [notification]);

  function removeFromList(id) {
    // IT SHOULD REMOVE MSG FROM VALUE ARRAY
  }

  return (
    <div className="container">
      <div className="messages-window">
        <div className="messages" ref={messContainer}>
          {!allValueLoaded && (
            <p ref={setRef} className="loading">
              Loading...
            </p>
          )}
          {!value[0] && allValueLoaded ? (
            <div className="empty">
              <p className="waiting-message">Empty</p>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          ) : (
            value.map((e) => {
              return (
                <p
                  key={e["date"]}
                  className={`msg ${
                    e.ownerID === ownerID ? "right" : "left"
                  } text`}>
                  {e["message"]}
                  {e.ownerID === ownerID && <RemoveMsg id={e.ownerID} removeFromList={removeFromList} />}
                </p>
              );
            })
          )}
        </div>
      </div>
      <MessageTools
        addMessage={addMessageAndIndex}
        ownerID={ownerID}
        recipientID={recipientID}
      />
    </div>
  );
}
