/**
 * Helpers pour gérer les URLs YouTube.
 * Permet d'utiliser des vidéos YouTube comme source dans le lecteur.
 */

/**
 * Extrait l'ID d'une vidéo YouTube depuis une URL.
 * Supporte les formats :
 *   - https://www.youtube.com/watch?v=ID
 *   - https://youtu.be/ID
 *   - https://www.youtube.com/embed/ID
 *   - https://www.youtube.com/shorts/ID
 *
 * @returns L'ID de la vidéo, ou null si l'URL n'est pas une URL YouTube valide.
 */
export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');

    // youtu.be/ID
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1);
      return id || null;
    }

    // youtube.com/* (embed, shorts, watch)
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      // /embed/ID ou /shorts/ID
      const embedMatch = u.pathname.match(/^\/(embed|shorts)\/([^/?]+)/);
      if (embedMatch) return embedMatch[2];

      // /watch?v=ID
      if (u.pathname === '/watch') {
        return u.searchParams.get('v');
      }
    }

    return null;
  } catch {
    return null;
  }
}

/** Renvoie true si l'URL est une URL YouTube. */
export function isYouTubeUrl(url: string | null | undefined): boolean {
  return getYouTubeId(url) !== null;
}

/**
 * Construit une URL d'embed YouTube avec les bons paramètres pour notre player.
 * - autoplay : démarre la lecture automatiquement
 * - controls : affiche/masque les contrôles natifs (on les masque pour cohérence UI)
 * - rel=0 : limite les vidéos suggérées à la même chaîne
 * - modestbranding=1 : retire le gros logo YouTube
 * - playsinline=1 : lecture inline sur mobile (pas plein écran forcé)
 */
export function buildYouTubeEmbedUrl(
  videoId: string,
  options: { autoplay?: boolean; controls?: boolean; mute?: boolean } = {}
): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    controls: options.controls === false ? '0' : '1',
    autoplay: options.autoplay ? '1' : '0',
    mute: options.mute ? '1' : '0',
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Renvoie l'URL de la miniature d'une vidéo YouTube.
 * On utilise hqdefault.jpg (480x360) qui est toujours générée par YouTube,
 * contrairement à maxresdefault.jpg qui n'existe pas pour toutes les vidéos.
 */
export function getYouTubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
