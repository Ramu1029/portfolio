import { AnimatePresence, motion } from 'framer-motion';

export default function ConfirmDialog({ open, title, description, onConfirm, onCancel, confirmLabel = 'Delete' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-bg/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-sm p-6"
          >
            <h3 className="font-display text-lg font-medium text-white mb-2">{title}</h3>
            <p className="text-sm text-light-accent/60 mb-6">{description}</p>
            <div className="flex justify-end gap-3">
              <button onClick={onCancel} className="btn-ghost !px-5 !py-2 text-sm">Cancel</button>
              <button
                onClick={onConfirm}
                className="rounded-full bg-red-500/90 hover:bg-red-500 text-white px-5 py-2 text-sm font-medium transition-colors"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
