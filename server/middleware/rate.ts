import { RateLimiter } from "limiter";

const commTokensForInterval = 3;
const commInterval = 30 * 24 * 60 * 60 * 1000;
const commLimiter = new RateLimiter({
  tokensPerInterval: commTokensForInterval,
  interval: commInterval,
  fireImmediately: true,
});

export default fromNodeMiddleware(async (req, res, next) => {
  if (
    req.url &&
    req.method === "POST" &&
    req.url.includes("/api/commissions")
  ) {
    const remainingRequest = await commLimiter.removeTokens(1);
    res.setHeader("X-RateLimit-Limit", commTokensForInterval);
    res.setHeader("X-RateLimit-Remaining", remainingRequest);
    res.setHeader("X-RateLimit-Reset", commInterval);
    if (remainingRequest < 0) {
      res.writeHead(429, { "Content-Type": "text/plain;charset=UTF-8" });
      res.end("429 Too Many Requests - your IP is being rate limited");
    }
  }
  next();
});
