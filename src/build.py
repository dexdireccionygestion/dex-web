"""Genera la web publicable (carpeta public/) a partir de src/dex.html.

src/dex.html es el archivo maestro: una sola página con anclas (#metodo, #blog…), que también sirve de vista previa.
La web publicada tiene una página real por sección, cada una solo con su contenido:

- public/index.html                 portada
- public/<pagina>/index.html        método, blog, artículos, legales, landing…
- public/assets/dex.<hash>.css/.js  estilos y código compartidos (se guardan en caché un año)
- public/sitemap.xml, robots.txt, 404.html

Uso:  python3 src/build.py
"""
import datetime, hashlib, html, json, pathlib, re, shutil

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'src' / 'dex.html'
SRC_ASSETS = ROOT / 'src' / 'assets'
OUT = ROOT / 'public'
BASE = 'https://dexdireccionygestion.com'
TODAY = datetime.date.today().isoformat()
OG_IMAGE = BASE + '/assets/dex-og.jpg'
AUTOR = {"@type": "Person", "name": "Jose Rodríguez Horrillo", "jobTitle": "Fundador y CEO de DEX Dirección y Gestión",
         "url": BASE + '/', "image": BASE + '/assets/jose-rodriguez-horrillo.jpg'}
ORG = {"@type": "Organization", "name": "DEX Dirección y Gestión", "url": BASE + '/',
       "logo": {"@type": "ImageObject", "url": BASE + '/assets/dex-icono-512.png'}}
PUBLICADO = {  # fecha en que cada artículo se publicó con su propia dirección
    'blog-presupuestos': '2026-10-29', 'blog-indicadores': '2026-10-29', 'blog-agenda': '2026-10-29',
    'blog-protocolos': '2026-10-29', 'blog-gerente': '2026-10-29', 'blog-facturacion': '2026-11-18', 'blog-gabinete': '2026-11-18',
    'blog-cierre-mes': '2026-11-18', 'blog-equipo': '2026-11-18', 'blog-captacion': '2026-11-18',
    'blog-plan-anual': '2026-11-20', 'blog-recepcion': '2026-11-20',
}

HOME = ('Gestión y dirección externa de clínicas dentales · DEX', None)
# título, descripción, prioridad en el sitemap, tipo, migas (sección intermedia)
PAGES = {
    'consultoria-clinicas-dentales': ('Consultoría y gestión de clínicas dentales · DEX',
        'Consultoría y gestión de clínicas dentales que se queda a implantar: diagnóstico, objetivos, protocolos y seguimiento semanal durante 12 meses.', '0.9', 'page', None),
    'metodo': ('Método DEX: 12 meses de dirección para tu clínica dental',
        'Así son los 12 meses de dirección externa con DEX: diagnóstico 360º, objetivos, protocolos, seguimiento mensual y acciones de temporada, mes a mes.', '0.9', 'page', None),
    'inversion-detalle': ('Gerente en plantilla o dirección externa: calcula el coste · DEX',
        'Compara el coste del primer año de un director en plantilla con la dirección externa de DEX y ajusta salario y supuestos a tu clínica dental.', '0.8', 'page', None),
    'autodiagnostico': ('Autodiagnóstico gratuito de la gestión de tu clínica dental · DEX',
        'Responde 8 preguntas en 2 minutos y descubre qué áreas de la dirección de tu clínica dental son prioritarias. Gratis y con resultado al momento.', '0.8', 'page', None),
    'preguntas': ('Preguntas frecuentes sobre la gestión externa de clínicas · DEX',
        'Respuestas a las dudas habituales de los propietarios de clínicas dentales sobre la dirección y gestión externa de DEX: plazos, equipo, datos y cuota.', '0.7', 'page', None),
    'blog': ('Blog DEX · Gestión y dirección de clínicas dentales',
        'Guías prácticas sobre agenda, presupuestos, equipo, protocolos e indicadores para dirigir una clínica dental. Para leer entre paciente y paciente.', '0.8', 'page', None),
    'blog-facturacion': (None, None, '0.7', 'post', 'blog'),
    'blog-gabinete': (None, None, '0.7', 'post', 'blog'),
    'blog-presupuestos': (None, None, '0.7', 'post', 'blog'),
    'blog-indicadores': (None, None, '0.7', 'post', 'blog'),
    'blog-agenda': (None, None, '0.7', 'post', 'blog'),
    'blog-protocolos': (None, None, '0.7', 'post', 'blog'),
    'blog-gerente': (None, None, '0.7', 'post', 'blog'),
    'blog-cierre-mes': (None, None, '0.7', 'post', 'blog'),
    'blog-equipo': (None, None, '0.7', 'post', 'blog'),
    'blog-captacion': (None, None, '0.7', 'post', 'blog'),
    'blog-plan-anual': (None, None, '0.7', 'post', 'blog'),
    'blog-recepcion': (None, None, '0.7', 'post', 'blog'),
    'aviso-legal': ('Aviso legal · DEX Dirección y Gestión', 'Aviso legal de la web de DEX Dirección y Gestión: titular, condiciones de uso y propiedad intelectual.', '0.2', 'page', None),
    'privacidad': ('Política de privacidad · DEX Dirección y Gestión', 'Cómo trata DEX Dirección y Gestión los datos personales de quienes usan su web, reservan un café o hacen el autodiagnóstico.', '0.2', 'page', None),
    'cookies': ('Política de cookies · DEX Dirección y Gestión', 'Qué cookies y almacenamiento local usa la web de DEX Dirección y Gestión y cómo gestionarlos.', '0.2', 'page', None),
}
BREAD_NAMES = {'blog': 'Blog'}


