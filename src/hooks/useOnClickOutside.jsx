import { useEffect } from 'react';

const useOnClickOutside = (ref, handler) => {
  useEffect(
    () => {
      const listener = event => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      // Attach a listener for mousedown and touchstart events
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      // Return a method to remove listeners for mousedown and touchstart events
      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    [ref, handler]
  );
};

export default useOnClickOutside;
