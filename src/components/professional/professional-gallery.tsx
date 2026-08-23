"use client";

import {
  ChevronLeft,
  ChevronRight,
  Images,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  WheelEvent as ReactWheelEvent,
} from "react";

import type { ProfessionalGalleryItem } from "@/types/professional";

import { SectionHeading } from "./section-heading";

import profileStyles from "./professional-profile.module.css";
import styles from "./professional-gallery.module.css";

type ProfessionalGalleryProps = {
  items: ProfessionalGalleryItem[];
};

type ModalMode =
  | "gallery"
  | "viewer"
  | null;

type PanPosition = {
  x: number;
  y: number;
};

type MouseDragState = {
  active: boolean;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

type SwipeState = {
  active: boolean;
  startX: number;
  startY: number;
};

type TouchPanState = {
  active: boolean;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

type PinchState = {
  distance: number;
  zoom: number;
};

type ImageNaturalSize = {
  width: number;
  height: number;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

const SWIPE_THRESHOLD = 44;

function clampZoom(value: number) {
  return Math.min(
    MAX_ZOOM,
    Math.max(MIN_ZOOM, value),
  );
}

function isControlTarget(
  target: EventTarget | null,
) {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(
    target.closest("button"),
  );
}

export function ProfessionalGallery({
  items,
}: ProfessionalGalleryProps) {
  const [modalMode, setModalMode] =
    useState<ModalMode>(null);

  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);

  const [zoom, setZoom] =
    useState(MIN_ZOOM);

  const [pan, setPan] =
    useState<PanPosition>({
      x: 0,
      y: 0,
    });

  const [dragging, setDragging] =
    useState(false);

  const [
    imageNaturalSize,
    setImageNaturalSize,
  ] =
    useState<ImageNaturalSize | null>(
      null,
    );

  const viewerStageRef =
    useRef<HTMLDivElement | null>(null);

  const viewerImageRef =
    useRef<HTMLDivElement | null>(null);

  const dragRef =
    useRef<MouseDragState>({
      active: false,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
    });

  const swipeRef =
    useRef<SwipeState | null>(null);

  const touchPanRef =
    useRef<TouchPanState | null>(
      null,
    );

  const pinchRef =
    useRef<PinchState | null>(null);

  const selectedItem =
    selectedIndex !== null
      ? items[selectedIndex]
      : null;

  const clearGestureRefs =
    useCallback(() => {
      dragRef.current.active = false;

      swipeRef.current = null;
      touchPanRef.current = null;
      pinchRef.current = null;

      setDragging(false);
    }, []);

  /*
   * Calcula até onde a foto pode ser
   * movimentada em cada direção.
   *
   * Quando conhecemos o tamanho real da
   * imagem, consideramos o tamanho que ela
   * ocupa com background-size: contain.
   *
   * Isso evita que uma foto mais estreita
   * seja completamente jogada para fora
   * da tela.
   */
  const clampPan = useCallback(
    (
      x: number,
      y: number,
      currentZoom: number,
    ): PanPosition => {
      const stage =
        viewerStageRef.current;

      if (
        !stage ||
        currentZoom <= MIN_ZOOM
      ) {
        return {
          x: 0,
          y: 0,
        };
      }

      const stageWidth =
        stage.clientWidth;

      const stageHeight =
        stage.clientHeight;

      if (
        stageWidth <= 0 ||
        stageHeight <= 0
      ) {
        return {
          x: 0,
          y: 0,
        };
      }

      const imageBox =
        viewerImageRef.current;

      const boxWidth =
        imageBox?.offsetWidth ??
        stageWidth;

      const boxHeight =
        imageBox?.offsetHeight ??
        stageHeight;

      let renderedWidth = boxWidth;
      let renderedHeight = boxHeight;

      if (
        imageNaturalSize &&
        imageNaturalSize.width > 0 &&
        imageNaturalSize.height > 0
      ) {
        const scaleToFit = Math.min(
          boxWidth /
            imageNaturalSize.width,

          boxHeight /
            imageNaturalSize.height,
        );

        renderedWidth =
          imageNaturalSize.width *
          scaleToFit;

        renderedHeight =
          imageNaturalSize.height *
          scaleToFit;
      }

      const scaledWidth =
        renderedWidth *
        currentZoom;

      const scaledHeight =
        renderedHeight *
        currentZoom;

      /*
       * Só permitimos pan no eixo onde
       * existe conteúdo ampliado além da
       * área visível.
       */
      const maxX = Math.max(
        0,
        (scaledWidth -
          stageWidth) /
          2,
      );

      const maxY = Math.max(
        0,
        (scaledHeight -
          stageHeight) /
          2,
      );

      return {
        x: Math.max(
          -maxX,
          Math.min(maxX, x),
        ),

        y: Math.max(
          -maxY,
          Math.min(maxY, y),
        ),
      };
    },
    [imageNaturalSize],
  );

  const resetView =
    useCallback(() => {
      setZoom(MIN_ZOOM);

      setPan({
        x: 0,
        y: 0,
      });

      clearGestureRefs();
    }, [clearGestureRefs]);

  const applyZoom = useCallback(
    (value: number) => {
      const nextZoom =
        clampZoom(value);

      setZoom(nextZoom);

      setPan((currentPan) =>
        clampPan(
          currentPan.x,
          currentPan.y,
          nextZoom,
        ),
      );

      if (
        nextZoom <= MIN_ZOOM
      ) {
        touchPanRef.current = null;
      }
    },
    [clampPan],
  );

  const openViewer = useCallback(
    (index: number) => {
      if (!items[index]) {
        return;
      }

      resetView();

      setImageNaturalSize(null);

      setSelectedIndex(index);
      setModalMode("viewer");
    },
    [items, resetView],
  );

  const openGalleryOverview =
    useCallback(() => {
      resetView();

      setImageNaturalSize(null);

      setSelectedIndex(null);
      setModalMode("gallery");
    }, [resetView]);

  const closeModal =
    useCallback(() => {
      resetView();

      setImageNaturalSize(null);

      setSelectedIndex(null);
      setModalMode(null);
    }, [resetView]);

  const previousImage =
    useCallback(() => {
      if (items.length === 0) {
        return;
      }

      resetView();
      setImageNaturalSize(null);

      setSelectedIndex(
        (current) => {
          if (current === null) {
            return 0;
          }

          return (
            (current -
              1 +
              items.length) %
            items.length
          );
        },
      );
    }, [items.length, resetView]);

  const nextImage =
    useCallback(() => {
      if (items.length === 0) {
        return;
      }

      resetView();
      setImageNaturalSize(null);

      setSelectedIndex(
        (current) => {
          if (current === null) {
            return 0;
          }

          return (
            (current + 1) %
            items.length
          );
        },
      );
    }, [items.length, resetView]);

  const zoomIn = useCallback(() => {
    applyZoom(
      zoom + ZOOM_STEP,
    );
  }, [applyZoom, zoom]);

  const zoomOut = useCallback(() => {
    applyZoom(
      zoom - ZOOM_STEP,
    );
  }, [applyZoom, zoom]);

  /*
   * Carrega apenas as dimensões naturais
   * da foto atual para calcular o limite
   * correto do pan.
   */
  useEffect(() => {
    if (!selectedItem?.imageUrl) {
      return;
    }

    let active = true;

    const image =
      new window.Image();

    image.onload = () => {
      if (!active) {
        return;
      }

      setImageNaturalSize({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.src =
      selectedItem.imageUrl;

    return () => {
      active = false;
    };
  }, [selectedItem?.imageUrl]);

  /*
   * Teclado + bloqueio do scroll da página.
   */
  useEffect(() => {
    if (!modalMode) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        closeModal();
        return;
      }

      if (
        modalMode !== "viewer"
      ) {
        return;
      }

      if (
        event.key === "ArrowLeft"
      ) {
        previousImage();
        return;
      }

      if (
        event.key === "ArrowRight"
      ) {
        nextImage();
        return;
      }

      if (
        event.key === "+" ||
        event.key === "="
      ) {
        event.preventDefault();

        zoomIn();

        return;
      }

      if (event.key === "-") {
        event.preventDefault();

        zoomOut();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        originalOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    closeModal,
    modalMode,
    nextImage,
    previousImage,
    zoomIn,
    zoomOut,
  ]);

  /*
   * Se girar o celular ou redimensionar
   * a janela, traz o pan novamente para
   * dentro dos novos limites.
   */
  useEffect(() => {
    if (
      modalMode !== "viewer"
    ) {
      return;
    }

    function handleResize() {
      setPan((currentPan) =>
        clampPan(
          currentPan.x,
          currentPan.y,
          zoom,
        ),
      );
    }

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, [
    clampPan,
    modalMode,
    zoom,
  ]);

  function handleWheel(
    event: ReactWheelEvent<HTMLDivElement>,
  ) {
    event.preventDefault();

    const direction =
      event.deltaY < 0
        ? 1
        : -1;

    applyZoom(
      zoom +
        direction * ZOOM_STEP,
    );
  }

  function handleDoubleClick() {
    if (zoom > MIN_ZOOM) {
      resetView();

      return;
    }

    applyZoom(2);
  }

  /*
   * =======================================================
   * MOUSE
   * =======================================================
   */

  function handleMouseDown(
    event: ReactMouseEvent<HTMLDivElement>,
  ) {
    if (
      zoom <= MIN_ZOOM ||
      event.button !== 0 ||
      isControlTarget(event.target)
    ) {
      return;
    }

    event.preventDefault();

    dragRef.current = {
      active: true,

      startX: event.clientX,
      startY: event.clientY,

      originX: pan.x,
      originY: pan.y,
    };

    setDragging(true);
  }

  function handleMouseMove(
    event: ReactMouseEvent<HTMLDivElement>,
  ) {
    if (
      !dragRef.current.active
    ) {
      return;
    }

    const deltaX =
      event.clientX -
      dragRef.current.startX;

    const deltaY =
      event.clientY -
      dragRef.current.startY;

    const nextPan = clampPan(
      dragRef.current.originX +
        deltaX,

      dragRef.current.originY +
        deltaY,

      zoom,
    );

    setPan(nextPan);
  }

  function stopMouseDragging() {
    dragRef.current.active =
      false;

    setDragging(false);
  }

  /*
   * =======================================================
   * TOUCH
   * =======================================================
   */

  function handleTouchStart(
    event: ReactTouchEvent<HTMLDivElement>,
  ) {
    if (
      isControlTarget(event.target)
    ) {
      return;
    }

    /*
     * Dois dedos = pinch.
     */
    if (
      event.touches.length === 2
    ) {
      swipeRef.current = null;
      touchPanRef.current = null;

      const first =
        event.touches[0];

      const second =
        event.touches[1];

      const distance =
        Math.hypot(
          second.clientX -
            first.clientX,

          second.clientY -
            first.clientY,
        );

      pinchRef.current = {
        distance,
        zoom,
      };

      return;
    }

    if (
      event.touches.length !== 1
    ) {
      return;
    }

    const touch =
      event.touches[0];

    /*
     * Quando existe zoom, um dedo
     * movimenta a própria fotografia.
     */
    if (zoom > MIN_ZOOM) {
      swipeRef.current = null;

      touchPanRef.current = {
        active: true,

        startX:
          touch.clientX,

        startY:
          touch.clientY,

        originX: pan.x,
        originY: pan.y,
      };

      return;
    }

    /*
     * Em 100% um dedo prepara o swipe.
     */
    touchPanRef.current = null;

    swipeRef.current = {
      active: true,

      startX:
        touch.clientX,

      startY:
        touch.clientY,
    };
  }

  function handleTouchMove(
    event: ReactTouchEvent<HTMLDivElement>,
  ) {
    /*
     * PINCH-TO-ZOOM
     */
    if (
      event.touches.length === 2 &&
      pinchRef.current
    ) {
      event.preventDefault();

      swipeRef.current = null;
      touchPanRef.current = null;

      const first =
        event.touches[0];

      const second =
        event.touches[1];

      const currentDistance =
        Math.hypot(
          second.clientX -
            first.clientX,

          second.clientY -
            first.clientY,
        );

      const ratio =
        currentDistance /
        pinchRef.current.distance;

      applyZoom(
        pinchRef.current.zoom *
          ratio,
      );

      return;
    }

    /*
     * PAN COM UM DEDO
     * Apenas quando a fotografia está
     * ampliada.
     */
    if (
      event.touches.length === 1 &&
      zoom > MIN_ZOOM &&
      touchPanRef.current?.active
    ) {
      event.preventDefault();

      const touch =
        event.touches[0];

      const deltaX =
        touch.clientX -
        touchPanRef.current.startX;

      const deltaY =
        touch.clientY -
        touchPanRef.current.startY;

      const nextPan =
        clampPan(
          touchPanRef.current
            .originX +
            deltaX,

          touchPanRef.current
            .originY +
            deltaY,

          zoom,
        );

      setPan(nextPan);

      return;
    }

    /*
     * Em zoom 100%, apenas acompanhamos
     * o gesto. A troca ocorre no TouchEnd.
     */
  }

  function handleTouchEnd(
    event: ReactTouchEvent<HTMLDivElement>,
  ) {
    if (
      event.touches.length < 2
    ) {
      pinchRef.current = null;
    }

    /*
     * Terminando um pan de foto ampliada.
     */
    if (
      touchPanRef.current
    ) {
      if (
        event.touches.length === 0
      ) {
        touchPanRef.current = null;
      }

      swipeRef.current = null;

      return;
    }

    const swipe =
      swipeRef.current;

    if (
      !swipe ||
      !swipe.active ||
      zoom > MIN_ZOOM
    ) {
      swipeRef.current = null;

      return;
    }

    /*
     * Espera o último dedo sair.
     */
    if (
      event.touches.length > 0
    ) {
      return;
    }

    const touch =
      event.changedTouches[0];

    if (!touch) {
      swipeRef.current = null;

      return;
    }

    const deltaX =
      touch.clientX -
      swipe.startX;

    const deltaY =
      touch.clientY -
      swipe.startY;

    const horizontalDistance =
      Math.abs(deltaX);

    const verticalDistance =
      Math.abs(deltaY);

    const isHorizontalSwipe =
      horizontalDistance >=
        SWIPE_THRESHOLD &&
      horizontalDistance >
        verticalDistance * 1.15;

    if (isHorizontalSwipe) {
      /*
       * ← dedo
       * próxima foto
       */
      if (deltaX < 0) {
        nextImage();
      } else {
        /*
         * dedo →
         * foto anterior
         */
        previousImage();
      }
    }

    swipeRef.current = null;
  }

  function handleTouchCancel() {
    swipeRef.current = null;

    touchPanRef.current = null;

    pinchRef.current = null;

    dragRef.current.active = false;

    setDragging(false);
  }

  return (
    <>
      <section
        className={
          profileStyles.card
        }
      >
        <SectionHeading
          icon={
            <Images size={18} />
          }
          title="Galeria de trabalhos"
        />

        <div
          className={
            profileStyles.galleryGrid
          }
        >
          {items
            .slice(0, 6)
            .map(
              (item, index) => (
                <button
                  type="button"
                  key={item.id}
                  className={`${profileStyles.galleryItem} ${styles.galleryButton}`}
                  aria-label={`Abrir ${item.alt}`}
                  onClick={() =>
                    openViewer(index)
                  }
                >
                  <span
                    className={
                      profileStyles.galleryImage
                    }
                    style={{
                      backgroundImage:
                        `url("${item.imageUrl}")`,
                    }}
                    role="img"
                    aria-label={
                      item.alt
                    }
                  />

                  <span
                    className={
                      styles.imageOverlay
                    }
                    aria-hidden="true"
                  >
                    <Plus size={24} />
                  </span>
                </button>
              ),
            )}
        </div>

        {items.length > 0 && (
          <button
            type="button"
            className={
              profileStyles.outlineAction
            }
            onClick={
              openGalleryOverview
            }
          >
            <Images size={16} />

            Ver todas as fotos
          </button>
        )}
      </section>

      {modalMode && (
        <div
          className={
            styles.modalBackdrop
          }
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de trabalhos"
          onClick={closeModal}
        >
          {modalMode ===
            "gallery" && (
            <div
              className={
                styles.galleryModal
              }
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <header
                className={
                  styles.galleryModalHeader
                }
              >
                <div>
                  <span
                    className={
                      styles.galleryModalIcon
                    }
                  >
                    <Images size={20} />
                  </span>

                  <div>
                    <h2>
                      Galeria de trabalhos
                    </h2>

                    <p>
                      {items.length}{" "}
                      {items.length === 1
                        ? "foto"
                        : "fotos"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={
                    styles.closeButton
                  }
                  onClick={
                    closeModal
                  }
                  aria-label="Fechar galeria"
                >
                  <X size={22} />
                </button>
              </header>

              <div
                className={
                  styles.allPhotosGrid
                }
              >
                {items.map(
                  (
                    item,
                    index,
                  ) => (
                    <button
                      type="button"
                      key={item.id}
                      className={
                        styles.allPhotosItem
                      }
                      onClick={() =>
                        openViewer(
                          index,
                        )
                      }
                      aria-label={`Abrir ${item.alt}`}
                    >
                      <span
                        className={
                          styles.allPhotosImage
                        }
                        style={{
                          backgroundImage:
                            `url("${item.imageUrl}")`,
                        }}
                        role="img"
                        aria-label={
                          item.alt
                        }
                      />

                      <span
                        className={
                          styles.photoNumber
                        }
                      >
                        {index + 1}
                      </span>
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {modalMode ===
            "viewer" &&
            selectedItem &&
            selectedIndex !==
              null && (
              <div
                className={
                  styles.viewer
                }
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <div
                  className={
                    styles.viewerToolbar
                  }
                >
                  <button
                    type="button"
                    className={
                      styles.allPhotosButton
                    }
                    onClick={
                      openGalleryOverview
                    }
                    title="Todas as fotos"
                  >
                    <Images size={17} />

                    <span>
                      Todas as fotos
                    </span>
                  </button>

                  <div
                    className={
                      styles.viewerCounter
                    }
                  >
                    {selectedIndex +
                      1}{" "}
                    / {items.length}
                  </div>

                  <div
                    className={
                      styles.toolbarActions
                    }
                  >
                    <button
                      type="button"
                      className={
                        styles.toolbarButton
                      }
                      onClick={
                        zoomOut
                      }
                      disabled={
                        zoom <=
                        MIN_ZOOM
                      }
                      aria-label="Diminuir zoom"
                      title="Diminuir zoom"
                    >
                      <Minus
                        size={19}
                      />
                    </button>

                    <span
                      className={
                        styles.zoomValue
                      }
                    >
                      {Math.round(
                        zoom * 100,
                      )}
                      %
                    </span>

                    <button
                      type="button"
                      className={
                        styles.toolbarButton
                      }
                      onClick={zoomIn}
                      disabled={
                        zoom >=
                        MAX_ZOOM
                      }
                      aria-label="Aumentar zoom"
                      title="Aumentar zoom"
                    >
                      <Plus
                        size={19}
                      />
                    </button>

                    <button
                      type="button"
                      className={`${styles.toolbarButton} ${styles.resetButton}`}
                      onClick={
                        resetView
                      }
                      disabled={
                        zoom ===
                          MIN_ZOOM &&
                        pan.x === 0 &&
                        pan.y === 0
                      }
                      aria-label="Redefinir zoom"
                      title="Redefinir zoom"
                    >
                      <RotateCcw
                        size={18}
                      />
                    </button>

                    <button
                      type="button"
                      className={
                        styles.closeButton
                      }
                      onClick={
                        closeModal
                      }
                      aria-label="Fechar"
                      title="Fechar"
                    >
                      <X size={22} />
                    </button>
                  </div>
                </div>

                <div
                  ref={
                    viewerStageRef
                  }
                  className={
                    styles.viewerStage
                  }
                  onWheel={
                    handleWheel
                  }
                  onDoubleClick={
                    handleDoubleClick
                  }
                  onMouseDown={
                    handleMouseDown
                  }
                  onMouseMove={
                    handleMouseMove
                  }
                  onMouseUp={
                    stopMouseDragging
                  }
                  onMouseLeave={
                    stopMouseDragging
                  }
                  onTouchStart={
                    handleTouchStart
                  }
                  onTouchMove={
                    handleTouchMove
                  }
                  onTouchEnd={
                    handleTouchEnd
                  }
                  onTouchCancel={
                    handleTouchCancel
                  }
                >
                  <div
                    ref={
                      viewerImageRef
                    }
                    className={`${styles.viewerImage} ${
                      zoom > MIN_ZOOM
                        ? styles.viewerImageZoomed
                        : ""
                    } ${
                      dragging
                        ? styles.viewerImageDragging
                        : ""
                    }`}
                    style={{
                      backgroundImage:
                        `url("${selectedItem.imageUrl}")`,

                      transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                    }}
                    role="img"
                    aria-label={
                      selectedItem.alt
                    }
                  />

                  {items.length >
                    1 && (
                    <>
                      <button
                        type="button"
                        className={`${styles.navigationButton} ${styles.previousButton}`}
                        onClick={
                          previousImage
                        }
                        aria-label="Foto anterior"
                      >
                        <ChevronLeft
                          size={30}
                        />
                      </button>

                      <button
                        type="button"
                        className={`${styles.navigationButton} ${styles.nextButton}`}
                        onClick={
                          nextImage
                        }
                        aria-label="Próxima foto"
                      >
                        <ChevronRight
                          size={30}
                        />
                      </button>
                    </>
                  )}
                </div>

                <div
                  className={
                    styles.viewerFooter
                  }
                >
                  <span>
                    {selectedItem.alt}
                  </span>

                  <small
                    className={
                      styles.desktopHint
                    }
                  >
                    Scroll para zoom ·
                    duplo clique para
                    ampliar · arraste para
                    mover
                  </small>

                  <small
                    className={
                      styles.mobileHint
                    }
                  >
                    Deslize para os lados ·
                    pinça para zoom
                  </small>
                </div>
              </div>
            )}
        </div>
      )}
    </>
  );
}