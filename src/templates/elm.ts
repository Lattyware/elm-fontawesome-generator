const upperCaseFirst = (full: string): string =>
  full.slice(0, 1).toUpperCase() + full.slice(1);

export function identifier(name: string) {
  const [first, ...rest] = name.split(
    /[^\p{Lu}\p{Ll}\p{Lt}\p{Lm}\p{Lo}\p{Nd}\p{Nl}_]/u,
  );
  const camelCase = `${first}${rest.map(upperCaseFirst).join("")}`;
  return /^\p{Ll}.*$/u.test(camelCase) ? camelCase : `fa${camelCase}`;
}

export const module = (name: string, body: string, exposing: string[]) => `
module ${name} exposing (${exposing.join(", ")})
${body}
`;
