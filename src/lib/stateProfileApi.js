async function requestJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function ownerFromLink(link) {
  if (!link) return null;

  const entity = link.ownership_entity;
  const name = entity?.cms_ownership_name ?? link.cms_ownership_name ?? null;
  return name ? { slug: entity?.slug ?? null, name } : null;
}

/* The legacy /facilities response carries the complete ownership-link graph.
   Normalize just the two owner shapes /state-facilities returns so consumers do
   not need to know which endpoint served the rows during a rolling deploy. */
export function normalizeLegacyStateFacility(facility) {
  const links = facility?.facility_ownership_links ?? [];
  return {
    ...facility,
    owner: ownerFromLink(links.find((link) => link?.is_display_owner)),
    primary_owner: ownerFromLink(links[0]),
  };
}

/* /state-profile replaces three older state routes. A 404 can mean the new
   route has not reached the backend yet, so retry the legacy contract. If both
   profile routes return 404, the state itself is genuinely unavailable. */
export async function loadStateProfile(apiBaseUrl, state, year, signal) {
  const code = encodeURIComponent(state);
  const common = `year=${year}&take=500&minFacilities=2`;

  try {
    return await requestJson(
      `${apiBaseUrl}/state-profile/${code}?${common}`,
      signal,
    );
  } catch (error) {
    if (error.status !== 404) throw error;
  }

  let stats;
  try {
    stats = await requestJson(
      `${apiBaseUrl}/state-stats/${code}?year=${year}`,
      signal,
    );
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }

  const [chains, individuals] = await Promise.all([
    requestJson(`${apiBaseUrl}/state-chain-burden/${code}?${common}`, signal),
    requestJson(
      `${apiBaseUrl}/state-individual-burden/${code}?${common}`,
      signal,
    ),
  ]);

  return {
    ...stats,
    chain_burden: chains?.data ?? [],
    individual_burden: individuals?.data ?? [],
  };
}

/* /state-facilities is the slim production path. The generic endpoint fallback
   is intentionally temporary and expensive, but keeps a frontend-first deploy
   usable until the backend route arrives. */
export async function loadStateFacilities(apiBaseUrl, state, year, signal) {
  const code = encodeURIComponent(state.toUpperCase());

  try {
    const payload = await requestJson(
      `${apiBaseUrl}/state-facilities/${code}?year=${year}`,
      signal,
    );
    return payload?.data ?? [];
  } catch (error) {
    if (error.status !== 404) throw error;
  }

  const legacy = await requestJson(
    `${apiBaseUrl}/facilities?state=${code}&year=${year}&take=1500`,
    signal,
  );
  return (legacy?.data ?? []).map(normalizeLegacyStateFacility);
}
