import { useEffect, useMemo, useRef, useState } from "react";
import MessageTools from "./MessageTools";
import useFetchMessages from "./useFetchMessages";
import useWaitingForMessage from "../main-component/waitingForMessage";

export default function Messages({ ownerID, recipientID }) {
  const [index, setIndex] = useState(0);
  const loadingElement = useRef(null);
  const [loading, setLoading] = useState(true);
  const { userMessages, addMessage, refreshMessages } = useFetchMessages(
    ownerID,
    recipientID,
    index
  );
  const messContainer = useRef(null);
  const wsInfo = useWaitingForMessage(ownerID, refreshMessages);

  useEffect(() => {
    if (messContainer.current)
      messContainer.current.scrollTop = messContainer.current.scrollHeight;
  }, [userMessages]);

// 
// 
// 
// TO DO 
// TO DO 
// TO DO 
// TO DO 
  useEffect(() => {
    const observer = new IntersectionObserver(test);
    console.log(loadingElement);
    if (observer && loadingElement.current) {
      console.log(2);
      observer.observe(loadingElement.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);


  function test(e) {
    if (e[0].isInterseting) {
      console.log(2);
    }
  }
  return (
    <div className="container">
      <button onClick={() => setLoading(false)}>Send</button>
      <div className="messages-window">
        <div className="messages" ref={messContainer}>
          {loading && (
            <p ref={loadingElement} className="loaing">
              Loading...
            </p>
          )}
          {!userMessages[0] ? (
            <p className="empty">Empty...</p>
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
        addMessage={addMessage}
        ownerID={ownerID}
        recipientID={recipientID}
      />
    </div>
  );
}
