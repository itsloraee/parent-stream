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
 * Construit une URL d'embed YouTube avec les paramètres qui masquent au max
 * le branding YouTube — pour que la vidéo se sente intégrée à Parent Stream.
 *
 * - autoplay : démarre la lecture automatiquement
 * - controls : affiche/masque les contrôles natifs
 * - rel=0 : pas de vidéos suggérées d'autres chaînes à la fin
 * - modestbranding=1 : retire le gros logo YouTube de la barre de contrôles
 * - playsinline=1 : lecture inline sur mobile (pas plein écran forcé)
 * - iv_load_policy=3 : désactive les annotations
 * - disablekb=1 : désactive les raccourcis clavier YouTube
 * - fs=1 : autorise le plein écran (utile sur mobile)
 * - cc_load_policy=0 : désactive les sous-titres par défaut
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
    iv_load_policy: '3',
    disablekb: '1',
    fs: '1',
    cc_load_policy: '0',
    color: 'white',
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Renvoie l'URL de la miniature d'une vidéo YouTube.
 * On utilise hqdefault.jpg (480x360) qui est toujours générée par YouTube,
 * contrairement à maxresdefault.jpg qui n'existe pas pour toutes les vidéos.
 */
export function getYouTubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
