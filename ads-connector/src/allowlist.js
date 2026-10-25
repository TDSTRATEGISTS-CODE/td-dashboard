import { PROFILE_ALLOWLIST } from './config.js';

export function assertAllowedProfile(profileId) {
  const id = String(profileId ?? '').trim();
  if (!Object.hasOwn(PROFILE_ALLOWLIST, id)) {
    throw new Error(`Profile ${id || '(none)'} is not on the TDS allowlist; refused.`);
  }
  return id;
}

export function profileInfo(profileId) {
  return PROFILE_ALLOWLIST[assertAllowedProfile(profileId)];
}
