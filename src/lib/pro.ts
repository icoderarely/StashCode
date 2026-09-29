/** System item types that require Pro, per project-overview.md. Display-only for now. */
const PRO_ITEM_TYPE_NAMES = new Set(["File", "Image"]);

export function isProItemType(name: string) {
  return PRO_ITEM_TYPE_NAMES.has(name);
}
