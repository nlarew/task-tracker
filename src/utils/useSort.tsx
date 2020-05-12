/** @jsx jsx */
import * as React from "react";
import { css, jsx } from "@emotion/core";

type ComparisonElement = { [key: string]: any };

type SortingFunction = (
  lhs: ComparisonElement,
  rhs: ComparisonElement
) => number;

type SortActions = {
  sortByProperty: (property: string) => void;
  sortAscending: () => void;
  sortDescending: () => void;
};

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
const sortByProperty = (
  propertyName: string,
  sortDirection: number = 1
): SortingFunction => {
  return (lhs, rhs) => {
    const resolvedLhs = getDescendantProp(lhs, propertyName);
    const resolvedRhs = getDescendantProp(rhs, propertyName);
    const isLessThan = resolvedLhs < resolvedRhs;
    if (isLessThan) return -1 * sortDirection;
    const isEqual = resolvedLhs === resolvedRhs;
    if (isEqual) return 0;
    return 1 * sortDirection;
  };
};

interface UseSortConfig {
  sortBy: string;
  sortDirection?: number;
}

export default function useSort<T>(unsorted: Array<T>, defaults: UseSortConfig) {
  const [sortBy, setSortBy] = React.useState<string>(defaults.sortBy);
  const [sortDirection, setSortDirection] = React.useState<number>(defaults.sortDirection || 1);
  const [sorted, setSorted] = React.useState(
    unsorted.sort(sortByProperty(sortBy, sortDirection))
  );
  React.useEffect(() => {
    setSorted((prevSorted) => [
      ...prevSorted.sort(sortByProperty(sortBy, sortDirection)),
    ]);
  }, [sortBy, sortDirection]);
  // const sortByStatus = () => {
  //   setSortBy("status")
  // }
  // const sortByAssigneeName = () => {
  //   setSortBy("assignee.name")
  // }
  const actions: SortActions = React.useMemo(
    () => ({
      sortByProperty: (property: string) => {
        setSortBy(property);
      },
      sortAscending: () => {
        setSortDirection(1);
      },
      sortDescending: () => {
        setSortDirection(-1);
      },
    }),
    []
  );

  return { sorted, actions };
}

export function SortControls({ sortAscending, sortDescending }: SortActions) {
  return (
    <div
      css={css`
        display: flex;
        justify-content: space-between;
      `}
    >
      <div>
        <span
          css={css`
            font-size: 12px;
          `}
        >
          Sort By:
        </span>
        <button onClick={() => sortByProperty("status")}>Status</button>
        <button onClick={() => sortByProperty("assignee.name")}>
          Assignee
        </button>
      </div>
      <div>
        <span
          css={css`
            font-size: 12px;
          `}
        >
          Direction:
        </span>
        <button onClick={() => sortAscending()}>Ascending</button>
        <button onClick={() => sortDescending()}>Descending</button>
      </div>
    </div>
  );
}
