/**
 * HTTP configuration for making requests to sakuranovel.id
 * These headers and cookies help prevent WAF (Web Application Firewall) blocking
 */

export const httpConfig = {
  /**
   * Default headers for all requests to sakuranovel.id
   */
  headers: {
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'cache-control': 'no-cache',
    cookie:
      '_ga=GA1.1.597627041.1751655293; cookieyes-consent=consentid:U0tjQjVHTnBOVTJmeTQwSmR2bHFsWVM2Vzdma2NrUFY,consent:yes,action:yes,necessary:yes,functional:yes,analytics:yes,performance:yes,advertisement:yes; cf_clearance=ZhN_RSWAzve0BcZzCKh__UtSQV3CXYrtgsntMD4i0Hc-1753483698-1.2.1.1-S9zdxm8WyW6sdncb9LGf1SJeYRzefjtaqfjuEHlueN0uQLPY86K5Vq_AC1lqpruydOovGw81pNIce6M6hBtw1jjRcQRPaMTQsWJBrA3F8_8G4.97B6eYqRB60rXOl5enwl4YxI.Q9PFU8zGnfdOExsMCoL3c61dCd_Jwxkt1DghqE43TnH2QMvblkRjKVqfa96aSFA5BDcQotV5PoXsvATU4yitEmKeHBIBrYlr2_czt9VjLk0RQf4mi6UhCOmQE; _ga_MJZ5N74FMV=GS2.1.s1753482353$o4$g1$t1753484150$j22$l0$h0',
    dnt: '1',
    pragma: 'no-cache',
    priority: 'u=0, i',
    referer: 'https://sakuranovel.id/',
    'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
    'sec-ch-ua-arch': '"x86"',
    'sec-ch-ua-bitness': '"64"',
    'sec-ch-ua-full-version': '"134.0.6998.88"',
    'sec-ch-ua-full-version-list':
      '"Chromium";v="134.0.6998.88", "Not:A-Brand";v="24.0.0.0", "Google Chrome";v="134.0.6998.88"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-model': '""',
    'sec-ch-ua-platform': '"Linux"',
    'sec-ch-ua-platform-version': '"6.5.0"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent':
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  },

  /**
   * Headers specific for AJAX requests
   */
  ajaxHeaders: {
    accept: '*/*',
    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'cache-control': 'no-cache',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    cookie:
      '_ga=GA1.1.597627041.1751655293; cookieyes-consent=consentid:U0tjQjVHTnBOVTJmeTQwSmR2bHFsWVM2Vzdma2NrUFY,consent:yes,action:yes,necessary:yes,functional:yes,analytics:yes,performance:yes,advertisement:yes; cf_clearance=ZhN_RSWAzve0BcZzCKh__UtSQV3CXYrtgsntMD4i0Hc-1753483698-1.2.1.1-S9zdxm8WyW6sdncb9LGf1SJeYRzefjtaqfjuEHlueN0uQLPY86K5Vq_AC1lqpruydOovGw81pNIce6M6hBtw1jjRcQRPaMTQsWJBrA3F8_8G4.97B6eYqRB60rXOl5enwl4YxI.Q9PFU8zGnfdOExsMCoL3c61dCd_Jwxkt1DghqE43TnH2QMvblkRjKVqfa96aSFA5BDcQotV5PoXsvATU4yitEmKeHBIBrYlr2_czt9VjLk0RQf4mi6UhCOmQE; _ga_MJZ5N74FMV=GS2.1.s1753482353$o4$g1$t1753484150$j22$l0$h0',
    dnt: '1',
    origin: 'https://sakuranovel.id',
    pragma: 'no-cache',
    priority: 'u=1, i',
    referer: 'https://sakuranovel.id/daftar-novel/',
    'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
    'sec-ch-ua-arch': '"x86"',
    'sec-ch-ua-bitness': '"64"',
    'sec-ch-ua-full-version': '"134.0.6998.88"',
    'sec-ch-ua-full-version-list':
      '"Chromium";v="134.0.6998.88", "Not:A-Brand";v="24.0.0.0", "Google Chrome";v="134.0.6998.88"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-model': '""',
    'sec-ch-ua-platform': '"Linux"',
    'sec-ch-ua-platform-version': '"6.5.0"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent':
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest',
  },

  /**
   * Get headers with custom referer
   */
  getHeaders(referer?: string): Record<string, string> {
    return {
      ...this.headers,
      ...(referer ? { referer } : {}),
    };
  },

  /**
   * Get AJAX headers with custom referer
   */
  getAjaxHeaders(referer?: string): Record<string, string> {
    return {
      ...this.ajaxHeaders,
      ...(referer ? { referer } : {}),
    };
  },
};
