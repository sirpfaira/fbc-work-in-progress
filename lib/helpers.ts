interface SubItem {
  id: number;
  name: string;
}

interface MainItem {
  id: number;
  name: string;
  sub?: SubItem[];
}

function hasDuplicates(array: MainItem[]): boolean {
  const ids = new Set<number>();
  let mainDuplicates: number[] = [];
  let subDuplicates: number[] = [];

  for (const obj of array) {
    if (ids.has(obj.id)) {
      mainDuplicates.push(obj.id);
    }
    ids.add(obj.id);

    if (obj.sub) {
      const subIds = new Set<number>();
      for (const subObj of obj.sub) {
        if (subIds.has(subObj.id)) {
          subDuplicates.push(subObj.id);
        }
        subIds.add(subObj.id);
      }
    }
  }
  return false;
}

const exampleArray: MainItem[] = [
  {
    id: 1,
    name: "One",
    sub: [
      { id: 201, name: "Two" },
      { id: 202, name: "Two" },
      { id: 201, name: "Two" },
    ],
  },
  {
    id: 2,
    name: "Two",
    sub: [
      { id: 202, name: "Two" },
      { id: 204, name: "Two" },
      { id: 204, name: "Two" },
    ],
  },
  {
    id: 1,
    name: "Three",
    sub: [
      { id: 203, name: "Two" },
      { id: 203, name: "Two" },
      { id: 207, name: "Two" },
    ],
  },
];

console.log(hasDuplicates(exampleArray)); // Should return true for this example
