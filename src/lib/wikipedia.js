
export const getWikipediaImage = async (wikiTitle, fallbackTerms = []) => {
  const queries = [wikiTitle, ...fallbackTerms].filter(Boolean);

  for (const query of queries) {
    try {

      const searchRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=3`
      );
      const searchData = await searchRes.json();

      if (searchData.query?.search?.length > 0) {

        const candidates = searchData.query.search.filter((s) => {
          const snippet = String(s.snippet || '')
            .replace(/<[^>]+>/g, ' ')
            .toLowerCase();
          return !snippet.includes('may refer to');
        });
        const bestMatch =
          (candidates.length > 0 ? candidates[0] : searchData.query.search[0]) || null;

        if (!bestMatch) continue;

        const pageId = bestMatch.pageid;
        const imgRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=thumbnail|original&pithumbsize=1000&format=json&origin=*&pageids=${encodeURIComponent(
            String(pageId)
          )}`
        );
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          const page = imgData?.query?.pages?.[pageId];
          const thumb = page?.thumbnail?.source;
          const original = page?.original?.source;
          if (thumb) return thumb;
          if (original) return original;
        }

       
        const summaryRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            bestMatch.title
          )}`
        );
        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          if (summaryData.thumbnail?.source) return summaryData.thumbnail.source;
          if (summaryData.originalimage?.source) return summaryData.originalimage.source;
        }
      }
    } catch (e) {
      console.warn('Wikipedia image search failed for:', query, e);
    }
  }

  return null; 
};
