import tyreGreen from "./assets/tyre/tyre-green.svg";
import tyreLightGreen from "./assets/tyre/tyre-light-green.svg";
import tyreBlue from "./assets/tyre/tyre-blue.svg";
import tyreYellow from "./assets/tyre/tyre-yellow.svg";
import axle from "./assets/tyre/axle.svg";
import axleDoubleTyre from "./assets/tyre/axle-double-tyre.svg";
import React, { useRef, useState } from "react";

export function App() {
  const [widgets, setWidgets] = useState(KOMATSU);

  const [isShowJson, setIsShowJson] = useState(false);

  const currentRef = useRef<string | null>(null);
  const targetRef = useRef<string | null>(null);

  function onDrag(e: React.DragEvent) {
    e.currentTarget.classList.add("cursor-grabbing");
  }

  function onDragStart(e: React.DragEvent) {
    currentRef.current = e.currentTarget.id;
  }

  function onDragEnd(e: React.DragEvent) {
    e.currentTarget.classList.remove("cursor-grabbing");
  }

  function onDragLeave() {}

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function onDragEnter(_: React.DragEvent, id: string) {
    // e.preventDefault();

    if (!id) return;

    // Uncommnt this if you dont want dragging on axles
    // if (e.currentTarget.id.includes("axle")) return;

    if (currentRef.current === id) return;

    targetRef.current = id;

    setWidgets((prev) => {
      const prevTyre = [...prev];

      const targetType = prevTyre.find((item) =>
        item.tyres.some((tyre) => tyre.id === id)
      )?.type;

      const tyreList = prevTyre.find((item) => item.type === targetType);
      const tyreListCurrent = prevTyre.find((item) => item.type !== targetType);

      const tyrePrevIndexSingle = tyreList?.tyres.findIndex(
        (item) => item.id === currentRef.current
      );
      const tyrePrevIndexSingleCurrent = tyreListCurrent?.tyres.findIndex(
        (item) => item.id === currentRef.current
      );

      const tyreNextIndexSingle = tyreList?.tyres.findIndex(
        (item) => item.id === id
      );

      const prevTargetTyreSingle = tyreList?.tyres[tyrePrevIndexSingle!];
      const prevTargetTyreSingleCurrent =
        tyreListCurrent?.tyres[
          tyrePrevIndexSingle === -1
            ? tyrePrevIndexSingleCurrent!
            : tyrePrevIndexSingle!
        ];

      const nextTargetTyreSingle = tyreList?.tyres[tyreNextIndexSingle!];

      console.log(
        prevTargetTyreSingle,
        prevTargetTyreSingleCurrent,
        nextTargetTyreSingle
      );

      const swapped = prevTyre.map((item) => {
        return {
          ...item,
          tyres: item.tyres.map((tyre) => {
            if (tyre.id === currentRef.current) return nextTargetTyreSingle;
            if (tyre.id === id)
              return prevTargetTyreSingle || prevTargetTyreSingleCurrent;
            return tyre;
          }),
        };
      });

      console.log(JSON.stringify(swapped, undefined, 2));

      return swapped as typeof KOMATSU;
    });
  }

  return (
    <main>
      <h1 className="text-center text-2xl mt-5">Tyre Drag and Drop</h1>

      <section className="flex flex-col md:flex-row items-start justify-evenly">
        <div className="max-w-[800px] mx-auto md:mx-0 mt-5 border-[1px] border-slate-100 bg-slate-50 rounded-md py-10 px-5">
          <section className="space-y-20">
            {widgets?.map((item, index) => {
              return (
                <div key={index}>
                  {item?.type === "single" && (
                    <div className="flex items-center w-fit mx-auto gap-1">
                      {item?.tyres?.map((_item, _index) => {
                        return (
                          <img
                            id={_item.id}
                            key={_item.id}
                            src={_item.icon}
                            draggable
                            onDrag={onDrag}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                            onDragLeave={onDragLeave}
                            onDragOver={onDragOver}
                            onDragEnter={(e) => onDragEnter(e, _item.id)}
                            className="cursor-grab"
                          />
                        );
                      })}
                    </div>
                  )}

                  {item?.type === "double" && (
                    <div className="flex items-center w-fit mx-auto gap-1">
                      {item?.tyres?.map((_item, _index) => {
                        return (
                          <img
                            id={_item.id}
                            key={_item.id}
                            src={_item.icon}
                            draggable
                            onDrag={onDrag}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                            onDragLeave={onDragLeave}
                            onDragOver={onDragOver}
                            onDragEnter={(e) => onDragEnter(e, _item.id)}
                            className="cursor-grab"
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        </div>

        <div className="flex flex-col justify-center">
          <button onClick={() => setIsShowJson(!isShowJson)}>
            {isShowJson ? "Hide" : "Show"} JSON
          </button>

          {isShowJson && (
            <pre className="mt-5">{JSON.stringify(widgets, undefined, 2)}</pre>
          )}
        </div>
      </section>
    </main>
  );
}

const KOMATSU = [
  {
    type: "single",
    tyres: [
      {
        id: "1",
        icon: tyreGreen,
      },
      {
        id: "2",
        icon: axle,
      },
      {
        id: "3",
        icon: tyreLightGreen,
      },
    ],
  },
  {
    type: "double",
    tyres: [
      {
        id: "4",
        icon: tyreBlue,
      },
      {
        id: "5",
        icon: tyreYellow,
      },
      {
        id: "6",
        icon: axleDoubleTyre,
      },
      {
        id: "7",
        icon: tyreBlue,
      },
      {
        id: "8",
        icon: tyreYellow,
      },
    ],
  },
];
