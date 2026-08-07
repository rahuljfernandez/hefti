/**
 * Returns a React ref/callback that registers a DOM node into a Map keyed by
 * `key`, and removes it on unmount. React invokes the callback with the element
 * on mount and `null` on unmount, so this sets on mount and deletes on unmount.
 *
 * Used wherever a parent keeps a `useRef(new Map())` of child DOM nodes it needs
 * to read later (e.g. capturing a chart card as a PNG, or reading a rendered
 * markdown node's innerHTML for "copy as rich text").
 *
 * @example
 * <div ref={mapRefCallback(assistantContentRefs, message.id)} />
 */
export function mapRefCallback(mapRef, key) {
  return (el) => {
    if (el) {
      mapRef.current.set(key, el);
    } else {
      mapRef.current.delete(key);
    }
  };
}
