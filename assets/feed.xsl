<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="UTF-8"/>
<xsl:template match="/rss/channel">
<html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title><xsl:value-of select="title"/> — RSS</title>
<style>
body{margin:0;background:#0d0f12;color:#dfe3ea;font:16px/1.6 Inter,-apple-system,system-ui,sans-serif}
.w{max-width:720px;margin:0 auto;padding:40px 24px}
.k{font:12.5px 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.22em;text-transform:uppercase;color:#c8a96e}
h1{font-family:Georgia,serif;color:#f0f2f5;margin:10px 0}
.box{border:1px solid #1f2329;background:#13161b;padding:16px 18px;margin:20px 0 32px;color:#b8bec8;font-size:14.5px}
code{display:block;margin-top:8px;color:#f0f2f5;font:13px 'JetBrains Mono',ui-monospace,monospace;word-break:break-all}
a.i{display:block;border:1px solid #1f2329;padding:14px 16px;margin-bottom:8px;color:#f0f2f5;text-decoration:none}
a.i:hover{border-color:#c8a96e} a.i small{display:block;color:#b8bec8;margin-top:4px}
</style></head><body><div class="w">
<div class="k">// RSS</div>
<h1><xsl:value-of select="title"/></h1>
<p><xsl:value-of select="description"/></p>
<div class="box">Скопіюйте цю адресу в будь-яку RSS-читалку (Feedly, Inoreader, NetNewsWire) — нові статті з'являтимуться там автоматично. / Paste this address into any RSS reader to get new articles automatically.
<code><xsl:value-of select="*[local-name()='link' and @rel='self']/@href"/></code></div>
<xsl:for-each select="item">
<a class="i" href="{link}"><xsl:value-of select="title"/><small><xsl:value-of select="description"/></small></a>
</xsl:for-each>
<p><a href="{link}" style="color:#c8a96e">← CODE38</a></p>
</div></body></html>
</xsl:template>
</xsl:stylesheet>
