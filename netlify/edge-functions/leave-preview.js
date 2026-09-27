const PREVIEW = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Leave a testimonial | Emmanuel (Daniel) Okpiaifo</title>
    <meta name="description" content="Share what you worked on with Emmanuel (Daniel) Okpiaifo and what made a difference. Notes are reviewed before they appear on the site." />
    <link rel="canonical" href="https://emmanuel-okpiaifo.netlify.app/leave-a-testimonial" />
    <meta property="og:title" content="Leave a testimonial | Emmanuel (Daniel) Okpiaifo" />
    <meta property="og:description" content="Share what you worked on with Emmanuel (Daniel) Okpiaifo and what made a difference. Notes are reviewed before they appear on the site." />
    <meta property="og:url" content="https://emmanuel-okpiaifo.netlify.app/leave-a-testimonial" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://emmanuel-okpiaifo.netlify.app/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="https://emmanuel-okpiaifo.netlify.app/og-image.png" />
  </head>
  <body>
    <p>Share what you worked on with Emmanuel (Daniel) Okpiaifo and what made a difference.</p>
  </body>
</html>`;

export default async (request, context) => {
  const ua = request.headers.get("user-agent") || "";
  const isPreviewBot = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Discordbot|Pinterest|embedly/i.test(ua);
  if (!isPreviewBot) return context.next();
  return new Response(PREVIEW, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};

export const config = { path: "/leave-a-testimonial" };
