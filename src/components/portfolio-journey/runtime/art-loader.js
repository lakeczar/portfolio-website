// Approved portfolio renderer; lifecycle is owned by the React route.
export default function initialize(state, on) {
  /* Shared decoded-image cache. Failed requests may be retried. */
  state.portfolioArtLoader = (() => {
    const cache = new Map();
    function load(src, priority = 'auto') {
      if (cache.has(src)) return cache.get(src);
      const promise = new Promise((resolve, reject) => {
        const image = new Image();
        image.decoding = 'async';
        image.fetchPriority = priority;
        const timer = setTimeout(() => fail(Error('Artwork timed out')), 45000);
        function fail(error) {
          clearTimeout(timer);
          image.onload = image.onerror = null;
          reject(error);
        }
        image.onerror = () => fail(Error('Could not load artwork'));
        image.onload = async () => {
          try {
            await image.decode();
            clearTimeout(timer);
            resolve(image);
          } catch (error) {
            fail(error);
          }
        };
        image.src = src;
      }).catch((error) => {
        cache.delete(src);
        throw error;
      });
      cache.set(src, promise);
      return promise;
    }
    return { load };
  })();
}
