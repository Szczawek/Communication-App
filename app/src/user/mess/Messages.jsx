import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MessageTools from "./MessageTools";
import useFetchMessages from "./useFetchMessages";
import useWaitingForMessage from "../../main-component/waitingForMessage"

export default function Messages({ ownerID, recipientID }) {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stopScrolling, setStopScrolling] = useState(false);
  const loadingElement = useRef(null);
  const messContainer = useRef(null);
  const { userMessages, addMessage, lastMessageRefresh, loadMessages, limit } =
    useFetchMessages(ownerID, recipientID, index);
  const [messageContainerHeight, setMessageContainerHeight] = useState(0);

  useWaitingForMessage(ownerID, lastMessageRefresh);

  useEffect(() => {
    // if (messContainer.current) {
    //   setMessageContainerHeight(messContainer.current.scrollHeight);
    //   // First time loading and Scroll to the top
    //   if (index === 20) {
    messContainer.current.scrollTop = messContainer.current.scrollHeight;
    //   } else {
    //     messContainer.current.scrollTop =
    //       messContainer.current.scrollHeight - messageContainerHeight;
    //   }
    // }
    // if (messContainer.current && index === 20) {
    // }
  }, [userMessages]);

  function addMessageAndIndex(data) {
    addMessage(data);
    setIndex((prev) => prev + 1);
  }

  useEffect(() => {
    const observer = new IntersectionObserver(spyLoadingElement);
    if (observer && loadingElement.current) {
      observer.observe(loadingElement.current, { thresholds: 1.0 });
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [index]);

  async function spyLoadingElement(e) {
    if (stopScrolling || (index === limit && index !== 0)) return;
    if (e[0].isIntersecting) {
      await loadMessages(index);
      if (limit - (index + 20) <= 0 && index !== 0) {
        setIndex((prev) => prev + limit - index);
        setStopScrolling(true);
        setLoading(false);
        return;
      }
      setIndex((prev) => prev + 20);
    }
  }

  return (
    <div className="container">
      <div className="messages-window">
        <div className="messages" ref={messContainer}>
          {loading && (
            <p ref={loadingElement} className="loading">
              Loading...
            </p>
          )}
          {!userMessages[0] && !loading ? (
            <div className="empty">
              <p className="waiting-message">Empty</p>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          ) : (
            userMessages.map((e) => {
              return (
                <p
                  key={e["date"]}
                  className={`${
                    e["ownerID"] === ownerID ? "right" : "left"
                  } text`}>
                  {e["message"]}
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
