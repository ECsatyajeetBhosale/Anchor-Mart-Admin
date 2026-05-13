/**
 * hooks/useAppDispatch.ts
 *
 * Typed versions of the standard react-redux hooks.
 *
 * Why do we need these?
 * The default `useDispatch` and `useSelector` from react-redux don't know
 * about our specific store types. These typed versions fix that, giving us
 * full autocompletion and type safety throughout the app.
 *
 * Usage:
 *   const dispatch = useAppDispatch();
 *   const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
 */

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";

// Use this instead of plain `useDispatch()`
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Use this instead of plain `useSelector()`
export const useAppSelector = <T>(selector: (state: RootState) => T): T => useSelector(selector);
