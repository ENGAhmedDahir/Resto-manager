import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

const ModalContext = createContext();

export function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, {
    onClick: (e) => {
      children.props.onClick?.(e);
      open(opensWindowName);
    },
  });
}

function Window({
  children,
  name,
  title,
  description,
  size = "md",
  showCloseButton = true,
  className,
}) {
  const { openName, close } = useContext(ModalContext);

  if (name !== openName) return null;

  return createPortal(
    <AnimatePresence>
      <>
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <div className="fixed inset-0 z-50 ">
          <div className="flex min-h-full items-center justify-center  p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "w-full rounded-2xl border bg-card text-card-foreground shadow-elevated my-0 max-h-[90vh] flex flex-col",
                sizeClasses[size],
                className,
              )}
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-card)",
                color: "var(--color-card-foreground)",
              }}
            >
              {/* Header */}
              {(title || description || showCloseButton) && (
                <div
                  className="flex items-start justify-between gap-4 border-b px-4 py-2 flex-shrink-0"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div>
                    {title && (
                      <h2
                        className="text-lg font-semibold"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        {description}
                      </p>
                    )}
                  </div>
                  {showCloseButton && (
                    <Button
                      onClick={close}
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-2  overflow-y-auto flex-1">
                {typeof children === "function"
                  ? children({ onCloseModal: close })
                  : cloneElement(children, { onCloseModal: close })}
              </div>
            </motion.div>
          </div>
        </div>
      </>
    </AnimatePresence>,
    document.body,
  );
}

function Footer({ children, className }) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3   flex-shrink-0 ",
        className,
      )}
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-card)",
        color: "var(--color-card-foreground)",
      }}
    >
      {children}
    </div>
  );
}

Modal.Open = Open;
Modal.Window = Window;
Modal.Footer = Footer;

export default Modal;
