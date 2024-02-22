import { useState } from "react";
import { twJoin } from "tailwind-merge";

type Record = {
  id?: number;
  eventName?: string;
  modifierState?: string;
  shift?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  meta?: boolean;
  key?: string;
  code?: string;
  location?: number;
  repeat?: boolean;
  isComposing?: boolean;
  inputType?: string;
  data?: string | null;
  detail?: number;
  innerText?: string;
};

function calcLocation(location: number | undefined) {
  if (location == 1) {
    return "LEFT";
  }
  if (location == 2) {
    return "RIGHT";
  }
  if (location == 3) {
    return "NUMPAD";
  }
  return `${location}`;
}

function addRecordByKeyboardEvent(
  e: React.KeyboardEvent,
  set: (
    value: React.SetStateAction<{
      events: Record[];
      currentId: number;
    }>
  ) => void
) {
  set((prevData) => {
    return {
      events: [
        {
          id: prevData.currentId,
          eventName: e.type,
          modifierState: e.getModifierState("CapsLock")
            ? "CapsLock"
            : e.getModifierState("NumLock")
            ? "NumLock"
            : e.getModifierState("ScrollLock")
            ? "ScrollLock"
            : "",
          shift: e.shiftKey,
          ctrl: e.ctrlKey,
          alt: e.altKey,
          meta: e.metaKey,
          key: e.key,
          code: e.code,
          location: e.location,
          repeat: e.repeat,
          isComposing: e.nativeEvent.isComposing,
          innerText: (e.target as HTMLDivElement).innerText,
        },
        ...prevData.events,
      ],
      currentId: prevData.currentId + 1,
    };
  });
}

const Boolean: React.FC<{ value: boolean | undefined }> = ({ value }) => {
  if (value === true) {
    return <span className="text-green-600">✓</span>;
  }
  if (value === false) {
    return <span className="text-red-200">✗</span>;
  }

  return <span className="text-gray-200">-</span>;
};

function addRecordByInputEvent(
  e: React.FormEvent<HTMLDivElement>,
  set: (
    value: React.SetStateAction<{
      events: Record[];
      currentId: number;
    }>
  ) => void
) {
  set((prevData) => {
    console.log("e", e);
    return {
      events: [
        {
          id: prevData.currentId,
          eventName: e.type,
          modifierState: "",
          shift: false,
          ctrl: false,
          alt: false,
          meta: false,
          key: "",
          code: "",
          location: 0,
          repeat: false,
          isComposing: false,
          inputType: (e.nativeEvent as InputEvent).inputType,
          data: (e.nativeEvent as InputEvent).data,
          detail: (e.nativeEvent as InputEvent).detail,
          innerText: (e.target as HTMLDivElement).innerText,
        },
        ...prevData.events,
      ],
      currentId: prevData.currentId + 1,
    };
  });
}

function App() {
  const [data, setData] = useState<{
    events: Record[];
    currentId: number;
  }>({
    events: [],
    currentId: 0,
  });

  return (
    <main>
      <h1 className="text-xl text-bold">
        Content Editable Keyboard Event Viewer for React
      </h1>
      <p>
        This is a simple app that allows you to see the keyboard events when you
        type in the content editable div below.
      </p>
      <p>
        userAgent: <code>{navigator.userAgent}</code>
      </p>
      <div
        contentEditable
        onKeyDown={(e) => addRecordByKeyboardEvent(e, setData)}
        onKeyUp={(e) => addRecordByKeyboardEvent(e, setData)}
        onInput={(e) => addRecordByInputEvent(e, setData)}
        onBeforeInput={(e) => addRecordByInputEvent(e, setData)}
        onCompositionEnd={(e) => addRecordByInputEvent(e, setData)}
        onCompositionStart={(e) => addRecordByInputEvent(e, setData)}
        onCompositionUpdate={(e) => addRecordByInputEvent(e, setData)}
      />

      <table>
        <thead>
          <tr>
            <th>no</th>
            <th>eventName</th>
            <th>modifierState</th>
            <th>shift</th>
            <th>ctrl</th>
            <th>alt</th>
            <th>meta</th>
            <th>key</th>
            <th>code</th>
            <th>location</th>
            <th>repeat</th>
            <th>isComposing</th>
            <th>inputType</th>
            <th>data</th>
            <th>innerText</th>
          </tr>
        </thead>
        <tbody>
          {data.events.map((event) => (
            <tr
              key={event.id}
              style={{ textAlign: "center" }}
              className={twJoin(
                event.eventName === "input" && "bg-yellow-50",
                event.eventName === "keydown" && "bg-blue-100"
                // event.eventName === "keyup" && "bg-yellow-100"
              )}
            >
              <td>{event.id}</td>
              <td>{event.eventName}</td>
              <td>{event.modifierState}</td>
              <td>
                <Boolean value={event.shift} />
              </td>
              <td>
                <Boolean value={event.ctrl} />
              </td>
              <td>
                <Boolean value={event.alt} />
              </td>
              <td>
                <Boolean value={event.meta} />
              </td>
              <td>{event.key}</td>
              <td>{event.code}</td>
              <td>{calcLocation(event.location)}</td>
              <td>
                <Boolean value={event.repeat} />
              </td>
              <td>
                <Boolean value={event.isComposing} />
              </td>
              <td>{event.inputType}</td>
              <td>{event.data}</td>
              <td style={{ textAlign: "left" }}>{event.innerText}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;
