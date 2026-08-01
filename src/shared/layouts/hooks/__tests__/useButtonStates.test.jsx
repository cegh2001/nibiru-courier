import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { useButtonStates } from "../useButtonStates";
import { useButtonStore } from "@/layouts/stores/buttonStore";

const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockSearchParamsGet = vi.fn();
const mockSearchParamsToString = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/test-path",
  useSearchParams: () => ({
    get: (key) => mockSearchParamsGet(key),
    toString: () => mockSearchParamsToString(),
  }),
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

describe("useButtonStates Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParamsGet.mockReset();
    mockSearchParamsToString.mockReset();
    mockSearchParamsGet.mockReturnValue(null);
    mockSearchParamsToString.mockReturnValue("");

    // Reset Zustand store to initial in-memory state
    useButtonStore.setState({
      buttonStates: { list: true, create: false, asign: false, multiple: false },
      direction: -1,
      noReset: false,
      currentPathname: "",
      pathChangeCount: 0,
    });
  });

  test("should derive button states synchronously from search params", () => {
    mockSearchParamsGet.mockImplementation((key) => {
      if (key === "view") return "create";
      return null;
    });

    const { result } = renderHook(() => useButtonStates());

    expect(result.current.buttonStates).toEqual({
      list: false,
      create: true,
      asign: false,
      multiple: false,
    });
  });

  test("should default to list view when view parameter is missing", () => {
    mockSearchParamsGet.mockReturnValue(null);

    const { result } = renderHook(() => useButtonStates());

    expect(result.current.buttonStates).toEqual({
      list: true,
      create: false,
      asign: false,
      multiple: false,
    });
  });

  test("should not persist state in localStorage (state isolation)", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    const { result } = renderHook(() => useButtonStates());

    act(() => {
      result.current.setButtonStates({ create: true });
    });

    expect(setItemSpy).not.toHaveBeenCalledWith("button-storage", expect.any(String));
    setItemSpy.mockRestore();
  });

  test("should call router.push when transitioning from list to a subview", () => {
    mockSearchParamsGet.mockReturnValue(null);
    mockSearchParamsToString.mockReturnValue("");

    const { result } = renderHook(() => useButtonStates());

    act(() => {
      result.current.setButtonStates({ create: true });
    });

    expect(mockPush).toHaveBeenCalledWith("/test-path?view=create");
    expect(result.current.direction).toBe(1);
  });

  test("should call router.replace and delete view param when returning to list view", () => {
    mockSearchParamsGet.mockImplementation((key) => {
      if (key === "view") return "create";
      return null;
    });
    mockSearchParamsToString.mockReturnValue("view=create");

    const { result } = renderHook(() => useButtonStates());

    act(() => {
      result.current.setButtonStates({ list: true });
    });

    expect(mockReplace).toHaveBeenCalledWith("/test-path");
    expect(result.current.direction).toBe(-1);
  });

  test("should call router.replace when transitioning between subviews", () => {
    mockSearchParamsGet.mockImplementation((key) => {
      if (key === "view") return "create";
      return null;
    });
    mockSearchParamsToString.mockReturnValue("view=create");

    const { result } = renderHook(() => useButtonStates());

    act(() => {
      result.current.setButtonStates({ asign: true });
    });

    expect(mockReplace).toHaveBeenCalledWith("/test-path?view=asign");
  });

  test("should update direction reactively when search params change externally (browser navigation)", () => {
    let currentView = "list";
    mockSearchParamsGet.mockImplementation((key) => {
      if (key === "view") return currentView;
      return null;
    });

    const { result, rerender } = renderHook(() => useButtonStates());
    expect(result.current.direction).toBe(-1);

    // Navigate to create (forward)
    currentView = "create";
    rerender();

    expect(result.current.direction).toBe(1);

    // Navigate back to list (backward)
    currentView = "list";
    rerender();

    expect(result.current.direction).toBe(-1);
  });
});
