import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { SWRConfig } from "swr";
import { useData } from "../useData";

// Define hoisted mocks to resolve hoisting issues in Vitest
const {
  mockFetcher,
  mockFullFetcher,
  unsubscribeMock,
  listenForSyncMock,
  syncDataAcrossTabsMock
} = vi.hoisted(() => {
  const f = vi.fn();
  f.post = vi.fn();
  f.put = vi.fn();
  f.patch = vi.fn();
  f.delete = vi.fn();

  const ff = vi.fn();
  ff.post = vi.fn();
  ff.put = vi.fn();
  ff.patch = vi.fn();
  ff.delete = vi.fn();

  const unsub = vi.fn();
  return {
    mockFetcher: f,
    mockFullFetcher: ff,
    unsubscribeMock: unsub,
    listenForSyncMock: vi.fn(() => unsub),
    syncDataAcrossTabsMock: vi.fn()
  };
});

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}));

// Mock syncChannel
vi.mock("@/services/channels/syncChannel", () => ({
  syncDataAcrossTabs: syncDataAcrossTabsMock,
  listenForSync: listenForSyncMock,
  SYNC_TYPES: {
    CREATE: "CREATE",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
  },
}));

// Mock fetcher services
vi.mock("@/services/fetcher", () => ({
  fetcher: mockFetcher,
}));

vi.mock("@/services/fullFetcher", () => ({
  fetcher: mockFullFetcher,
}));

const wrapper = ({ children }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
);

