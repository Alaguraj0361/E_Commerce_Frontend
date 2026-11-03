import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface InstagramPostItem {
  id: string;
  title: string;
  subtitle: string;
  caption: string;
  image: string;
  permalink: string;
  shopLink: string;
  likes: string;
  isReel?: boolean;
  postedAgo: string;
}

const FALLBACK_NALMARA_POSTS: InstagramPostItem[] = [
  {
    id: 'ig-post-1',
    title: 'Royal Kanchivaram Silk',
    subtitle: 'Grace in Every Drape',
    caption:
      'Handpicked bridal magenta & gold zari Kanchivaram silk drape for timeless celebrations ✨ #nalmarafashion #kanchipuramsilk',
    image: '/images/nalmara/card_kanchivaram.jpg',
    permalink: 'https://www.instagram.com/nalmarafashion',
    shopLink: '/shop?category=sarees',
    likes: '1.4k',
    isReel: true,
    postedAgo: 'Recent Reel',
  },
  {
    id: 'ig-post-2',
    title: 'Traditional Heritage Wear',
    subtitle: 'Timeless Zari Weaves',
    caption:
      'Rich maroon heirloom silk saree woven with intricate temple borders & pure zari work 👑 #nalmarafashion #silksarees',
    image: '/images/nalmara/hero_maroon_saree.jpg',
    permalink: 'https://www.instagram.com/nalmarafashion',
    shopLink: '/shop?category=semi-kanchivaram',
    likes: '982',
    isReel: false,
    postedAgo: 'Recent Post',
  },
  {
    id: 'ig-post-3',
    title: 'Kids Festive Couture',
    subtitle: 'Little Smiles, Big Joy',
    caption:
      'Playful sunshine yellow butterfly gown & festive pattu wear crafted with feather-soft comfort 💛 #nalmarafashion #kidswear',
    image: '/images/nalmara/kidswear_butterfly_gown.jpg',
    permalink: 'https://www.instagram.com/nalmarafashion',
    shopLink: '/shop?category=kids-wear',
    likes: '1.8k',
    isReel: true,
    postedAgo: 'Recent Reel',
  },
  {
    id: 'ig-post-4',
    title: 'Signature Royal Unboxing',
    subtitle: 'Luxury in Every Thread',
    caption:
      'Every NALMARA saree arrives in our signature royal gift box — wrapped with love & devotion 🎁 #nalmarafashion #unboxing',
    image: '/images/nalmara/brand_story_box.jpg',
    permalink: 'https://www.instagram.com/nalmarafashion',
    shopLink: '/shop',
    likes: '2.1k',
    isReel: true,
    postedAgo: 'Pinned Reel',
  },
  {
    id: 'ig-post-5',
    title: 'Pastel Shimmer Party Wear',
    subtitle: 'Real Moments, Real Us',
    caption:
      'Effortless lilac organza & shimmer tissue drapes designed for evening receptions & cocktail soirées ✨ #nalmarafashion',
    image: '/images/nalmara/category_party_wear.jpg',
    permalink: 'https://www.instagram.com/nalmarafashion',
    shopLink: '/shop?category=party-wear',
    likes: '1.2k',
    isReel: true,
    postedAgo: 'Recent Reel',
  },
  {
    id: 'ig-post-6',
    title: 'Pure Handloom Cotton',
    subtitle: 'Celebrate in Style',
    caption:
      'Vibrant stack of breathable Chettinad & handloom cotton sarees for everyday royal elegance 🌸 #nalmarafashion #cottonsarees',
    image: '/images/nalmara/cotton_saree_stack.jpg',
    permalink: 'https://www.instagram.com/nalmarafashion',
    shopLink: '/shop?category=cotton-sarees',
    likes: '1.5k',
    isReel: false,
    postedAgo: 'Recent Post',
  },
];