def text(x):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', x))).strip()


def clip(t, n=158):
    if len(t) <= n:
        return t
    return t[:n].rsplit(' ', 1)[0].rstrip(',;:.') + '…'


def h(s):
    return html.escape(s, quote=True)


def split_blocks(body):
    """Devuelve (antes_de_main, home, {pagina: bloque}, después_de_main)."""
    a = body.index('<main id="main">') + len('<main id="main">')
    z = body.index('</main>')
    pre, inner, post = body[:a], body[a:z], body[z:]
    starts = [(m.start(), m.group(1)) for m in re.finditer(r'<div class="page" data-page="([a-z0-9-]+)" hidden>', inner)]
    home = inner[:starts[0][0]]
    pages = {}
    for i, (st, key) in enumerate(starts):
        en = starts[i + 1][0] if i + 1 < len(starts) else len(inner)
        pages[key] = inner[st:en]
    return pre, home, pages, post


def rewrite_links(s, keys, local_ids):
    def rep(m):
        k = m.group(1)
        if k in local_ids:
            return m.group(0)
        if k in keys:
            return f'href="/{k}/"'
        if k == 'inicio':
            return 'href="/"'
        return f'href="/#{k}"'
    return re.sub(r'href="#([a-zA-Z0-9_-]+)"', rep, s)


def fingerprint(name, data, ext):
    d = hashlib.sha256(data.encode()).hexdigest()[:10]
    fn = f'{name}.{d}.{ext}'
    (OUT / 'assets' / fn).write_text(data)
    return '/assets/' + fn


