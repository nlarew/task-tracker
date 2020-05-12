import * as React from "react";

type ComparisonElement = { [key: string]: any };

function getDescendantProp(obj: ComparisonElement, desc: string) {
  let descendant = { ...obj };
  var arr = desc.split(".");
  while (arr.length) {
    const nextIndex = arr.shift();
    if (nextIndex) {
      const next = descendant[nextIndex];
      if (next) {
        descendant = next;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return descendant;
}

type Groups<T> = {
  [key: string]: Array<T>;
}
export default function useGroupBy<T>(documents: Array<T>, property: string) {
  const reducer = (groups: Groups<T>, doc: T) => {
    const groupId = String(getDescendantProp(doc, property));
    return {
      ...groups,
      [groupId]: [
        ...(groups[groupId] || []),
        doc
      ]
    }
  };
  const group = (): Groups<T> => {
    return documents.reduce(reducer, {})
  }

  const [grouped, setGrouped] = React.useState<Groups<T>>(group())
  React.useEffect(() => {
    setGrouped(group())
  }, [documents, property])

  return grouped
}
