export const TRANSITIONS = {
    spring: { type: "spring", stiffness: 300, damping: 30 },
    easeOut: { duration: 0.3, ease: "easeOut" },
    page: { duration: 0.4, ease: "easeInOut" }
};

export const VARIANTS = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    },
    item: {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: TRANSITIONS.easeOut
        }
    },
    page: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    },
    cardHover: {
        y: -4,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
    },
    tap: {
        scale: 0.98
    }
};

export const SPACING = {
    cardPadding: "p-6", // 24px - Confidence
    sectionGap: "gap-8", // 32px
    layoutPadding: "p-8 md:p-12", // generous spacing
};
