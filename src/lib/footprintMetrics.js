/**
 * Shared footprint geometry: turns property/facility records into map markers
 * plus the bounding box the map fits on load. Pure lat/lng shaping with no
 * owner/state knowledge — each context module wraps this with its own mock
 * default, and the consuming PropertyFootprint organism is likewise context-free.
 *
 * Records need `latitude`, `longitude`, `id`, `facility_name`, `related_party`.
 * Bounds are a plain [[minLat, minLng], [maxLat, maxLng]] box so callers stay
 * Leaflet-free — the map turns it into a LatLngBounds. Null when nothing has
 * coordinates, so the map falls back to a default viewport instead of fitting an
 * empty box.
 */
export function buildFootprint(records) {
  const list = Array.isArray(records) ? records : [];
  const markers = list
    .filter((r) => Number.isFinite(r.latitude) && Number.isFinite(r.longitude))
    .map((r) => ({
      id: r.id,
      position: [r.latitude, r.longitude],
      label: r.facility_name,
      relatedParty: Boolean(r.related_party),
    }));

  const bounds = markers.reduce((box, { position: [lat, lng] }) => {
    if (box === null) {
      return [
        [lat, lng],
        [lat, lng],
      ];
    }
    return [
      [Math.min(box[0][0], lat), Math.min(box[0][1], lng)],
      [Math.max(box[1][0], lat), Math.max(box[1][1], lng)],
    ];
  }, null);

  return {
    markers,
    bounds,
    relatedPartyCount: markers.filter((m) => m.relatedParty).length,
    totalCount: markers.length,
  };
}