def main():
    src = SRC.read_text()
    skip = '<a class="skip" href="#main">'
    head, body = src.split(skip, 1)
    body = skip + body

    # 1) separar el CSS y el JS grandes en archivos compartidos
    styles = list(re.finditer(r'<style>\n(.*?)</style>\n', head, re.S))
    big_css = max(styles, key=lambda m: len(m.group(1)))
    scripts = list(re.finditer(r'<script>\n(.*?)</script>', body, re.S))
    big_js = max(scripts, key=lambda m: len(m.group(1)))
    css, js = big_css.group(1), big_js.group(1)
    head = head.replace(big_css.group(0), '@@CSS@@\n', 1)
    body = body.replace(big_js.group(0), '@@JS@@', 1)

    # 2) datos estructurados: la FAQ va solo en /preguntas/
    ld_m = re.search(r'<script type="application/ld\+json">\s*(.*?)\s*</script>\n', head, re.S)
    graph = json.loads(ld_m.group(1))
    faq = [n for n in graph['@graph'] if n['@type'] == 'FAQPage']
    org_nodes = [n for n in graph['@graph'] if n['@type'] != 'FAQPage']
    head = head.replace(ld_m.group(0), '@@LD@@\n', 1)

    # 3) rutas: assets absolutos, título fuera (se pone por página)
    head = re.sub(r'<title>[^<]*</title>\n', '', head, count=1)
    head = re.sub(r'(src|href)="assets/', r'\1="/assets/', head).replace('url("assets/', 'url("/assets/')
    body = re.sub(r'(src|href)="assets/', r'\1="/assets/', body).replace('"assets/', '"/assets/')
    css = css.replace('url("assets/', 'url("/assets/').replace("url('assets/", "url('/assets/")
    js = js.replace('"assets/', '"/assets/')

    pre, home, pages, post = split_blocks(body)
    keys = set(pages)
    missing = keys - set(PAGES)
    assert not missing, f'páginas sin metadatos en build.py: {missing}'

    # 4) carpeta de salida limpia y recursos
    if OUT.exists():
        shutil.rmtree(OUT)
    shutil.copytree(SRC_ASSETS, OUT / 'assets')
    js_links = re.sub(r'href="#([a-z0-9-]+)"', lambda m: f'href="/{m.group(1)}/"' if m.group(1) in keys else f'href="/#{m.group(1)}"', js)
    js_links = 'window.DEX_PAGES = ' + json.dumps(sorted(keys)) + ';\n' + js_links
    css_url = fingerprint('dex', css, 'css')
    js_url = fingerprint('dex', js_links, 'js')

    def doc(title, desc, url, main_html, lds, robots=None):
        ids = set(re.findall(r'id="([^"]+)"', main_html))
        b = pre + main_html + post
        b = rewrite_links(b, keys, ids)
        b = b.replace('@@JS@@', f'<script src="{js_url}"></script>')
        hd = head
        hd = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{h(desc)}">', hd, count=1)
        hd = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{h(title)}">', hd, count=1)
        hd = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{h(desc)}">', hd, count=1)
        hd = re.sub(r'<!-- \[PENDIENTE\] og:image[^>]*-->\n', '', hd)
        hd = hd.replace('@@CSS@@', f'<link rel="stylesheet" href="{css_url}">')
        hd = hd.replace('@@LD@@', ''.join('<script type="application/ld+json">' + json.dumps(x, ensure_ascii=False) + '</script>\n' for x in lds))
        top = ('<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
               f'<title>{h(title)}</title>\n<link rel="canonical" href="{url}">\n<meta property="og:url" content="{url}">\n'
               f'<meta property="og:image" content="{OG_IMAGE}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n'
               f'<meta property="og:image:alt" content="DEX · Gestión y dirección externa de clínicas dentales">\n<meta name="twitter:image" content="{OG_IMAGE}">\n'
               + (f'<meta name="robots" content="{robots}">\n' if robots else '') +
               '<meta name="theme-color" content="#F4F1EA">\n')
        assert hd.startswith('<meta charset="utf-8">\n')
        hd = top + hd[len('<meta charset="utf-8">\n'):]
        return '<!doctype html>\n<html lang="es">\n<head>\n' + hd + '</head>\n<body>\n' + b + '\n</body>\n</html>\n'

    # portada
    home_desc = html.unescape(re.search(r'<meta name="description" content="([^"]*)">', head).group(1))
    home_ld = [{"@context": "https://schema.org", "@graph": org_nodes + [
        {"@type": "WebSite", "name": "DEX Dirección y Gestión", "url": BASE + '/', "inLanguage": "es-ES"}]}]
    (OUT / 'index.html').write_text(doc(HOME[0], home_desc, BASE + '/', home, home_ld))
    urls = [(BASE + '/', '1.0', TODAY)]

    for key, (title, desc, prio, kind, parent) in PAGES.items():
        blk = pages[key]
        h2 = re.search(r'<h2([^>]*)>(.*?)</h2>', blk, re.S)
        heading = text(h2.group(2))
        if kind == 'post':
            title = f'{heading} · DEX'
            paras = [text(p) for p in re.findall(r'<p[^>]*>(.*?)</p>', blk, re.S)]
            desc = clip(next(p for p in paras if len(p) > 90))
        attrs = h2.group(1)
        if 'ph-title' not in attrs:
            attrs += ' class="as-h2"'
        blk = blk[:h2.start()] + f'<h1{attrs}>{h2.group(2)}</h1>' + blk[h2.end():]
        blk = blk.replace(f'<div class="page" data-page="{key}" hidden>', f'<div class="page" data-page="{key}">', 1)
        main_html = '\n<div id="home" hidden></div>\n' + blk
        url = f'{BASE}/{key}/'
        crumbs = [{"@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE + '/'}]
        if parent:
            crumbs.append({"@type": "ListItem", "position": 2, "name": BREAD_NAMES[parent], "item": f'{BASE}/{parent}/'})
        crumbs.append({"@type": "ListItem", "position": len(crumbs) + 1, "name": heading if kind == 'post' else title.split(' · ')[0].split(':')[0], "item": url})
        lds = [{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": crumbs}]
        if kind == 'post':
            fecha = PUBLICADO.get(key)
            post_ld = {"@context": "https://schema.org", "@type": "BlogPosting", "headline": heading, "description": desc,
                       "url": url, "mainEntityOfPage": url, "inLanguage": "es-ES", "image": OG_IMAGE,
                       "author": AUTOR, "publisher": ORG}
            if fecha:
                post_ld["datePublished"] = fecha
            lds.append(post_ld)
        if key == 'preguntas' and faq:
            lds.append({"@context": "https://schema.org", **faq[0]})
        if key == 'consultoria-clinicas-dentales':
            lds.append({"@context": "https://schema.org", "@type": "Service", "name": "Consultoría y gestión de clínicas dentales",
                        "serviceType": "Dirección y gestión externa de clínicas dentales", "provider": ORG, "areaServed": {"@type": "Country", "name": "España"},
                        "url": url, "description": desc})
        d = OUT / key
        d.mkdir(exist_ok=True)
        (d / 'index.html').write_text(doc(title, desc, url, main_html, lds))
        urls.append((url, prio, TODAY))
        print(f'{key:30} {len((d / "index.html").read_text()) // 1024:4} KB  {title}')

    print(f'{"(portada)":30} {len((OUT / "index.html").read_text()) // 1024:4} KB   css {len(css) // 1024} KB · js {len(js_links) // 1024} KB')

    # 404
    nf = doc('Página no encontrada · DEX', 'Esta página no existe.', BASE + '/404.html',
             '\n<div id="home" hidden></div>\n<section class="band page-head page-head-c"><div class="wrap"><p class="eyebrow">Error 404</p>'
             '<h1 class="ph-title">Esta página no existe.</h1><p class="lede">Puede que el enlace esté mal escrito o que la página se haya movido.</p>'
             '<div class="ctas" style="margin-top:22px"><a class="btn" href="#inicio">Ir al inicio <span class="arr" aria-hidden="true">→</span></a></div>'
             '<p style="margin-top:18px"><a class="link" href="#blog">Ver el blog →</a></p></div></section>\n',
             [], robots='noindex')
    nf = nf.replace('<link rel="canonical" href="https://dexdireccionygestion.com/404.html">\n', '')
    (OUT / '404.html').write_text(nf)

    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sm += ''.join(f'  <url><loc>{u}</loc><lastmod>{lm}</lastmod><priority>{p}</priority></url>\n' for u, p, lm in urls)
    sm += '</urlset>\n'
    (OUT / 'sitemap.xml').write_text(sm)
    (OUT / 'robots.txt').write_text(f'User-agent: *\nAllow: /\nSitemap: {BASE}/sitemap.xml\n')


if __name__ == '__main__':
    main()
