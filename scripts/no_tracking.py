"""検査で開くページから、計測（GA）へ通信させない。

2026-11-10: 公開前の検査（webkit_crash_check ほか）が手元でページを開くたびに
GA のタグを踏み、直近28日の Direct 11,385 セッションのうち約1万が検査だった。
ブラウザでページを開く検査は、new_page の直後に block(pg) を呼ぶ。

確かめ方: python scripts/no_tracking.py（計測への通信が止まり、ページは開けることを見る）
"""
import sys

HOSTS = ("googletagmanager.com", "google-analytics.com", "analytics.google.com", "doubleclick.net")


def is_tracking(url):
    return any(h in url for h in HOSTS)


def block(pg):
    pg.route(is_tracking, lambda route: route.abort())
    return pg


def unwired():
    """ブラウザでページを開くのに block を呼んでいない検査を返す。"""
    import glob
    import os
    here = os.path.dirname(os.path.abspath(__file__))
    bad = []
    for f in sorted(glob.glob(os.path.join(here, "*.py"))):
        if os.path.basename(f) == "no_tracking.py":
            continue
        src = open(f, encoding="utf-8", errors="replace").read()
        if "new_page(" in src and "no_tracking.block(" not in src:
            bad.append(os.path.basename(f))
    return bad


def selftest():
    import functools
    import http.server
    import os
    import threading
    bad = unwired()
    if bad:
        print("NG: ブラウザでページを開くのに no_tracking.block を呼んでいない（検査が GA に記録される）: " + ", ".join(bad))
        return 1
    from playwright.sync_api import sync_playwright

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass

    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=root))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    url = "http://127.0.0.1:%d/" % srv.server_address[1]
    res = {}
    with sync_playwright() as p:
        b = p.webkit.launch()
        for name, use in (("止めない", False), ("止める", True)):
            pg = b.new_page(viewport={"width": 390, "height": 900})
            sent, failed = [], []
            pg.on("request", lambda r, s=sent: is_tracking(r.url) and s.append(r.url))
            pg.on("requestfailed", lambda r, f=failed: is_tracking(r.url) and f.append(r.url))
            if use:
                block(pg)
            else:
                # 試験そのものが GA に記録を残さないよう、本物へは流さず空で返す
                pg.route(is_tracking, lambda route: route.fulfill(status=204, body=""))
            pg.goto(url, wait_until="load", timeout=40000)
            pg.wait_for_timeout(1500)
            res[name] = (len(sent), len(failed), pg.locator("h1").first.is_visible())
            pg.close()
        b.close()
    srv.shutdown()
    raw, blocked = res["止めない"], res["止める"]
    print("止めない: 計測への通信 %d 件・失敗 %d 件 ／ 止める: 通信 %d 件・失敗 %d 件・h1 表示 %s" % (raw[0], raw[1], blocked[0], blocked[1], blocked[2]))
    # 止めないときに通信が出ていなければ、この試験は何も確かめていない
    if raw[0] == 0 or raw[0] == raw[1]:
        print("NG: 止めないときに計測への通信が出ていない（試験が成り立っていない）")
        return 1
    if blocked[0] != blocked[1] or not blocked[2]:
        print("NG: 計測への通信が止まっていない、またはページが開けていない")
        return 1
    print("OK: 検査で開いたページは計測へ通信しない")
    return 0


if __name__ == "__main__":
    sys.exit(selftest())
