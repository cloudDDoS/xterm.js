/**
 * Copyright (c) 2019 The xterm.js authors. All rights reserved.
 * @license MIT
 */

import { IEvent } from 'common/EventEmitter';
import { IRenderDimensions, IRenderer } from 'browser/renderer/Types';
import { IColorSet } from 'browser/Types';
import { ISelectionRedrawRequestEvent as ISelectionRequestRedrawEvent, ISelectionRequestScrollLinesEvent } from 'browser/selection/Types';
import { createDecorator } from 'common/services/ServiceRegistry';
import { IDisposable } from 'common/Types';

export const ICharSizeService = createDecorator<ICharSizeService>('CharSizeService');
export interface ICharSizeService {
  serviceBrand: undefined;

  readonly width: number;
  readonly height: number;
  readonly hasValidSize: boolean;

  readonly onCharSizeChange: IEvent<void>;

  measure(): void;
}

export const ICoreBrowserService = createDecorator<ICoreBrowserService>('CoreBrowserService');
export interface ICoreBrowserService {
  serviceBrand: undefined;

  readonly isFocused: boolean;
}

export const IMouseService = createDecorator<IMouseService>('MouseService');
export interface IMouseService {
  serviceBrand: undefined;

  getCoords(event: {clientX: number, clientY: number}, element: HTMLElement, colCount: number, rowCount: number, isSelection?: boolean): [number, number] | undefined;
  getMouseReportCoords(event: MouseEvent, element: HTMLElement): { col: number, row: number, x: number, y: number } | undefined;
}

export const IRenderService = createDecorator<IRenderService>('RenderService');
export interface IRenderService extends IDisposable {
  serviceBrand: undefined;

  onDimensionsChange: IEvent<IRenderDimensions>;
  /**
   * Fires when buffer changes are rendered. This does not fire when only cursor
   * or selections are rendered.
   */
  onRenderedViewportChange: IEvent<{ start: number, end: number }>;
  /**
   * Fires on render
   */
  onRender: IEvent<{ start: number, end: number }>;
  onRefreshRequest: IEvent<{ start: number, end: number }>;

  dimensions: IRenderDimensions;

  addRefreshCallback(callback: FrameRequestCallback): number;

  refreshRows(start: number, end: number): void;
  clearTextureAtlas(): void;
  resize(cols: number, rows: number): void;
  setRenderer(renderer: IRenderer): void;
  setColors(colors: IColorSet): void;
  onDevicePixelRatioChange(): void;
  onResize(cols: number, rows: number): void;
  // TODO: Is this useful when we have onResize?
  onCharSizeChanged(): void;
  onBlur(): void;
  onFocus(): void;
  onSelectionChanged(start: [number, number] | undefined, end: [number, number] | undefined, columnSelectMode: boolean): void;
  onCursorMove(): void;
  clear(): void;
}

export const ISelectionService = createDecorator<ISelectionService>('SelectionService');
export interface ISelectionService {
  serviceBrand: undefined;

  readonly selectionText: string;
  readonly hasSelection: boolean;
  readonly selectionStart: [number, number] | undefined;
  readonly selectionEnd: [number, number] | undefined;

  readonly onLinuxMouseSelection: IEvent<string>;
  readonly onRequestRedraw: IEvent<ISelectionRequestRedrawEvent>;
  readonly onRequestScrollLines: IEvent<ISelectionRequestScrollLinesEvent>;
  readonly onSelectionChange: IEvent<void>;

  disable(): void;
  enable(): void;
  reset(): void;
  setSelection(row: number, col: number, length: number): void;
  selectAll(): void;
  selectLines(start: number, end: number): void;
  clearSelection(): void;
  rightClickSelect(event: MouseEvent): void;
  shouldColumnSelect(event: KeyboardEvent | MouseEvent): boolean;
  shouldForceSelection(event: MouseEvent): boolean;
  refresh(isLinuxMouseSelection?: boolean): void;
  onMouseDown(event: MouseEvent): void;
  isCellInSelection(x: number, y: number): boolean;
}

export const ICharacterJoinerService = createDecorator<ICharacterJoinerService>('CharacterJoinerService');
export interface ICharacterJoinerService {
  serviceBrand: undefined;

  register(handler: (text: string) => [number, number][]): number;
  deregister(joinerId: number): boolean;
  getJoinedCharacters(row: number): [number, number][];
}