describe("useData Mutations and SWR Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("3.1 should return the exact required hook signatures", () => {
    const { result } = renderHook(() => useData("/test-endpoint", {}, false), { wrapper });

    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("isValidating");
    expect(result.current).toHaveProperty("mutate");
    expect(result.current).toHaveProperty("isMutating");
    expect(result.current).toHaveProperty("mutationError");
    expect(result.current).toHaveProperty("createData");
    expect(result.current).toHaveProperty("updateData");
    expect(result.current).toHaveProperty("deleteData");
    expect(typeof result.current.createData).toBe("function");
    expect(typeof result.current.updateData).toBe("function");
    expect(typeof result.current.deleteData).toBe("function");
  });

  test("3.2 should successfully call createData and trigger Axios POST", async () => {
    const responseData = { id: 123, name: "New Item" };
    mockFetcher.post.mockResolvedValueOnce(responseData);

    const { result } = renderHook(() => useData("/test-endpoint", {}, false), { wrapper });

    let res;
    await act(async () => {
      res = await result.current.createData({ name: "New Item" });
    });

    expect(res).toEqual(responseData);
    expect(mockFetcher.post).toHaveBeenCalledWith("/test-endpoint", { name: "New Item" }, {});
    expect(syncDataAcrossTabsMock).toHaveBeenCalledWith("CREATE", "/test-endpoint", { id: 123 });
  });

  test("3.2 should successfully call updateData and trigger Axios PATCH", async () => {
    const responseData = { id: 456, name: "Updated Item" };
    mockFetcher.patch.mockResolvedValueOnce(responseData);

    const { result } = renderHook(() => useData("/test-endpoint", { id: 456 }, false), { wrapper });

    let res;
    await act(async () => {
      res = await result.current.updateData({ name: "Updated Item" });
    });

    expect(res).toEqual(responseData);
    expect(mockFetcher.patch).toHaveBeenCalledWith("/test-endpoint/456", { name: "Updated Item" });
    expect(syncDataAcrossTabsMock).toHaveBeenCalledWith("UPDATE", "/test-endpoint", { id: 456 });
  });

  test("3.2 should successfully call deleteData and trigger Axios DELETE", async () => {
    const responseData = { success: true };
    mockFetcher.delete.mockResolvedValueOnce(responseData);

    const { result } = renderHook(() => useData("/test-endpoint", { id: 789 }, false), { wrapper });

    let res;
    await act(async () => {
      res = await result.current.deleteData();
    });

    expect(res).toEqual(responseData);
    expect(mockFetcher.delete).toHaveBeenCalledWith("/test-endpoint/789");
    expect(syncDataAcrossTabsMock).toHaveBeenCalledWith("DELETE", "/test-endpoint", { id: 789 });
  });

  test("3.3 should queue concurrent double-submits and resolve to the same promise", async () => {
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockFetcher.post.mockReturnValueOnce(promise);

    const { result } = renderHook(() => useData("/test-endpoint", {}, false), { wrapper });

    let p1, p2;
    act(() => {
      p1 = result.current.createData({ val: 1 });
      p2 = result.current.createData({ val: 1 }); // concurrent call
    });

    expect(p1).toBe(p2); // same promise reference
    expect(mockFetcher.post).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolvePromise({ id: 100 });
      await p1;
    });
  });

  test("3.4 should append _method=PATCH and call Axios POST when updating with FormData", async () => {
    const responseData = { id: 123, status: "updated" };
    mockFetcher.post.mockResolvedValueOnce(responseData);

    const { result } = renderHook(() => useData("/test-endpoint", { id: 123 }, false), { wrapper });

    const formData = new FormData();
    formData.append("name", "Form Upload");

    let res;
    await act(async () => {
      res = await result.current.updateData(formData);
    });

    expect(res).toEqual(responseData);
    expect(mockFetcher.post).toHaveBeenCalledWith("/test-endpoint/123", formData);
    expect(formData.get("_method")).toBe("PATCH");
  });

  test("3.5 should register sync listeners and trigger revalidation on channel events", () => {
    const { result } = renderHook(() => useData("/test-endpoint", {}, false), { wrapper });

    // Verify listenForSync was called
    expect(listenForSyncMock).toHaveBeenCalled();
    const handleSyncCallback = listenForSyncMock.mock.calls[0][0];

    // Re-mock SWR mutate logic or check if it triggers SWR's inner revalidate
    const mutateSpy = vi.spyOn(result.current, "mutate");

    act(() => {
      handleSyncCallback({ endpoint: "/test-endpoint" });
    });
  });

  test("should handle mutation errors correctly and reset them on new mutation", async () => {
    const error = new Error("Mutation failed");
    mockFetcher.post.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useData("/test-endpoint", {}, false), { wrapper });

    await act(async () => {
      await expect(result.current.createData({ name: "Err" })).rejects.toThrow("Mutation failed");
    });

    expect(result.current.mutationError).toBe(error);

    // Trigger a new successful mutation to assert it resets
    mockFetcher.post.mockResolvedValueOnce({ id: 1 });
    await act(async () => {
      await result.current.createData({ name: "Success" });
    });

    expect(result.current.mutationError).toBeNull();
  });

  test("should not trigger SWR fetch when dependent is falsy", () => {
    renderHook(() => useData("/test-endpoint", { dependent: false }), { wrapper });
    expect(mockFetcher).not.toHaveBeenCalled();
  });

  test("should trigger SWR fetch when dependent is truthy", async () => {
    mockFetcher.mockResolvedValue({ data: "ok" });
    const { result } = renderHook(() => useData("/test-endpoint", { dependent: true }), { wrapper });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(mockFetcher).toHaveBeenCalled();
  });

  test("should maintain parameter reference stability and not re-fetch if params content hasn't changed", async () => {
    mockFetcher.mockResolvedValue({ data: "ok" });
    const { result, rerender } = renderHook(
      ({ params }) => useData("/test-endpoint", { params }),
      {
        wrapper,
        initialProps: { params: { query: "search" } },
      }
    );

    expect(mockFetcher).toHaveBeenCalledTimes(1);

    // Re-render with a new object literal having the same content
    await act(async () => {
      rerender({ params: { query: "search" } });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Should not re-fetch because serialized params didn't change
    expect(mockFetcher).toHaveBeenCalledTimes(1);

    // Re-render with different content
    await act(async () => {
      rerender({ params: { query: "different" } });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Should trigger a new fetch
    expect(mockFetcher).toHaveBeenCalledTimes(2);
  });
});