function proxyIgImage(url?: string, fallbackIdx = 0): string {
  if (!url) return FALLBACK_NALMARA_POSTS[fallbackIdx % 6].image;
  if (url.startsWith('/')) return url;
  const decoded = url.replace(/&amp;/g, '&').replace(/\\u0026/g, '&').replace(/\\\//g, '/');
  return `/api/instagram/image?url=${encodeURIComponent(decoded)}`;
}

function formatLikes(count?: number): string {
  if (!count || count <= 0) return '1.1k';
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

/**
 * Parse Instagram's public profile embed HTML (https://www.instagram.com/nalmarafashion/embed/)
 * which embeds the latest 6 posts without requiring login or API tokens.
 */
function parseInstagramEmbedHtml(html: string): InstagramPostItem[] {
  const posts: InstagramPostItem[] = [];

  // 1. Extract escaped JSON string literal from "contextJSON":"..."
  const contextMatch = html.match(/"contextJSON"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (contextMatch && contextMatch[1]) {
    try {
      const unescapedJsonStr = JSON.parse(`"${contextMatch[1]}"`);
      const parsedContext = JSON.parse(unescapedJsonStr);
      const edges =
        parsedContext?.context?.graphql_media ||
        parsedContext?.graphql_media ||
        parsedContext?.context?.user?.edge_owner_to_timeline_media?.edges ||
        parsedContext?.graphql?.user?.edge_owner_to_timeline_media?.edges ||
        parsedContext?.user?.edge_owner_to_timeline_media?.edges;

      if (Array.isArray(edges) && edges.length > 0) {
        edges.slice(0, 6).forEach((item: any, idx: number) => {
          const node = item?.shortcode_media || item?.node || item;
          const shortcode = node?.shortcode;
          const rawImg =
            node?.display_url ||
            node?.thumbnail_src ||
            node?.display_resources?.[node.display_resources.length - 1]?.src ||
            node?.thumbnail_resources?.[node.thumbnail_resources.length - 1]?.src;
          const captionText =
            node?.edge_media_to_caption?.edges?.[0]?.node?.text ||
            node?.caption ||
            FALLBACK_NALMARA_POSTS[idx]?.caption ||
            '';
          const firstLine = captionText.split('\n')[0]?.replace(/#\S+/g, '').trim();
          const likesCount =
            node?.edge_liked_by?.count ||
            node?.edge_media_preview_like?.count ||
            node?.likes?.count;
          const isVideo = Boolean(node?.is_video || node?.__typename === 'GraphVideo');

          if (rawImg) {
            posts.push({
              id: node?.id || shortcode || `ig-embed-json-${idx}`,
              title: firstLine ? firstLine.slice(0, 28) : `@nalmarafashion #${idx + 1}`,
              subtitle: '@nalmarafashion',
              caption: captionText,
              image: proxyIgImage(rawImg, idx),
              permalink: shortcode
                ? `https://www.instagram.com/${isVideo ? 'reel' : 'p'}/${shortcode}/`
                : 'https://www.instagram.com/nalmarafashion',
              shopLink: FALLBACK_NALMARA_POSTS[idx]?.shopLink || '/shop',
              likes: formatLikes(likesCount),
              isReel: isVideo,
              postedAgo: isVideo ? 'Instagram Reel' : 'Instagram Post',
            });
          }
        });
        if (posts.length > 0) return posts;
      }
    } catch {
      // Continue to regex DOM extraction below
    }
  }

  // 2. Fallback: Extract post anchors and thumbnail images directly from Embed HTML DOM
  const linkImgRegex =
    /<a[^>]+href="https:\/\/www\.instagram\.com\/(?:[^/"']+\/)?(?:p|reel)\/([A-Za-z0-9_-]+)\/?[^"]*"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"[^>]*>/gi;
  let match: RegExpExecArray | null;
  let idx = 0;
  const seenShortcodes = new Set<string>();

  while ((match = linkImgRegex.exec(html)) !== null && posts.length < 6) {
    const shortcode = match[1];
    const imgSrc = match[2];
    if (shortcode && imgSrc && !seenShortcodes.has(shortcode)) {
      seenShortcodes.add(shortcode);
      const fallback = FALLBACK_NALMARA_POSTS[idx % 6];
      posts.push({
        id: `ig-dom-${shortcode}`,
        title: `@nalmarafashion Post #${idx + 1}`,
        subtitle: '@nalmarafashion',
        caption: fallback.caption,
        image: proxyIgImage(imgSrc, idx),
        permalink: `https://www.instagram.com/p/${shortcode}/`,
        shopLink: fallback.shopLink,
        likes: fallback.likes,
        isReel: true,
        postedAgo: 'Instagram Post',
      });
      idx++;
    }
  }

  return posts;
}

export async function GET() {
  try {
    // 1. Official Instagram Graph API (if INSTAGRAM_ACCESS_TOKEN is configured)
    const igToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (igToken) {
      const graphRes = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=6&access_token=${igToken}`,
        { cache: 'no-store' }
      ).catch(() => null);

      if (graphRes && graphRes.ok) {
        const graphData = await graphRes.json().catch(() => null);
        if (Array.isArray(graphData?.data) && graphData.data.length > 0) {
          const livePosts: InstagramPostItem[] = graphData.data.slice(0, 6).map((post: any, idx: number) => {
            const firstLine = (post.caption || '').split('\n')[0]?.replace(/#\S+/g, '').trim();
            const rawImg =
              post.media_type === 'VIDEO'
                ? post.thumbnail_url || post.media_url
                : post.media_url;
            return {
              id: post.id || `ig-live-${idx}`,
              title: firstLine ? firstLine.slice(0, 28) : FALLBACK_NALMARA_POSTS[idx]?.title || 'Nalmara Edit',
              subtitle: '@nalmarafashion',
              caption: post.caption || FALLBACK_NALMARA_POSTS[idx]?.caption || '',
              image: proxyIgImage(rawImg, idx),
              permalink: post.permalink || 'https://www.instagram.com/nalmarafashion',
              shopLink: FALLBACK_NALMARA_POSTS[idx]?.shopLink || '/shop',
              likes: FALLBACK_NALMARA_POSTS[idx]?.likes || '1.2k',
              isReel: post.media_type === 'VIDEO',
              postedAgo: post.media_type === 'VIDEO' ? 'Instagram Reel' : 'Instagram Post',
            };
          });
          return NextResponse.json({
            success: true,
            source: 'instagram_graph_api',
            profileUrl: 'https://www.instagram.com/nalmarafashion',
            handle: '@nalmarafashion',
            posts: livePosts,
          });
        }
      }
    }

    // 2. Public Instagram Profile Embed Endpoint (https://www.instagram.com/nalmarafashion/embed/)
    const embedRes = await fetch('https://www.instagram.com/nalmarafashion/embed/', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: 'https://www.instagram.com/',
      },
      cache: 'no-store',
    }).catch(() => null);

    if (embedRes && embedRes.ok) {
      const embedHtml = await embedRes.text().catch(() => '');
      if (embedHtml) {
        const embedPosts = parseInstagramEmbedHtml(embedHtml);
        if (embedPosts.length > 0) {
          return NextResponse.json({
            success: true,
            source: 'instagram_public_embed',
            profileUrl: 'https://www.instagram.com/nalmarafashion',
            handle: '@nalmarafashion',
            posts: embedPosts,
          });
        }
      }
    }

    // 3. Instagram Web/Mobile Profile Info JSON API
    for (const apiHost of ['https://i.instagram.com', 'https://www.instagram.com']) {
      const publicRes = await fetch(
        `${apiHost}/api/v1/users/web_profile_info/?username=nalmarafashion`,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            'X-IG-App-ID': '936619743392459',
            'X-ASBD-ID': '129477',
            'X-IG-WWW-Claim': '0',
            Referer: 'https://www.instagram.com/nalmarafashion/',
            Accept: 'application/json',
          },
          cache: 'no-store',
        }
      ).catch(() => null);

      if (publicRes && publicRes.ok) {
        const json = await publicRes.json().catch(() => null);
        const edges = json?.data?.user?.edge_owner_to_timeline_media?.edges;
        if (Array.isArray(edges) && edges.length > 0) {
          const scrapedPosts: InstagramPostItem[] = edges.slice(0, 6).map((edge: any, idx: number) => {
            const node = edge.node;
            const captionText = node?.edge_media_to_caption?.edges?.[0]?.node?.text || '';
            const cleanTitle = captionText.split('\n')[0]?.replace(/#\S+/g, '').trim();
            const likesCount = node?.edge_liked_by?.count || node?.edge_media_preview_like?.count;
            const rawImg = node.display_url || node.thumbnail_src;
            return {
              id: node.id || `ig-web-${idx}`,
              title: cleanTitle
                ? cleanTitle.slice(0, 26)
                : FALLBACK_NALMARA_POSTS[idx]?.title || 'Nalmara Couture',
              subtitle: '@nalmarafashion',
              caption: captionText || FALLBACK_NALMARA_POSTS[idx]?.caption || '',
              image: proxyIgImage(rawImg, idx),
              permalink: node.shortcode
                ? `https://www.instagram.com/p/${node.shortcode}/`
                : 'https://www.instagram.com/nalmarafashion',
              shopLink: FALLBACK_NALMARA_POSTS[idx]?.shopLink || '/shop',
              likes: formatLikes(likesCount),
              isReel: Boolean(node.is_video),
              postedAgo: node.is_video ? 'Instagram Reel' : 'Instagram Post',
            };
          });

          return NextResponse.json({
            success: true,
            source: 'instagram_public_feed',
            profileUrl: 'https://www.instagram.com/nalmarafashion',
            handle: '@nalmarafashion',
            posts: scrapedPosts,
          });
        }
      }
    }
  } catch {
    // Graceful fallback below
  }

  return NextResponse.json({
    success: true,
    source: 'curated_nalmarafashion_feed',
    profileUrl: 'https://www.instagram.com/nalmarafashion',
    handle: '@nalmarafashion',
    posts: FALLBACK_NALMARA_POSTS,
  });
}
