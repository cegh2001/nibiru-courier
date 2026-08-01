import { fetcher } from "@/services/fetcher";

const isEntityRecord = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const normalizeQuickCreateText = (value) =>
  String(value ?? "").trim().toLowerCase();

export async function resolveCreatedEntity({ endpoint, result, match }) {
  if (isEntityRecord(result) && result.id) {
    return result;
  }

  const items = await fetcher(endpoint);

  if (!Array.isArray(items)) {
    return null;
  }

  return items.find((item) => {
    try {
      return match(item);
    } catch {
      return false;
    }
  }) || null;
}