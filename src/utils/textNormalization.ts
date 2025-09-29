const TSU_M_VARIANT_REGEX = /ツ[мМ]/g

export function normalizeHashtagCharacters(text: string): string {
  if (!text) {
    return text
  }

  return text.replace(TSU_M_VARIANT_REGEX, 'ツム')
}
