import type { Lang } from "./i18n";

export type OfferCategory =
  | "food"
  | "groceries"
  | "shopping"
  | "travel"
  | "family";

export type OfferStatus = "ongoing" | "limited";

interface OfferCopy {
  title: string;
  summary: string;
  benefit: string;
  eligibility: string;
  whyItMatters: string;
  watchouts: string[];
}

interface OfferDefinition {
  id: string;
  rank: number;
  brand: string;
  category: OfferCategory;
  status: OfferStatus;
  officialUrl: string;
  verifiedAt: string;
  copy: Record<Lang, OfferCopy>;
}

export interface Offer extends OfferCopy {
  id: string;
  rank: number;
  brand: string;
  category: OfferCategory;
  status: OfferStatus;
  officialUrl: string;
  verifiedAt: string;
}

const VERIFIED_AT = "2026-06-06T12:00:00+02:00";

const offerDefinitions: OfferDefinition[] = [
  {
    id: "lieferando-prime",
    rank: 1,
    brand: "Lieferando x Amazon Prime",
    category: "food",
    status: "ongoing",
    officialUrl: "https://www.amazon.de/prime/offer/lieferando/prime-deal",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Free delivery on many Lieferando orders with Amazon Prime",
        summary:
          "Prime members can unlock free delivery on eligible Lieferando restaurants with a EUR 15 minimum order.",
        benefit: "Waived delivery fee on participating restaurants.",
        eligibility:
          "Amazon Prime membership, linked account, participating restaurants, and minimum order rules apply.",
        whyItMatters:
          "Food delivery is a repeat expense in Germany, so this can save money without changing habits.",
        watchouts: [
          "Only participating restaurants are included.",
          "Service fees and menu markups can still apply.",
        ],
      },
      de: {
        title: "Kostenlose Lieferung bei vielen Lieferando-Bestellungen mit Amazon Prime",
        summary:
          "Prime-Mitglieder können bei teilnehmenden Lieferando-Restaurants die Liefergebühr sparen, meist ab EUR 15 Mindestbestellwert.",
        benefit: "Keine Liefergebühr bei teilnehmenden Restaurants.",
        eligibility:
          "Amazon Prime, verknüpftes Konto, teilnehmende Restaurants und Mindestbestellwert sind nötig.",
        whyItMatters:
          "Lieferando ist für viele Haushalte in Deutschland ein häufiger Ausgabenpunkt und damit ein echter Alltagshebel.",
        watchouts: [
          "Gilt nicht bei allen Restaurants.",
          "Servicegebühren und höhere Menüpreise können trotzdem anfallen.",
        ],
      },
    },
  },
  {
    id: "rewe-bonus",
    rank: 2,
    brand: "REWE Bonus",
    category: "groceries",
    status: "ongoing",
    officialUrl: "https://www.rewe.de/bonus/",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Stack weekly coupons and bonus boosters in the REWE app",
        summary:
          "REWE Bonus combines app coupons, category boosters, and regular grocery promos in one account.",
        benefit: "Coupon savings and bonus actions on everyday grocery spend.",
        eligibility: "REWE account and app participation.",
        whyItMatters:
          "REWE is a mainstream supermarket chain, so the savings can repeat weekly instead of once.",
        watchouts: [
          "The strongest value usually comes from activating offers before checkout.",
          "Some rewards are category-specific rather than storewide.",
        ],
      },
      de: {
        title: "Wöchentliche Coupons und Bonus-Booster in der REWE App stapeln",
        summary:
          "REWE Bonus kombiniert App-Coupons, Kategorie-Booster und reguläre Aktionsvorteile in einem Konto.",
        benefit: "Coupon-Ersparnisse und Bonusaktionen auf den alltäglichen Lebensmitteleinkauf.",
        eligibility: "REWE Konto und aktive Nutzung der App.",
        whyItMatters:
          "REWE ist für viele Menschen in Deutschland ein Stamm-Supermarkt, daher ist der Nutzen regelmäßig statt einmalig.",
        watchouts: [
          "Der beste Effekt kommt meist nur mit aktivierten Angeboten vor dem Einkauf.",
          "Viele Vorteile gelten nur für einzelne Kategorien.",
        ],
      },
    },
  },
  {
    id: "payback-main",
    rank: 3,
    brand: "PAYBACK",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.payback.de/",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Use one points app across major German chains",
        summary:
          "PAYBACK remains one of Germany's widest loyalty systems, now especially relevant for EDEKA, Netto Marken-Discount, dm, MediaMarkt, Thalia, fuel, and online shopping.",
        benefit: "Points plus app coupons across many partner brands.",
        eligibility: "PAYBACK account or app.",
        whyItMatters:
          "EDEKA and Netto moved into the PAYBACK ecosystem, so this is now the cleaner default points app for many mainstream grocery users.",
        watchouts: [
          "Base points are usually small unless you activate extra coupons.",
          "The best use case is consistent scanning across partner shops.",
        ],
      },
      de: {
        title: "Ein Punkte-System für viele große Ketten in Deutschland nutzen",
        summary:
          "PAYBACK bleibt eines der am weitesten verbreiteten Bonusprogramme in Deutschland, besonders relevant für EDEKA, Netto Marken-Discount, dm, MediaMarkt, Thalia, Tanken und Online-Shopping.",
        benefit: "Punkte plus App-Coupons bei vielen Partnern.",
        eligibility: "PAYBACK Konto oder App.",
        whyItMatters:
          "Seit EDEKA und Netto in das PAYBACK Ökosystem gewechselt sind, ist PAYBACK für viele Supermarkt-Nutzer der sauberere Standard-Sparhebel.",
        watchouts: [
          "Die Basispunkte allein sind oft klein, wenn keine Extra-Coupons aktiviert werden.",
          "Richtig stark wird es erst bei konsequenter Nutzung über mehrere Partner hinweg.",
        ],
      },
    },
  },
  {
    id: "dm-payback",
    rank: 7,
    brand: "dm + PAYBACK",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.dm.de/services/payback",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Collect PAYBACK at dm on frequent household purchases",
        summary:
          "dm lets shoppers combine everyday drugstore spending with PAYBACK points and app-driven savings.",
        benefit: "Points and coupon stacking on repeat essentials.",
        eligibility: "dm checkout with PAYBACK card or app barcode.",
        whyItMatters:
          "Drugstore runs are frequent in Germany, so small repeated gains compound faster than one-off coupons.",
        watchouts: [
          "Not every item is boosted at the same time.",
          "The best savings often come from combining dm promos with active PAYBACK coupons.",
        ],
      },
      de: {
        title: "PAYBACK bei dm auf häufige Haushaltskäufe mitnehmen",
        summary:
          "Bei dm lassen sich Alltagskäufe in der Drogerie mit PAYBACK Punkten und App-Vorteilen kombinieren.",
        benefit: "Punkte und Coupon-Stacking auf wiederkehrende Basics.",
        eligibility: "PAYBACK Karte oder App-Barcode an der dm Kasse.",
        whyItMatters:
          "Drogerie-Einkäufe kommen regelmäßig vor und bringen deshalb über die Zeit mehr als ein einmaliger Gutschein.",
        watchouts: [
          "Nicht alle Artikel sind gleichzeitig geboostert.",
          "Am meisten bringt die Kombination aus dm Aktionen und aktivierten PAYBACK Coupons.",
        ],
      },
    },
  },
  {
    id: "dm-glueckskind",
    rank: 14,
    brand: "dm Glueckskind",
    category: "family",
    status: "ongoing",
    officialUrl: "https://www.dm.de/glueckskind",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "dm Glueckskind adds targeted perks for pregnancy and young families",
        summary:
          "dm's family program is designed around pregnancy, babies, and early family shopping needs inside a chain many households already use.",
        benefit: "Family-focused coupons, samples, and targeted dm perks.",
        eligibility: "Relevant life stage plus dm program participation.",
        whyItMatters:
          "For young families, targeted baby and care offers can beat generic percentage coupons by a wide margin.",
        watchouts: [
          "The value depends on the household actually matching the target group.",
          "Program benefits can vary by stage and campaign.",
        ],
      },
      de: {
        title: "dm Glückskind bringt gezielte Vorteile für Schwangerschaft und junge Familien",
        summary:
          "Das Familienprogramm von dm richtet sich an Schwangerschaft, Babyzeit und frühe Familienphase in einer Kette, die viele Haushalte ohnehin nutzen.",
        benefit: "Familienbezogene Coupons, Proben und gezielte dm Vorteile.",
        eligibility: "Passende Lebensphase plus Teilnahme am dm Programm.",
        whyItMatters:
          "Gerade für junge Familien können gezielte Baby- und Pflegevorteile deutlich wertvoller sein als allgemeine Prozentaktionen.",
        watchouts: [
          "Sinnvoll ist das nur für passende Haushaltssituationen.",
          "Der Vorteilsmix kann sich je nach Phase und Kampagne ändern.",
        ],
      },
    },
  },
  {
    id: "lidl-plus",
    rank: 4,
    brand: "Lidl Plus",
    category: "groceries",
    status: "ongoing",
    officialUrl: "https://www.lidl.de/c/lidl-plus/s10007388",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Use Lidl Plus points, coupons, and app-only grocery savings",
        summary:
          "Lidl Plus now combines coupons, partner perks, digital receipts, and the new Lidl Points reward system launched in Germany on 1 June 2026.",
        benefit: "Coupons plus Lidl Points that can be redeemed for selected rewards and value coupons.",
        eligibility: "Lidl Plus app account and identification with the app at checkout or online.",
        whyItMatters:
          "The new points system makes Lidl Plus more flexible than the old monthly collector because points can be saved toward chosen rewards.",
        watchouts: [
          "Coupons and extra-points campaigns still need app activation.",
          "Lidl Points expire after 24 months, so users should not treat them like cash.",
        ],
      },
      de: {
        title: "Lidl Plus für Punkte, Coupons und App-Rabatte im Supermarkt nutzen",
        summary:
          "Lidl Plus bündelt Coupons, Partnervorteile, digitale Bons und seit 1. Juni 2026 das neue Lidl Punkte-System in Deutschland.",
        benefit: "Coupons plus Lidl Punkte, die gegen ausgewählte Prämien und Wert-Coupons eingelöst werden können.",
        eligibility: "Lidl Plus App-Konto und Identifikation per App an der Kasse oder online.",
        whyItMatters:
          "Das neue Punktesystem ist flexibler als der alte monatliche Sammler, weil Punkte auf Wunschprämien angespart werden können.",
        watchouts: [
          "Coupons und Extrapunkte-Aktionen müssen weiterhin in der App aktiviert werden.",
          "Lidl Punkte verfallen nach 24 Monaten und sind kein Bargeldersatz.",
        ],
      },
    },
  },
  {
    id: "lidl-disney-plus",
    rank: 23,
    brand: "Lidl Plus x Disney+",
    category: "shopping",
    status: "limited",
    officialUrl: "https://www.lidl.de/c/lidl-plus-x-disney/s10057267",
    verifiedAt: "2026-07-20T10:00:00+02:00",
    copy: {
      en: {
        title: "Redeem Lidl Points for a lower Disney+ monthly price",
        summary:
          "Lidl Plus lists monthly Disney+ point-redemption tiers and a free first month for eligible new customers after a EUR 20 minimum purchase.",
        benefit: "Lower monthly Disney+ prices by redeeming Lidl Points.",
        eligibility: "Lidl Plus account; the free first month is limited to eligible new customers and requires a EUR 20 minimum purchase.",
        whyItMatters:
          "This is a mainstream entertainment perk tied to a mass-market grocery app, so awareness is high and adoption is easy.",
        watchouts: [
          "Point requirements and plan prices differ by Disney+ tier.",
          "Check the current Lidl terms before redeeming because partner conditions can change.",
        ],
      },
      de: {
        title: "Lidl Punkte für einen günstigeren Disney+ Monatspreis einlösen",
        summary:
          "Lidl Plus nennt monatliche Disney+ Einlösestufen und einen Gratismonat für berechtigte Neukunden nach einem Mindesteinkauf von 20 Euro.",
        benefit: "Niedrigere monatliche Disney+ Preise durch das Einlösen von Lidl Punkten.",
        eligibility: "Lidl Plus Konto; der Gratismonat gilt nur für berechtigte Neukunden und setzt 20 Euro Mindesteinkauf voraus.",
        whyItMatters:
          "Der Vorteil verbindet einen Mainstream-Streamingdienst mit einer sehr verbreiteten Einkaufs-App und ist dadurch für viele sofort nutzbar.",
        watchouts: [
          "Punktebedarf und Tarifpreis unterscheiden sich je nach Disney+ Paket.",
          "Vor dem Einlösen die aktuellen Lidl Bedingungen prüfen, da sich Partnerkonditionen ändern können.",
        ],
      },
    },
  },
  {
    id: "lidl-family-club",
    rank: 13,
    brand: "Lidl Family Club",
    category: "family",
    status: "ongoing",
    officialUrl: "https://www.lidl.de/c/lidl-babyboxen/s10011221",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Family households can activate Lidl's Family Club perks",
        summary:
          "Lidl's Family Club page says families with children aged 0 to 5 can receive family-specific weekly coupons inside Lidl Plus, alongside the baby box flow.",
        benefit: "Age-targeted family coupons and Lidl baby box benefits inside the Lidl Plus ecosystem.",
        eligibility: "Lidl Plus profile with relevant child age details entered.",
        whyItMatters:
          "For households with small children, recurring nappies, baby food, and family grocery purchases can make targeted coupons more valuable than generic offers.",
        watchouts: [
          "This only makes sense for households with young children.",
          "Coupons depend on the Lidl Plus profile data and current campaign rules.",
        ],
      },
      de: {
        title: "Familien können die Lidl Family Club Vorteile aktivieren",
        summary:
          "Lidl schreibt auf der Family-Club-Seite, dass Familien mit Kindern von 0 bis 5 Jahren in Lidl Plus familienbezogene wöchentliche Coupons und Babybox-Vorteile erhalten können.",
        benefit: "Altersbezogene Familien-Coupons und Lidl Babybox-Vorteile innerhalb von Lidl Plus.",
        eligibility: "Lidl Plus Profil mit passenden Angaben zum Alter der Kinder.",
        whyItMatters:
          "Bei Haushalten mit kleinen Kindern können wiederkehrende Windel-, Babyfood- und Familieneinkäufe gezielte Coupons wertvoller machen als allgemeine Angebote.",
        watchouts: [
          "Relevant ist das nur für Haushalte mit kleinen Kindern.",
          "Coupons hängen von den Lidl Plus Profildaten und den aktuellen Aktionsregeln ab.",
        ],
      },
    },
  },
  {
    id: "kaufland-xtra",
    rank: 8,
    brand: "Kaufland Card XTRA",
    category: "groceries",
    status: "ongoing",
    officialUrl: "https://filiale.kaufland.de/kaufland-xtra.html",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Use Kaufland Card XTRA for coupons, points, and supermarket promos",
        summary:
          "Kaufland Card XTRA launched in Germany in February 2026 and combines personalized savings, points, and campaign-based rewards.",
        benefit: "Coupons, points, and periodic bonus actions; Kaufland states that EUR 1 of shopping equals 1 point in the app.",
        eligibility: "Kaufland Card XTRA registration and app/card scan at checkout or eligible online use.",
        whyItMatters:
          "Kaufland baskets are often large, so a transparent points layer plus coupons can scale faster than small one-off promos.",
        watchouts: [
          "Many benefits are personalized, so two users may not see the same offers.",
          "Points, coupons, and rewards can have campaign-specific expiry and redemption rules.",
        ],
      },
      de: {
        title: "Kaufland Card XTRA für Coupons, Punkte und Marktaktionen nutzen",
        summary:
          "Kaufland Card XTRA ist im Februar 2026 in Deutschland gestartet und verbindet personalisierte Rabatte, Punkte und Aktionsvorteile.",
        benefit: "Coupons, Punkte und regelmäßige Bonusaktionen; laut Kaufland entspricht EUR 1 Einkauf einem Punkt in der App.",
        eligibility: "Kaufland Card XTRA Registrierung und App-/Kartenscan an der Kasse oder berechtigte Online-Nutzung.",
        whyItMatters:
          "Bei großen Kaufland-Einkaufskörben kann eine transparente Punkteschicht plus Coupons schneller relevant werden als kleine Einzelaktionen.",
        watchouts: [
          "Viele Vorteile sind personalisiert und daher nicht für alle gleich.",
          "Punkte, Coupons und Prämien können aktionsspezifische Ablauf- und Einlöseregeln haben.",
        ],
      },
    },
  },
  {
    id: "rossmann-app",
    rank: 9,
    brand: "ROSSMANN App",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.rossmann.de/de/service-und-hilfe/rossmann-app",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Check the ROSSMANN app before every drugstore run",
        summary:
          "ROSSMANN's app remains one of the most common places to find rotating percentage coupons and product deals in Germany.",
        benefit: "Recurring app coupons and in-store savings.",
        eligibility: "ROSSMANN app usage.",
        whyItMatters:
          "This is one of the most mainstream savings habits for household, baby, and personal care shopping.",
        watchouts: [
          "Coupon sets rotate frequently and exclusions apply.",
          "The percentage coupon is not always universal.",
        ],
      },
      de: {
        title: "Vor jedem Drogerie-Einkauf die ROSSMANN App prüfen",
        summary:
          "Die ROSSMANN App bleibt eine der häufigsten Quellen für rotierende Prozent-Coupons und Produktangebote in Deutschland.",
        benefit: "Wiederkehrende App-Coupons und Marktvorteile.",
        eligibility: "Nutzung der ROSSMANN App.",
        whyItMatters:
          "Gerade für Haushalt, Baby und Pflege ist das eine der verbreitetsten Spargewohnheiten im Alltag.",
        watchouts: [
          "Coupon-Sets wechseln häufig und es gelten Ausschlüsse.",
          "Der Prozent-Coupon ist nicht immer universell einsetzbar.",
        ],
      },
    },
  },
  {
    id: "rossmann-babywelt",
    rank: 15,
    brand: "ROSSMANN babywelt",
    category: "family",
    status: "ongoing",
    officialUrl: "https://www.rossmann.de/de/baby-kind/babywelt",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "ROSSMANN babywelt is still one of the best-known family perk programs",
        summary:
          "ROSSMANN babywelt focuses on pregnancy and family needs with targeted vouchers and member-style benefits.",
        benefit: "Pregnancy and baby-focused vouchers in a mainstream drugstore ecosystem.",
        eligibility: "ROSSMANN babywelt participation.",
        whyItMatters:
          "Families often use both dm and ROSSMANN, so comparing both programs can materially reduce repeat care spending.",
        watchouts: [
          "This only matters for the relevant household type.",
          "Voucher depth changes by stage and campaign timing.",
        ],
      },
      de: {
        title: "ROSSMANN babywelt bleibt eines der bekanntesten Familienprogramme",
        summary:
          "ROSSMANN babywelt richtet sich an Schwangerschaft und Familienalltag mit gezielten Gutscheinen und Vorteilen.",
        benefit: "Gutscheine und Familienvorteile in einer sehr verbreiteten Drogerie-Kette.",
        eligibility: "Teilnahme an ROSSMANN babywelt.",
        whyItMatters:
          "Viele Familien nutzen sowohl dm als auch ROSSMANN, daher lohnt sich der Vergleich beider Programme direkt.",
        watchouts: [
          "Relevant ist das nur für passende Haushaltssituationen.",
          "Die Gutschein-Tiefe ändert sich je nach Phase und Kampagne.",
        ],
      },
    },
  },
  {
    id: "ikea-family",
    rank: 16,
    brand: "IKEA Family",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.ikea.com/de/de/ikea-family/",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "IKEA Family combines member prices with Rewards points",
        summary:
          "IKEA Family now layers free membership perks with Rewards points that can be redeemed for vouchers such as purchase discounts, restaurant rewards, delivery discounts, or Click & Collect perks.",
        benefit: "Member prices plus Rewards vouchers from regular IKEA shopping and account activity.",
        eligibility: "Free IKEA Family membership and the current IKEA Rewards mechanics.",
        whyItMatters:
          "Move-ins and home setup phases create large baskets, so IKEA member prices plus rewards can save more than small weekly coupons.",
        watchouts: [
          "This matters most for users already planning IKEA purchases.",
          "Reward categories and thresholds can change, so check the current rules before relying on them.",
        ],
      },
      de: {
        title: "IKEA Family kombiniert Mitgliederpreise mit Rewards-Punkten",
        summary:
          "IKEA Family verbindet kostenlose Mitglieder-Vorteile inzwischen mit Rewards-Punkten, die gegen Gutscheine wie Einkaufsrabatte, Restaurant-Vorteile, Liefer-Rabatte oder Click-&-Collect-Vorteile eingelöst werden können.",
        benefit: "Mitgliederpreise plus Rewards-Gutscheine aus IKEA Einkäufen und Kontoaktivität.",
        eligibility: "Kostenlose IKEA Family Mitgliedschaft und die jeweils geltenden IKEA Rewards-Regeln.",
        whyItMatters:
          "Gerade bei Umzug und Haushaltsaufbau entstehen große Warenkörbe, bei denen Mitgliederpreise plus Rewards mehr bringen können als kleine Wochen-Coupons.",
        watchouts: [
          "Relevant ist das vor allem bei ohnehin geplanten IKEA Käufen.",
          "Reward-Kategorien und Schwellen können sich ändern, daher vor Nutzung die aktuellen Regeln prüfen.",
        ],
      },
    },
  },
  {
    id: "mymediamarkt",
    rank: 18,
    brand: "myMediaMarkt",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.mediamarkt.de/de/about-us/app",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "myMediaMarkt adds app coupons and tech-shopping perks",
        summary:
          "The MediaMarkt app promotes myMediaMarkt and mySaturn membership benefits, including points, app coupons, price alerts, and purchase-related account perks.",
        benefit: "Weekly app coupons, points, and member-style savings on electronics shopping.",
        eligibility: "myMediaMarkt registration.",
        whyItMatters:
          "Electronics purchases are often large-ticket, so occasional member pricing can save more than grocery coupons.",
        watchouts: [
          "This matters most when you already plan to buy tech.",
          "Promos can be short-lived around campaign windows.",
        ],
      },
      de: {
        title: "myMediaMarkt bringt App-Coupons und Technik-Vorteile",
        summary:
          "Die MediaMarkt App bewirbt myMediaMarkt und mySaturn Vorteile wie Punkte, App-Coupons, Preisalarm und accountbezogene Vorteile rund um Technik-Einkäufe.",
        benefit: "Wöchentliche App-Coupons, Punkte und mitgliedsbezogene Ersparnisse bei Elektronik-Käufen.",
        eligibility: "myMediaMarkt Registrierung.",
        whyItMatters:
          "Elektronik ist oft ein großer Einzelposten, daher können Mitgliederpreise hier mehr bringen als viele kleine Supermarkt-Coupons.",
        watchouts: [
          "Relevant ist das vor allem, wenn ohnehin Technik-Käufe geplant sind.",
          "Viele Aktionen laufen nur in kurzen Kampagnenfenstern.",
        ],
      },
    },
  },
  {
    id: "hm-member",
    rank: 19,
    brand: "H&M Member",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www2.hm.com/de_de/member/info.html",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "H&M Member still offers member prices, points, and regular app promos",
        summary:
          "H&M's membership program combines points, member pricing, and fashion offers inside a mainstream retail brand.",
        benefit: "Member prices, points, and campaign-based clothing deals.",
        eligibility: "H&M Member account.",
        whyItMatters:
          "For basic clothing and seasonal shopping, H&M remains one of the most visible retail programs in Germany.",
        watchouts: [
          "Fashion discounts can drive impulse buying if you were not planning a purchase.",
          "The real value depends on member-price availability for relevant items.",
        ],
      },
      de: {
        title: "H&M Member bietet weiter Mitgliederpreise, Punkte und regelmäßige App-Aktionen",
        summary:
          "Das H&M Programm kombiniert Punkte, Mitgliederpreise und Fashion-Angebote innerhalb einer sehr sichtbaren Retail-Marke.",
        benefit: "Mitgliederpreise, Punkte und kampagnenbasierte Rabatte für Kleidung.",
        eligibility: "H&M Member Konto.",
        whyItMatters:
          "Für Basic-Kleidung und saisonale Einkäufe bleibt H&M eines der bekanntesten Programme in Deutschland.",
        watchouts: [
          "Mode-Rabatte verleiten leicht zu Impulskäufen.",
          "Der echte Nutzen hängt davon ab, ob relevante Artikel gerade als Member-Preis laufen.",
        ],
      },
    },
  },
  {
    id: "mymcdonalds",
    rank: 20,
    brand: "MyMcDonald's",
    category: "food",
    status: "ongoing",
    officialUrl: "https://www.mcdonalds.com/de/de-de/mymcdonalds.html",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Use the McDonald's app for rotating coupons and rewards",
        summary:
          "The MyMcDonald's app continues to be one of Germany's most widely recognised fast-food savings channels.",
        benefit: "App coupons and reward points in a mainstream food app.",
        eligibility: "McDonald's app account.",
        whyItMatters:
          "For users who already buy fast food, app pricing is usually better than ordering without the app.",
        watchouts: [
          "Coupon quality changes frequently.",
          "It only saves money if it replaces, rather than creates, a purchase.",
        ],
      },
      de: {
        title: "Die McDonald's App für rotierende Coupons und Rewards nutzen",
        summary:
          "Die MyMcDonald's App bleibt einer der bekanntesten Sparkanäle für Fast Food in Deutschland.",
        benefit: "App-Coupons und Reward-Punkte in einer Mainstream-Food-App.",
        eligibility: "McDonald's App-Konto.",
        whyItMatters:
          "Wer dort ohnehin kauft, bekommt über die App meist bessere Preise als ohne App-Bestellung.",
        watchouts: [
          "Die Coupon-Qualität wechselt häufig.",
          "Sparen funktioniert nur, wenn der Kauf ohnehin geplant war.",
        ],
      },
    },
  },
  {
    id: "too-good-to-go",
    rank: 12,
    brand: "Too Good To Go",
    category: "food",
    status: "ongoing",
    officialUrl: "https://www.toogoodtogo.com/de/how-does-the-app-work",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Too Good To Go is still one of the most practical food-saving apps",
        summary:
          "The app helps users pick up unsold food from nearby bakeries, supermarkets, and restaurants at reduced prices.",
        benefit: "Discounted surprise bags from local food businesses.",
        eligibility: "Too Good To Go app and local participating stores.",
        whyItMatters:
          "It combines savings with convenience and works in many German cities, especially for bakery and grocery pickups.",
        watchouts: [
          "Availability is highly location- and time-dependent.",
          "You do not choose the exact items in advance.",
        ],
      },
      de: {
        title: "Too Good To Go bleibt eine der praktischsten Apps zum Sparen bei Essen",
        summary:
          "Die App hilft dabei, übrig gebliebenes Essen von Bäckereien, Supermärkten und Restaurants in der Nähe günstiger abzuholen.",
        benefit: "Vergünstigte Überraschungstüten lokaler Food-Anbieter.",
        eligibility: "Too Good To Go App und teilnehmende Läden in der Umgebung.",
        whyItMatters:
          "Die App verbindet Ersparnis und Alltagstauglichkeit und funktioniert in vielen deutschen Städten, besonders bei Bäckern und Supermärkten.",
        watchouts: [
          "Verfügbarkeit hängt stark von Ort und Uhrzeit ab.",
          "Der genaue Inhalt ist vorher nicht frei wählbar.",
        ],
      },
    },
  },
  {
    id: "bahncard-25",
    rank: 11,
    brand: "BahnCard 25",
    category: "travel",
    status: "ongoing",
    officialUrl: "https://www.bahn.de/angebot/bahncard/bahncard25",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "BahnCard 25 remains the easiest recurring rail discount to understand",
        summary:
          "Deutsche Bahn's BahnCard 25 offers a straightforward fare reduction for many train journeys.",
        benefit: "25% discount on many Deutsche Bahn fares.",
        eligibility: "Paid BahnCard 25 membership.",
        whyItMatters:
          "For anyone taking medium or long-distance trains more than occasionally, this can pay back quickly.",
        watchouts: [
          "It is only worth it when your annual train spending is high enough.",
          "Check renewal terms before purchase.",
        ],
      },
      de: {
        title: "Die BahnCard 25 bleibt der einfachste wiederkehrende Bahn-Rabatt",
        summary:
          "Die BahnCard 25 der Deutschen Bahn bietet eine leicht verständliche Preisreduktion für viele Zugfahrten.",
        benefit: "25 Prozent Rabatt auf viele Deutsche-Bahn-Tarife.",
        eligibility: "Kostenpflichtige BahnCard 25.",
        whyItMatters:
          "Wer mehr als nur selten Fernverkehr fährt, holt die Kosten oft schnell wieder rein.",
        watchouts: [
          "Sie lohnt sich nur bei ausreichend hohem Bahn-Umsatz im Jahr.",
          "Vor dem Kauf die Verlängerungsbedingungen prüfen.",
        ],
      },
    },
  },
  {
    id: "edeka-app",
    rank: 5,
    brand: "EDEKA App",
    category: "groceries",
    status: "ongoing",
    officialUrl: "https://www.edeka.de/services/edeka-app/",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Use the EDEKA app for weekly app discounts and PAYBACK in one flow",
        summary:
          "EDEKA promotes app-only discounts, coupons, loyalty actions, mobile payment, shopping lists, and PAYBACK linking inside the EDEKA app.",
        benefit: "Weekly app discounts plus PAYBACK points and eCoupons at participating EDEKA stores.",
        eligibility: "EDEKA app account, participating local market, and optional linked PAYBACK account.",
        whyItMatters:
          "EDEKA is a mainstream supermarket for many households, and the app can combine store-specific savings with PAYBACK without scanning two separate cards.",
        watchouts: [
          "EDEKA is cooperative, so participation and exact offers can vary by market.",
          "PAYBACK linking is useful only if the user's preferred EDEKA market supports the flow.",
        ],
      },
      de: {
        title: "Die EDEKA App für Wochenrabatte und PAYBACK in einem Ablauf nutzen",
        summary:
          "EDEKA bewirbt App-Rabatte, Coupons, Treueaktionen, mobiles Bezahlen, Einkaufslisten und PAYBACK-Verknüpfung in der EDEKA App.",
        benefit: "Wöchentliche App-Rabatte plus PAYBACK Punkte und eCoupons bei teilnehmenden EDEKA Märkten.",
        eligibility: "EDEKA App-Konto, teilnehmender Markt und optional verknüpftes PAYBACK Konto.",
        whyItMatters:
          "EDEKA ist für viele Haushalte ein Standardsupermarkt und die App kann marktbezogene Vorteile mit PAYBACK bündeln, ohne zwei Karten zu scannen.",
        watchouts: [
          "EDEKA ist genossenschaftlich organisiert, daher können Teilnahme und konkrete Angebote je Markt variieren.",
          "Die PAYBACK-Verknüpfung lohnt sich vor allem, wenn der Stamm-Markt den Ablauf unterstützt.",
        ],
      },
    },
  },
  {
    id: "netto-plus",
    rank: 6,
    brand: "Netto plus App",
    category: "groceries",
    status: "ongoing",
    officialUrl: "https://www.netto-online.de/ueber-netto/Netto-App.chtm",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Netto plus App combines weekly coupons with PAYBACK linking",
        summary:
          "Netto Marken-Discount's app highlights weekly coupons, app offers, mobile payment, receipts, and PAYBACK card linking.",
        benefit: "Netto app discounts plus PAYBACK points and coupons in one supermarket app.",
        eligibility: "Registered Netto plus account and, for points, a linked PAYBACK account.",
        whyItMatters:
          "Netto is a large discount chain, so app coupons can matter for price-sensitive grocery baskets.",
        watchouts: [
          "Netto's advertised maximum savings depend on using multiple rotating app actions, not one guaranteed discount.",
          "Coupons can exclude deposits, tobacco, books, infant formula, vouchers, and other categories.",
        ],
      },
      de: {
        title: "Netto plus App verbindet Wochen-Coupons mit PAYBACK-Verknüpfung",
        summary:
          "Die Netto Marken-Discount App bündelt wöchentliche Coupons, App-Angebote, mobiles Bezahlen, digitale Bons und PAYBACK-Verknüpfung.",
        benefit: "Netto App-Rabatte plus PAYBACK Punkte und Coupons in einer Supermarkt-App.",
        eligibility: "Registriertes Netto plus Konto und für Punkte ein verknüpftes PAYBACK Konto.",
        whyItMatters:
          "Netto ist ein großer Discounter, daher können App-Coupons bei preisbewussten Lebensmittelkörben spürbar sein.",
        watchouts: [
          "Die beworbenen Maximalersparnisse hängen von mehreren wechselnden App-Aktionen ab, nicht von einem garantierten Rabatt.",
          "Coupons können Pfand, Tabak, Bücher, Säuglingsanfangsnahrung, Gutscheine und weitere Kategorien ausschließen.",
        ],
      },
    },
  },
  {
    id: "deutschlandticket",
    rank: 10,
    brand: "Deutschlandticket",
    category: "travel",
    status: "ongoing",
    officialUrl: "https://int.bahn.de/en/offers/regional/deutschland-ticket",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Deutschlandticket gives nationwide local transport for EUR 63/month",
        summary:
          "The Deutschlandticket is a monthly cancellable subscription for local and regional public transport across Germany, priced at EUR 63 in 2026.",
        benefit: "Unlimited local and regional public transport in Germany for one fixed monthly price.",
        eligibility: "Personal subscription; local and regional transport only, not ICE/IC/EC long-distance trains.",
        whyItMatters:
          "For commuters, students, and city-to-city regional trips, this can beat separate monthly passes quickly.",
        watchouts: [
          "Cancel by the 10th of the month if you do not want the subscription to continue into the next month.",
          "It is personal, non-transferable, and not valid on long-distance trains.",
        ],
      },
      de: {
        title: "Deutschlandticket: bundesweiter Nahverkehr für 63 EUR im Monat",
        summary:
          "Das Deutschlandticket ist ein monatlich kündbares Abo für den Nah- und Regionalverkehr in Deutschland und kostet 2026 EUR 63.",
        benefit: "Deutschlandweit Nah- und Regionalverkehr für einen festen Monatspreis nutzen.",
        eligibility: "Persönliches Abo; nur Nah- und Regionalverkehr, nicht ICE/IC/EC-Fernverkehr.",
        whyItMatters:
          "Für Pendler, Studierende und regionale Fahrten zwischen Städten kann es einzelne Monatskarten schnell schlagen.",
        watchouts: [
          "Bis zum 10. des Monats kündigen, wenn das Abo nicht in den Folgemonat laufen soll.",
          "Das Ticket ist personenbezogen, nicht übertragbar und gilt nicht im Fernverkehr.",
        ],
      },
    },
  },
  {
    id: "mueller-app",
    rank: 17,
    brand: "Müller App",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.mueller.de/service/app/",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Müller App adds coupons, points, receipts, and BabyClub access",
        summary:
          "Müller positions its app as a digital customer card with coupons, the Müller Blüten points program, receipts, mobile payment, and BabyClub features.",
        benefit: "Drugstore coupons, points, digital receipts, and family-oriented app benefits.",
        eligibility: "Registered Müller app account; coupons must be activated and customer card scanned.",
        whyItMatters:
          "Müller fills the gap for users whose local drugstore is not dm or ROSSMANN, especially in cities with strong Müller coverage.",
        watchouts: [
          "Müller Blüten cannot usually be credited after checkout if the card was not scanned.",
          "Coupon conditions and BabyClub benefits vary by campaign.",
        ],
      },
      de: {
        title: "Müller App bringt Coupons, Blüten, Bons und BabyClub-Zugang",
        summary:
          "Müller positioniert die App als digitale Kundenkarte mit Coupons, Müller Blütenprogramm, digitalen Bons, mobilem Bezahlen und BabyClub-Funktionen.",
        benefit: "Drogerie-Coupons, Punkte, digitale Bons und familienbezogene App-Vorteile.",
        eligibility: "Registriertes Müller App-Konto; Coupons müssen aktiviert und die Kundenkarte gescannt werden.",
        whyItMatters:
          "Müller schließt die Lücke für Nutzer, deren nächste Drogerie nicht dm oder ROSSMANN ist, besonders in Städten mit guter Müller-Abdeckung.",
        watchouts: [
          "Müller Blüten können meist nicht nachträglich verbucht werden, wenn die Karte nicht gescannt wurde.",
          "Coupon-Bedingungen und BabyClub-Vorteile wechseln je nach Aktion.",
        ],
      },
    },
  },
  {
    id: "decathlon-membership",
    rank: 21,
    brand: "Decathlon Membership",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.decathlon.de/MyDecathlon-LP-Account_lp-GAOG77",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Decathlon Membership can save on sports and outdoor basics",
        summary:
          "Decathlon Germany promotes membership benefits such as a newsletter welcome discount, app customer card, account-based receipts, exclusive offers, and easier returns.",
        benefit: "One-time welcome discount plus member services and future exclusive offers.",
        eligibility: "Decathlon account and, for the welcome discount, newsletter confirmation under Decathlon's conditions.",
        whyItMatters:
          "Sports gear, bikes, backpacks, and kids' equipment can be large one-off purchases where a verified member discount matters.",
        watchouts: [
          "The welcome discount is one-time, online-only, time-limited, and excludes marketplace or reduced items.",
          "Do not join just for coupons if you are not already planning a sports purchase.",
        ],
      },
      de: {
        title: "Decathlon Membership kann bei Sport- und Outdoor-Basics sparen",
        summary:
          "Decathlon Deutschland bewirbt Membership-Vorteile wie Newsletter-Willkommensrabatt, App-Kundenkarte, accountbasierte Bons, exklusive Angebote und einfachere Retouren.",
        benefit: "Einmaliger Willkommensrabatt plus Member-Services und künftige exklusive Angebote.",
        eligibility: "Decathlon Konto und für den Willkommensrabatt Newsletter-Bestätigung nach Decathlon-Bedingungen.",
        whyItMatters:
          "Sportausrüstung, Fahrradzubehör, Rucksäcke und Kinder-Equipment sind oft größere Einzelkäufe, bei denen ein verifizierter Member-Rabatt zählt.",
        watchouts: [
          "Der Willkommensrabatt ist einmalig, nur online, zeitlich begrenzt und nicht für Marktplatz- oder reduzierte Artikel gültig.",
          "Nur wegen Coupons anmelden lohnt sich nicht, wenn kein Sportkauf geplant ist.",
        ],
      },
    },
  },
  {
    id: "amazon-prime-18-22",
    rank: 22,
    brand: "Amazon Prime 18-22",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.aboutamazon.de/news/amazon-prime-und-shopping/prime-student",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Amazon Prime is 50% off for 18- to 22-year-olds in Germany",
        summary:
          "Amazon Germany says the former student-only Prime discount has been replaced by a 50% Prime discount for all 18- to 22-year-olds, with no student proof required.",
        benefit: "Discounted Prime at EUR 4.49/month or EUR 44.90/year instead of the regular German Prime price listed by Amazon.",
        eligibility: "Amazon account holder aged 18 to 22 in Germany, subject to Amazon's verification and current terms.",
        whyItMatters:
          "This is useful for students, apprentices, trainees, and young workers setting up life in Germany, especially when delivery and video are both used.",
        watchouts: [
          "It becomes poor value if Prime mainly triggers extra impulse purchases.",
          "Check renewal and age-out terms before relying on the discounted price.",
        ],
      },
      de: {
        title: "Amazon Prime gibt es in Deutschland 50 Prozent günstiger für 18- bis 22-Jährige",
        summary:
          "Amazon Deutschland schreibt, dass der frühere reine Studentenrabatt durch 50 Prozent Prime-Rabatt für alle 18- bis 22-Jährigen ersetzt wurde, ohne Studentennachweis.",
        benefit: "Vergünstigtes Prime für EUR 4,49/Monat oder EUR 44,90/Jahr statt des von Amazon genannten regulären Deutschland-Preises.",
        eligibility: "Amazon Konto in Deutschland und Alter von 18 bis 22 Jahren, vorbehaltlich Amazons Prüfung und aktueller Bedingungen.",
        whyItMatters:
          "Nützlich für Studierende, Azubis, Trainees und junge Berufseinsteiger, wenn Lieferung und Video tatsächlich genutzt werden.",
        watchouts: [
          "Schlechter Deal, wenn Prime vor allem zusätzliche Impulskäufe auslöst.",
          "Vor Nutzung die Verlängerungs- und Altersgrenzen prüfen.",
        ],
      },
    },
  },
  {
    id: "thalia-kultclub",
    rank: 24,
    brand: "Thalia KultClub",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.thalia.de/vorteile/club/club-aktion",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Thalia KultClub adds shipping and coupon value for regular readers",
        summary:
          "Thalia's loyalty program bundles member actions such as coupons, partner perks, and shipping-related advantages.",
        benefit: "Member coupons and convenience perks for books and gifts.",
        eligibility: "Thalia KultClub membership.",
        whyItMatters:
          "Books, school supplies, and gifts are common recurring purchases, so regular Thalia customers can extract steady value.",
        watchouts: [
          "This matters most for users who already buy from Thalia.",
          "Fixed-price book rules in Germany limit discount depth on many titles.",
        ],
      },
      de: {
        title: "Thalia KultClub bringt Versand- und Coupon-Vorteile für regelmäßige Leser",
        summary:
          "Das Thalia Programm bündelt Aktionen wie Coupons, Partner-Vorteile und praktische Versandvorteile.",
        benefit: "Mitglieder-Coupons und Komfortvorteile für Bücher und Geschenke.",
        eligibility: "Thalia KultClub Mitgliedschaft.",
        whyItMatters:
          "Bücher, Schulbedarf und Geschenke sind wiederkehrende Ausgaben, daher kann das für regelmäßige Thalia Kunden sinnvoll sein.",
        watchouts: [
          "Relevant ist das vor allem für Menschen, die ohnehin bei Thalia kaufen.",
          "Die Buchpreisbindung in Deutschland begrenzt bei vielen Titeln die Rabatt-Tiefe.",
        ],
      },
    },
  },
];

export function getAllOffers(lang: Lang): Offer[] {
  return offerDefinitions
    .map((offer) => ({
      id: offer.id,
      rank: offer.rank,
      brand: offer.brand,
      category: offer.category,
      status: offer.status,
      officialUrl: offer.officialUrl,
      verifiedAt: offer.verifiedAt,
      ...offer.copy[lang],
    }))
    .sort((a, b) => a.rank - b.rank);
}

export function getFeaturedOffers(lang: Lang, count = 3): Offer[] {
  return getAllOffers(lang).slice(0, count);
}

export function getLatestOfferVerificationDate(): string {
  return offerDefinitions
    .map((offer) => offer.verifiedAt)
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0];
}

export function formatOfferVerification(value: string, lang: Lang): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "de-DE", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}
