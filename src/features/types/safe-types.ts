/**
 * SSR safe types
 */

import {HAS_DOCUMENT_SUPPORT, HAS_WINDOW_SUPPORT} from '../utils/env'

const w = HAS_WINDOW_SUPPORT ? window : {}
export const DOCUMENT = HAS_DOCUMENT_SUPPORT

export const Element = HAS_WINDOW_SUPPORT

export const HTMLElement = HAS_WINDOW_SUPPORT

export const SVGElement = HAS_WINDOW_SUPPORT

export const File = HAS_WINDOW_SUPPORT
